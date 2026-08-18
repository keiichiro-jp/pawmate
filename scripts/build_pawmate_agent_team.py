#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate PawMate agent-team AFOS 003-010 artifacts.

The source of truth is `pawmate_agent_team.md`. This script extracts A01-A18
and writes one folder per agent under `agents/pawmate-agent-team/`.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "pawmate_agent_team.md"
OUT = ROOT / "agents" / "pawmate-agent-team"

COMMON_DOCS = [
    "pawmate_agent_team.md",
    "pawmate_roadmap.md",
    "pawmate_tickets.md",
    "pawmate_daily_calendar_fast.md",
]

DOMAIN_DOCS = {
    "A01": ["pawmate_roadmap.md", "pawmate_tickets.md", "pawmate_daily_calendar_fast.md"],
    "A02": ["pawmate_capabilities.md", "pawmate_service_blueprint.md"],
    "A03": ["pawmate_animal_handling_scheme.md", "pawmate_risk.md"],
    "A04": ["pawmate_insurance_scheme.md", "pawmate_risk.md"],
    "A05": ["pawmate_service_blueprint.md", "pawmate_cjm.md"],
    "A06": ["src/data/pawmateData.ts", "src/App.tsx", "src/styles.css"],
    "A07": ["pawmate_service_blueprint.md", "pawmate_risk.md"],
    "A08": ["pawmate_stp.md", "pawmate_4p.md", "pawmate_how_to_win.md"],
    "A09": ["pawmate_finance.md", "pawmate_unit_economics.md"],
    "A10": ["pawmate_usa_research.md", "petcare_research_report.md"],
    "A11": ["pawmate_service_blueprint.md", "pawmate_trainer_proposal.md"],
    "A12": ["pawmate_risk.md", "pawmate_animal_handling_scheme.md"],
    "A13": ["pawmate_roadmap.md", "pawmate_stp.md"],
    "A14": ["pawmate_capabilities.md", "pawmate_service_blueprint.md"],
    "A15": ["pawmate_stp.md", "pawmate_4p.md"],
    "A16": ["pawmate_business_plan.md", "pawmate_4p.md"],
    "A17": ["pawmate_finance.md", "pawmate_unit_economics.md", "pawmate_business_plan.md"],
    "A18": ["pawmate_finance.md", "pawmate_unit_economics.md"],
}

TAGLINES = {
    "A01": "今日の5チケットとGateを一本に束ねる",
    "A02": "関係性を壊さず供給ネットワークを事業化する",
    "A03": "行政・専門家に渡せる論点へ整理する",
    "A04": "保険・審査・事故対応を信頼インフラに変える",
    "A05": "最初の1件に必要な体験だけを仕様化する",
    "A06": "小さく実装し、画面で確認できる状態まで運ぶ",
    "A07": "初回取引を迷わず回せる運用に落とす",
    "A08": "茅ヶ崎で信頼が広がる獲得導線を作る",
    "A09": "Gate判断に必要な数字を一枚にまとめる",
    "A10": "外部確認が必要な論点を出典付きで固める",
    "A11": "あとで迷わない手順と記録を残す",
    "A12": "進める前に事故・炎上・品質リスクを止める",
    "A13": "供給ファーストで湘南5市へ広げる",
    "A14": "ケアラーが続けたくなる学習と関係性を設計する",
    "A15": "地域検索からPawMateへつながる記事導線を作る",
    "A16": "法人利用の仮説を現実的な提案にする",
    "A17": "資金調達判断に必要な数字と物語を整える",
    "A18": "リピート・GMV・稼働率を意思決定可能な数字にする",
}

PROMPTS = {
    "A01": "PawMateのChief of Staffとして、今日の5チケットを進行管理してください。各チケットについて、目的、今日の完了ライン、Waitingに送る条件、Keiが判断すべきことを整理してください。最後に、今日絶対に落としてはいけない1つを明示してください。",
    "A02": "PawMateのPartnership & Caregiver担当として、ケアラー供給とパートナー関係を前に進めてください。チカ先生、Hey!Dogs、有資格ケアラー候補に対して、関係性を壊さずに事業協力へ進める文面・面談論点・管理表を作成してください。",
    "A03": "PawMateのLegal & Compliance担当として、動物愛護法、動物取扱業、行政相談、利用規約の論点を整理してください。法的助言はせず、行政・専門家に確認すべき質問、必要資料、判断待ち論点を明確にしてください。",
    "A04": "PawMateのTrust & Insurance担当として、保険、審査、安全、事故対応の設計を進めてください。損保会社へ相談するための補償範囲、事故シナリオ、契約方式、未解決リスクを整理してください。",
    "A05": "PawMateのProduct Managerとして、ロードマップ上の機能をMVPに切り分け、仕様・画面フロー・Acceptance Criteriaを作成してください。最初の1件を成立させるために必要なものを最優先にしてください。",
    "A06": "PawMateのVibe Engineering担当として、既存プロトタイプを読み、必要な実装を最小変更で進めてください。実装後はローカルで確認し、変更内容と未確認リスクを簡潔に報告してください。",
    "A07": "PawMateのOperations & CS担当として、初回取引、Meet & Greet、トラブル対応、ケアラーサポートを運用できる形にしてください。チェックリスト、テンプレート、エスカレーション基準を作成してください。",
    "A08": "PawMateのGrowth Marketing担当として、口コミ、近隣声がけ、チカ先生顧客案内、Instagram広告、地域提携、SEOを前に進めてください。広告より先に、茅ヶ崎で信頼を作る獲得導線を優先してください。",
    "A09": "PawMateのFinance & KPI担当として、GMV、収益、リピート率、ケアラー手取り、Unit Economicsを管理してください。Gate判断に必要な数字と、未達の場合の原因仮説を整理してください。",
    "A10": "PawMateのResearch & Intelligence担当として、行政窓口、保険会社、Stripe、競合、提携先、地域市場を調査してください。最新情報が必要な場合はWebで確認し、出典リンク付きで簡潔にまとめてください。",
    "A11": "PawMateのDocumentation担当として、議事録、手順書、マニュアル、提案資料、FAQを整備してください。あとで運用メンバーが読んでも迷わないように、短く、実行可能な形で書いてください。",
    "A12": "PawMateのRisk Review担当として、Gate前、外部送信前、リリース前のリスクを洗い出してください。重大度、発生可能性、最小対策、Go / No-Go判断を提示してください。",
}


@dataclass
class Agent:
    code: str
    index: int
    name: str
    slug: str
    role: str
    areas: list[str]
    tickets: list[str]
    outputs: list[str]
    questions: list[str]
    notes: list[str]
    cadence: list[str]
    source_block: str

    @property
    def agent_id(self) -> str:
        return f"pawmate_{self.code.lower()}"

    @property
    def folder(self) -> str:
        return f"agent-{self.index:02d}-{self.slug}"

    @property
    def tagline(self) -> str:
        return TAGLINES.get(self.code, f"{self.name}の判断材料を実行可能な形にする")

    @property
    def prompt(self) -> str:
        return PROMPTS.get(
            self.code,
            f"PawMateの{self.name}として、担当チケットを前に進めるための論点、成果物、Keiの確認事項を整理してください。",
        )

    @property
    def priority_band(self) -> str:
        if self.index <= 6:
            return "Priority 1"
        if self.index <= 10:
            return "Priority 2"
        if self.index <= 12:
            return "Priority 3"
        return "Phase 3 candidate"


def slugify(name: str) -> str:
    value = name.lower()
    value = value.replace("&", " and ")
    value = re.sub(r"\bagent\b", "", value)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "agent"


def bulletize(items: list[str], fallback: str = "要入力") -> str:
    if not items:
        items = [fallback]
    return "\n".join(f"- {item}" for item in items)


def numberize(items: list[str], fallback: list[str] | None = None) -> str:
    values = items or fallback or ["関連ドキュメントを確認する", "論点を整理する", "成果物を作る"]
    return "\n".join(f"{i}. {item}" for i, item in enumerate(values, 1))


def list_from_section(lines: list[str]) -> list[str]:
    out: list[str] = []
    paragraph: list[str] = []
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if line.startswith("- "):
            out.append(line[2:].strip())
        elif line and not line.startswith("```"):
            paragraph.append(line)
    if out:
        return out
    joined = " ".join(paragraph).strip()
    return [joined] if joined else []


def text_from_section(lines: list[str]) -> str:
    parts = []
    for raw in lines:
        line = raw.strip()
        if line and not line.startswith("- ") and not line.startswith("```"):
            parts.append(line)
    return " ".join(parts).strip()


def parse_sections(block: str) -> dict[str, list[str]]:
    labels = {
        "役割",
        "担当",
        "担当領域",
        "見るべきチケット",
        "標準成果物",
        "毎朝の出力",
        "Keiへの確認事項",
        "注意",
        "起動頻度",
    }
    sections: dict[str, list[str]] = {}
    current: str | None = None
    for raw in block.splitlines():
        line = raw.rstrip()
        m = re.match(r"^([^:：]+)[:：]\s*$", line.strip())
        if m:
            if m.group(1) in labels:
                current = m.group(1)
                sections.setdefault(current, [])
            else:
                current = None
            continue
        if current:
            if line.startswith("### ") or line.startswith("---"):
                current = None
                continue
            sections[current].append(line)
    return sections


def parse_agents() -> list[Agent]:
    text = SOURCE.read_text(encoding="utf-8")
    matches = list(re.finditer(r"^### A(\d{2})｜(.+?)\s*$", text, flags=re.MULTILINE))
    agents: list[Agent] = []
    for i, match in enumerate(matches):
        code = f"A{match.group(1)}"
        name = match.group(2).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        block = text[start:end].strip()
        sections = parse_sections(block)
        role = text_from_section(sections.get("役割", [])) or text_from_section(sections.get("担当", []))
        areas = list_from_section(sections.get("担当領域", [])) or list_from_section(sections.get("担当", []))
        tickets = list_from_section(sections.get("見るべきチケット", []))
        outputs = list_from_section(sections.get("標準成果物", [])) or list_from_section(
            sections.get("毎朝の出力", [])
        )
        questions = list_from_section(sections.get("Keiへの確認事項", []))
        notes = list_from_section(sections.get("注意", []))
        cadence = list_from_section(sections.get("起動頻度", []))
        if not role:
            role = f"PawMateの{name}として、担当領域を実行可能な成果物に落とす。"
        if not outputs:
            outputs = ["論点整理メモ", "実行順序案", "Kei確認事項", "次アクション"]
        agents.append(
            Agent(
                code=code,
                index=int(match.group(1)),
                name=name,
                slug=slugify(name),
                role=role,
                areas=areas,
                tickets=tickets,
                outputs=outputs,
                questions=questions,
                notes=notes,
                cadence=cadence,
                source_block=block,
            )
        )
    return agents


def docs_for(agent: Agent) -> list[str]:
    docs = []
    for doc in COMMON_DOCS + DOMAIN_DOCS.get(agent.code, []):
        if doc not in docs:
            docs.append(doc)
    return docs


def scope_out(agent: Agent) -> list[str]:
    items = [
        "Kei、行政、専門家、保険会社、取引相手の最終判断を代替すること",
        "入力・出典にない合意、回答、登録状況、数値実績を事実として断定すること",
        "Gate条件を満たさないまま次フェーズへ進める提案をすること",
    ]
    if agent.code == "A03":
        items.insert(0, "法的助言、法令適合の断定、専門家確認前の最終規約化")
    if agent.code == "A04":
        items.insert(0, "保険適用可否、補償範囲、事故責任の断定")
    if agent.code == "A06":
        items.insert(0, "ユーザー承認なしの本番デプロイ、破壊的変更、秘密情報の露出")
    if agent.code == "A08":
        items.insert(0, "誇大広告、過度な勧誘、口コミや顧客実績の捏造")
    if agent.code == "A10":
        items.insert(0, "未確認情報を最新情報として扱うこと")
    if agent.code in {"A09", "A17", "A18"}:
        items.insert(0, "投資、融資、会計、税務の最終助言")
    if agent.code == "A12":
        items.insert(0, "重大リスクを軽視してGo判定を出すこと")
    return items


def behavior(agent: Agent) -> list[str]:
    tasks = agent.areas[:5] or agent.outputs[:5]
    return [
        "関連PawMateドキュメントと現在フェーズを確認し、前提を3行以内で固定する",
        "`pawmate_daily_calendar_fast.md` に今日の日付の行がない場合は、存在しないチケットを作らず、対象日確認または直近実行日の仮置きを明示する",
        "担当チケットをPriority、Status、依存関係、今日の完了ラインで仕分ける",
        "担当外チケットが入力に含まれる場合は自分で処理せず、Handoffとして主担当エージェントまたはA01 Chief of Staffへ返す",
        f"{agent.name}として必要な成果物を、Keiがそのまま実行または確認できる粒度で作る",
        "現フェーズのGate条件を満たしていない未来フェーズチケットは実行扱いにせず、Planning、Blocked、Waiting、または評価軸作成に留める",
        "外部送信、法務、保険、決済、個人情報、事故リスクに触れる箇所を明示する",
        "最後にKeiの判断事項、Waitingへ送る条件、次の1アクションを出す",
    ]
    # The returned list is intentionally stable across agents; task specificity is
    # supplied by Scope and Output Format.


def output_headings(agent: Agent) -> list[str]:
    return [
        "前提整理",
        "担当チケット",
        "成果物ドラフト",
        "リスクと確認事項",
        "次アクション",
    ]


def afos_003(agent: Agent) -> str:
    data = {
        "meta": {
            "pipeline_stage": "agent_idea",
            "version": "1.0.0",
            "agent_id": agent.agent_id,
            "agent_code": agent.code,
            "source": {
                "document": "pawmate_agent_team.md",
                "section": f"{agent.code}｜{agent.name}",
                "priority_band": agent.priority_band,
            },
        },
        "status": "ok",
        "warnings": [],
        "errors": [],
        "agent_idea": {
            "name": agent.name,
            "tagline": agent.tagline,
            "mission": agent.role,
            "main_tasks": agent.areas[:8] or agent.outputs[:8],
            "typical_scenarios": [
                "今日の5チケット運用で担当領域の前捌きが必要なとき",
                "Gate前、外部接触前、リリース前に判断材料を整えるとき",
            ],
            "value_for_user": f"{agent.name}が、{agent.tagline}ことでKeiの判断と実行を軽くする。",
            "canonical_docs": docs_for(agent),
        },
        "review_summary": {
            "fitness_to_role": "pawmate_agent_team.md の担当領域とチケットに直結",
            "concreteness": "標準成果物、担当チケット、Kei確認事項に接続可能",
            "distinctiveness": "隣接エージェントと成果物単位で責務を分離",
            "request_definition_readiness": "004へ直結可能",
            "improvement_notes": "",
        },
    }
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def afos_004(agent: Agent) -> str:
    docs = docs_for(agent)
    return f"""# 004 要求定義 — {agent.name}

## 6.1 Meta
- pipeline_stage: request_definition
- version: 1.0.0
- agent_id: {agent.agent_id}
- source: `pawmate_agent_team.md` / `{agent.code}｜{agent.name}`
- priority_band: {agent.priority_band}

## 6.2 Title
{agent.name} に関する要求定義（PawMate / AFOS 003-010）

## 6.3 Background & Problem
PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引を成立させる。{agent.name} は、{agent.role}

## 6.4 Objectives
- Keiが今日または今週の判断に使える粒度で、担当領域の論点と成果物を整理する。
- `pawmate_tickets.md` の対象チケットを Done / Waiting / Blocked に進める材料を作る。
- Gate条件を飛ばさず、フェーズ0から順に進める。

## 6.5 Target Users & Context
- Primary: Kei / Founder
- Secondary: PawMateの各専門エージェント、外部パートナー、行政・専門家・保険会社に渡す資料の読み手
- Context: 非同期チャット、日次5チケット運用、外部返信待ちをWaiting化する高速実行カレンダー

## 6.6 Scope
### In scope
{bulletize(agent.areas + agent.outputs, "担当領域の論点整理")}

### Out of scope
{bulletize(scope_out(agent))}

## 6.7 Deliverables
### 標準成果物
{bulletize(agent.outputs)}

### 担当チケット
{bulletize(agent.tickets, "関連チケットをユーザー入力から特定")}

### Keiへの確認事項
{bulletize(agent.questions, "Keiが決めるべき判断を出力末尾にまとめる")}

## 6.8 Quality & Acceptance
- [MUST] `pawmate_roadmap.md` のフェーズ順とGate条件を守る。
- [MUST] 事実、仮説、未確認、Kei判断を分けて書く。
- [MUST] 外部送信文、法務・保険・決済・個人情報に触れる内容はリスク注記を付ける。
- [SHOULD] 表、チェックリスト、短い文面案など、Keiがすぐ使える形にする。

## 6.9 Interaction Model
- Typical input: 担当チケット、現状メモ、関連ドキュメント、制約、Keiの判断候補
- Typical output: {", ".join(agent.outputs[:5])}
- 初回プロンプト例: {agent.prompt}

## 6.10 Constraints
- 参照ドキュメント: {", ".join(f"`{d}`" for d in docs)}
- 出力はMarkdown。長い説明より、実行できる表・箇条書き・文面を優先する。
- 最新情報が必要な場合は、未確認のまま断定せず「Web確認待ち」と明示する。

## 6.11 Traceability
| 要求項 | 根拠 |
|---|---|
| 役割 | `pawmate_agent_team.md` {agent.code} |
| チケット | `pawmate_tickets.md` / 本エージェントの見るべきチケット |
| Gate | `pawmate_roadmap.md` / `pawmate_daily_calendar_fast.md` |
| 成果物 | 本エージェントの標準成果物 |

## 6.12 Review Summary
005では本要求をREQへ分解し、006でSEC構造へ配賦する。007以降では、PawMate共通ルールと{agent.name}固有の出力形式を固定する。
"""


def afos_005(agent: Agent) -> str:
    headings = output_headings(agent)
    role_req = "\n".join(
        f"### REQ-FR-{10 + i:03d} {item}（P1）\n- 担当領域として必要な場合、具体的な判断材料またはドラフトへ落とす。\n"
        for i, item in enumerate((agent.areas or agent.outputs)[:8])
    )
    heading_req = "\n".join(
        f"### REQ-FR-{50 + i:03d} 見出し「{h}」（P0）\n- 010 SEC-05 の出力で「{h}」を欠落させない。\n"
        for i, h in enumerate(headings)
    )
    return f"""# 005 要件定義 — {agent.name}

## Meta
- pipeline_stage: requirements_definition
- version: 1.0.0
- agent_id: {agent.agent_id}

## Assumptions / Risks
- Keiが最終意思決定者であり、エージェントは準備・整理・下書きを担当する。
- 行政、専門家、保険会社、取引相手の回答は入力または出典がある場合のみ事実扱いにする。
- PawMateはフェーズ0から順に進める。Gate未達を隠さない。

## Functional Requirements
### REQ-FR-001 PawMate文脈同期（P0）
- `pawmate_roadmap.md`、`pawmate_tickets.md`、`pawmate_daily_calendar_fast.md` の文脈に沿って回答する。

### REQ-FR-002 チケット前進（P0）
- 対象チケットごとに、目的、今日の完了ライン、Waiting条件、Blocked要因を整理できる。

### REQ-FR-003 成果物生成（P0）
- 標準成果物をMarkdown、表、チェックリスト、文面案のいずれかで作成できる。

### REQ-FR-004 事実分離（P0）
- 事実、仮説、未確認、Kei判断を混ぜない。

### REQ-FR-005 担当外Handoff（P0）
- 担当外チケットが入力に含まれる場合は自分で完結させず、主担当エージェントまたはA01 Chief of StaffへHandoffする。

### REQ-FR-006 日付未掲載時の仮置き（P0）
- 今日の日付に対応する行が `pawmate_daily_calendar_fast.md` にない場合、存在しないチケットを作らず、対象日確認または直近実行日の仮置きを明示する。

### REQ-FR-007 未来Gate抑制（P0）
- 現フェーズのGate条件を満たしていない未来フェーズチケットは実行扱いにせず、Planning、Blocked、Waiting、または評価軸作成に留める。

{role_req}
{heading_req}
## Non-Functional Requirements
### REQ-NFR-001 簡潔性（P1）
- 原則として、冒頭に結論を置き、長い背景説明を避ける。

### REQ-NFR-002 再利用性（P1）
- 出力は次のエージェントや外部相手に貼れる粒度にする。

## Compliance / Safety
### REQ-SAFE-001 越権防止（P0）
- {scope_out(agent)[0]} は行わない。

### REQ-SAFE-002 外部送信（P0）
- 送信文はドラフトに留め、送信主体はKeiであることを前提にする。

### REQ-SAFE-003 最新情報（P0）
- 最新の窓口、料金、規約、法令、保険商品、競合情報が必要な場合はWeb確認または一次情報確認を促す。

## Matrix
| REQ | 004参照 | SEC主担当 |
|---|---|---|
| FR-001 | 6.10 | SEC-03 |
| FR-002 | 6.7 | SEC-04 |
| FR-003 | 6.7 | SEC-05 |
| FR-004 | 6.8 | SEC-06 |
| SAFE-001 | 6.6 | SEC-06 |

## Review Summary
P0はPawMate文脈同期、チケット前進、成果物生成、事実分離、越権防止。006へ配賦可能。
"""


def afos_006(agent: Agent) -> str:
    return f"""# 006 基本設計 — {agent.name}

## Meta
- pipeline_stage: basic_design
- version: 1.0.0
- agent_id: {agent.agent_id}

## Architecture
010の完成版は SEC-01〜SEC-08 の構成で統一する。PawMate共通ルールを前半に置き、{agent.name}固有の担当領域、成果物、確認事項をSEC-02〜SEC-05へ配賦する。

## Section Map
| ID | Name | Purpose |
|---|---|---|
| SEC-01 | Identity | 役割、ミッション、PawMate共通前提 |
| SEC-02 | Scope | 対応範囲、非対応、担当チケット |
| SEC-03 | I/O Contract | 入力前提、参照ドキュメント、不足時の扱い |
| SEC-04 | Behavior | 実行手順、チケット前進、判断材料化 |
| SEC-05 | Output Format | 必須見出し、表・チェックリスト・文面の形式 |
| SEC-06 | Safety | 法務・保険・個人情報・外部送信・Gateの安全線 |
| SEC-07 | Ops & Quality | 日次運用、自己検証、品質基準 |
| SEC-08 | Failure | 情報不足、範囲外、Blocked時の返答 |

## SEC Specs
### SEC-01
- {agent.name}として、{agent.tagline}。
- Keiの補助役であり、最終判断者ではない。

### SEC-02
- In: {", ".join((agent.areas + agent.outputs)[:8])}
- Out: {", ".join(scope_out(agent)[:4])}

### SEC-03
- 入力は担当チケット、現状メモ、関連ドキュメント、制約、Kei判断候補。
- 参照ドキュメントは `pawmate_agent_team.md`、`pawmate_roadmap.md`、`pawmate_tickets.md`、`pawmate_daily_calendar_fast.md`。

### SEC-04
- 手順は007の番号付きリストに一致させる。

### SEC-05
- 必須見出し: {", ".join(output_headings(agent))}

### SEC-06
- 専門家判断代替、未確認断定、Gate飛ばしを禁止する。

### SEC-07
- 今日の完了ライン、Waiting条件、Kei判断を必ず確認する。

### SEC-08
- 情報不足時は不足リスト、Blocked時は解除条件、範囲外時は最小代替を返す。

## REQ Coverage
- FR-001→SEC-03
- FR-002→SEC-04
- FR-003→SEC-05
- FR-004/SAFE→SEC-06

## Review Summary
007では本Mapを詳細テンプレート化し、008でドラフト、009で品質レビュー、010でリリース版に固定する。
"""


def afos_007(agent: Agent) -> str:
    return f"""# 007 詳細設計 — {agent.name}

## Global Rules
- 優先順位: Safety > Gate > 事実/仮説分離 > 担当チケット前進 > 出力形式。
- 断定は入力または参照ドキュメントに明示されたものだけに限る。
- SEC見出しは `## SEC-XX Name` 形式で固定する。
- 外部送信、法務、保険、決済、個人情報、事故対応はKei確認を必須にする。

## SEC-01 Identity Template
```text
あなたはPawMateプロジェクトの「{agent.name}」である。
ミッションは「{agent.tagline}」こと。
あなたはKeiの意思決定と実行を補助する専門エージェントであり、Kei、行政、専門家、保険会社、取引相手の最終判断を代替しない。
```

## SEC-02 Scope
### 対応
{bulletize(agent.areas + agent.outputs)}

### 非対応
{bulletize(scope_out(agent))}

### 担当チケット
{bulletize(agent.tickets, "ユーザー入力から関連チケットを特定")}

## SEC-03 I/O Contract
### 入力
- 担当チケットまたは相談内容
- 現状メモ、関連ドキュメント、制約
- 期限、相手、外部返信待ちの有無
- Keiが迷っている判断

### 出力
- 前提整理
- 担当チケット
- 成果物ドラフト
- リスクと確認事項
- 次アクション

## SEC-04 Behavior
{numberize(behavior(agent))}

## SEC-05 Output Format
### 前提整理
- 現在フェーズ、参照したドキュメント、事実/仮説/未確認を分ける。

### 担当チケット
- Ticket ID、目的、今日の完了ライン、Status候補、Waiting条件を表で出す。

### 成果物ドラフト
- {agent.name}の標準成果物として、次の候補から必要なものを作る: {", ".join(agent.outputs)}。

### リスクと確認事項
- 法務、保険、事故、個人情報、決済、外部送信、ブランド毀損の該当有無を確認する。
- Keiへの確認事項をYes/Noまたは選択肢で書く。

### 次アクション
- 次の1手、担当、完了条件、Waitingへ送る条件を書く。

## SEC-06 Safety
範囲外または危険な依頼には、実行せず次の文で止める。

「この依頼はPawMateの安全な運用範囲外です。事実確認・専門家確認・Kei判断が必要な論点として整理します。」

## SEC-07 Ops
- 日次運用では、3チケット以上をDoneまたはWaitingへ進める観点で整理する。
- 出力前に、必須見出し、事実分離、Gate整合、Kei確認事項を自己検証する。
- 担当外チケットは `Handoff` として扱い、自分が支援できる範囲、主担当、Waiting条件だけを明示する。
- 今日の日付に対応する行が高速カレンダーにない場合、対象日確認または直近実行日の仮置きを明示する。
- Gate未達の未来フェーズチケットは、実行ではなくPlanning/Blocked/Waiting/評価軸作成に留める。

## SEC-08 Failure
- 情報不足: 不足情報リストを出し、推測で埋めない。
- Blocked: 解除条件、相談先、代替行動を出す。
- 最新情報が必要: Web確認待ちまたは一次情報確認待ちと明示する。

## Smoke Tests
1. 標準入力で必須見出しがすべて出る。
2. Gate未達のまま拡大を求められた場合、未達差分を示して止める。
3. 法務・保険・投資などの最終判断を求められた場合、専門家/Kei確認へ戻す。
"""


def final_prompt(agent: Agent, version: str) -> str:
    return f"""# {'System Prompt Draft' if version.startswith('0.') else 'Final System Prompt'} v{version}

## SEC-01 Identity

あなたはPawMateプロジェクトの「{agent.name}」である。ミッションは「{agent.tagline}」こと。

PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引を成立させる。必ず `pawmate_roadmap.md`、`pawmate_tickets.md`、`pawmate_daily_calendar_fast.md`、`pawmate_agent_team.md` の文脈に沿って動く。

あなたはKeiの意思決定と実行を補助する専門エージェントであり、Kei、行政、専門家、保険会社、取引相手の最終判断を代替しない。

## SEC-02 Scope

### 対応範囲
{bulletize(agent.areas + agent.outputs)}

### 非対応
{bulletize(scope_out(agent))}

### 主な担当チケット
{bulletize(agent.tickets, "ユーザー入力から関連チケットを特定する")}

## SEC-03 I/O Contract

ユーザーは、担当チケット、現状メモ、関連ドキュメント、期限、相手、制約、Keiが迷っている判断を渡す。

情報が不足している場合は推測で埋めず、不足情報を短く列挙する。最新の窓口、料金、規約、法令、保険商品、競合情報が必要な場合は、Web確認または一次情報確認が必要であることを明示する。

## SEC-04 Behavior

{numberize(behavior(agent))}

## SEC-05 Output Format

### 前提整理
- 現在フェーズ、参照したPawMate文書、入力から確認できる事実を3行以内で書く。
- 事実、仮説、未確認、Kei判断を混ぜない。

### 担当チケット
| Ticket | 目的 | 今日の完了ライン | Status候補 | Waiting条件 |
|---|---|---|---|---|
| 要入力 | 要入力 | 要入力 | Todo / Doing / Waiting / Done / Blocked | 要入力 |

### Handoff
担当外チケットが入力に含まれる場合のみ書く。

| Ticket | 主担当 | 自分が支援できること | Handoff理由 | Waiting条件 |
|---|---|---|---|---|
| 要入力 | A01または主担当 | 要入力 | 担当外 / Gate未達 / 専門確認待ち | 要入力 |

### 成果物ドラフト
次の標準成果物から、依頼に必要なものを作る。
{bulletize(agent.outputs)}

### リスクと確認事項
- 法務、保険、事故、個人情報、決済、外部送信、ブランド毀損、Gate未達の該当有無を確認する。
- Keiへの確認事項は、Yes/Noまたは選択肢で答えられる形にする。

### 次アクション
- 次の1手、担当、完了条件、Waitingへ送る条件を書く。
- 最後に「今日落としてはいけない1つ」を1行で示す。

## SEC-06 Safety & Compliance

範囲外または危険な依頼には、実行せず次の文で止める。

「この依頼はPawMateの安全な運用範囲外です。事実確認・専門家確認・Kei判断が必要な論点として整理します。」

守るべき安全線:
- 法務、行政、保険、投資、税務、医療、事故責任の最終判断を断定しない。
- 入力や出典にない合意、回答、登録状況、実績、数値を作らない。
- 外部送信文はドラフトに留め、送信主体はKeiである前提を崩さない。
- 個人情報は必要最小限にし、公開・共有範囲が不明な情報は伏せる。
- Gate条件を満たさない拡大やリリースは、未達差分を明示して止める。

## SEC-07 Ops & Quality

出力は日本語のMarkdownで、Keiがそのまま意思決定または実行できる粒度にする。表、チェックリスト、短文ドラフトを優先する。

出力前の自己検証:
- 必須見出しが揃っているか。
- `pawmate_roadmap.md` のフェーズ順とGate条件に反していないか。
- 事実、仮説、未確認、Kei判断が分かれているか。
- 外部確認が必要な情報を断定していないか。
- 担当外チケットを抱え込まず、Handoffできているか。
- 今日の日付行がない場合に、存在しないチケットを作っていないか。
- Gate未達の未来フェーズチケットを実行扱いにしていないか。
- 次の1アクションとWaiting条件があるか。

## SEC-08 Failure & Escalation

情報不足時は、不足情報リストを出し、暫定で進められる最小成果物があれば「仮置き」と明示して作る。

Blocked時は、解除条件、相談先、代替行動を出す。外部相手の回答待ちはWaitingとして扱い、次に確認する日付または条件を明示する。

専門家確認が必要な場合は、質問リスト、渡す資料、未決論点に分けて整理する。
"""


def afos_008(agent: Agent) -> str:
    return final_prompt(agent, "0.9.0") + f"""
---

## Draft Notes（009向け）
- status: ok
- review_focus: SEC見出し、PawMate文脈、Gate整合、越権防止
- open: 実運用で追加された個別文面・テンプレートはSKILL更新時に反映する
"""


def afos_009(agent: Agent) -> str:
    return f"""# 009 レビュー — {agent.name}

## Verdict
pass

## Executive Summary
- 007のSECテンプレートは008へ欠落なく反映されている。
- PawMate共通方針、日次5チケット運用、Gate条件、Kei最終判断の線引きが含まれている。

## Findings
- Structure: SEC-01〜08が006 Mapと対応。
- Safety: 専門家判断代替、未確認断定、Gate飛ばしの禁止が明示されている。
- Fidelity: 003の担当領域、標準成果物、担当チケットが010へ引き継がれている。
- Usability: 出力見出しが、Keiの実行・判断・Waiting管理に接続している。

## Patch List
- PATCH-01（MINOR）: 実運用でよく使う文面が増えたら、SKILL.mdの出力例を追加する。

## Regression Checklist
- 必須見出し: {", ".join(output_headings(agent))}
- 担当チケット: {", ".join(agent.tickets[:8]) if agent.tickets else "ユーザー入力から特定"}
- 標準成果物: {", ".join(agent.outputs[:8])}
- SAFE: 越権防止、外部送信ドラフト、未確認断定禁止

## Review Summary
010へ進行可。
"""


def afos_010(agent: Agent) -> str:
    return final_prompt(agent, "1.0.0") + f"""
## Release Notes
- release_status: ready
- agent_id: {agent.agent_id}
- source: `pawmate_agent_team.md` `{agent.code}｜{agent.name}`
- generated_by: `scripts/build_pawmate_agent_team.py`
"""


def skill(agent: Agent) -> str:
    return f"""---
name: pawmate-{agent.slug}
description: "{agent.name} — {agent.tagline}"
---

このスキルを呼び出すと、以下のシステムプロンプトに従って振る舞います。

{afos_010(agent)}
"""


def manifest(agents: list[Agent]) -> str:
    rows = []
    for agent in agents:
        rows.append(
            f"| {agent.code} | {agent.name} | `{agent.folder}/010_final_system_prompt.md` | `{agent.folder}/SKILL.md` | {agent.priority_band} |"
        )
    return f"""# PawMate Agent Team AFOS 003-010 Manifest

Generated from `pawmate_agent_team.md`.

## Source
- `pawmate_agent_team.md`
- `pawmate_roadmap.md`
- `pawmate_tickets.md`
- `pawmate_daily_calendar_fast.md`

## Agents
| Code | Agent | Final prompt | Skill | Order |
|---|---|---|---|---|
{chr(10).join(rows)}

## File Set
Each agent folder contains:
- `003_agent_idea.json`
- `004_request_definition.md`
- `005_requirements_definition.md`
- `006_basic_design.md`
- `007_detailed_design.md`
- `008_system_prompt_draft.md`
- `009_review.md`
- `010_final_system_prompt.md`
- `SKILL.md`

Regenerate with:

```bash
python3 scripts/build_pawmate_agent_team.py
```
"""


def write_agent(agent: Agent) -> None:
    folder = OUT / agent.folder
    folder.mkdir(parents=True, exist_ok=True)
    files = {
        "003_agent_idea.json": afos_003(agent),
        "004_request_definition.md": afos_004(agent),
        "005_requirements_definition.md": afos_005(agent),
        "006_basic_design.md": afos_006(agent),
        "007_detailed_design.md": afos_007(agent),
        "008_system_prompt_draft.md": afos_008(agent),
        "009_review.md": afos_009(agent),
        "010_final_system_prompt.md": afos_010(agent),
        "SKILL.md": skill(agent),
    }
    for name, content in files.items():
        (folder / name).write_text(content, encoding="utf-8")


def main() -> None:
    agents = parse_agents()
    if len(agents) != 18:
        raise SystemExit(f"expected 18 agents, got {len(agents)}")
    OUT.mkdir(parents=True, exist_ok=True)
    for agent in agents:
        write_agent(agent)
    (OUT / "00_manifest.md").write_text(manifest(agents), encoding="utf-8")
    print(f"generated {len(agents)} agents under {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
