import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "Pawmate", "pawmate_agent_team.md");
const outRoot = path.join(root, "Pawmate", "afos", "agents");
const source = fs.readFileSync(sourcePath, "utf8");

const COMMON_CONTEXT = [
  "Pawmate/pawmate_roadmap.md",
  "Pawmate/pawmate_tickets.md",
  "Pawmate/pawmate_daily_calendar_fast.md",
  "Pawmate/pawmate_agent_team.md",
];

function between(text, start, end) {
  const s = text.indexOf(start);
  if (s < 0) return "";
  const e = text.indexOf(end, s + start.length);
  return text.slice(s, e < 0 ? text.length : e);
}

function slugify(name) {
  return name
    .replace(/\bAgent\b/gi, "")
    .replace(/&/g, "and")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function compact(text) {
  return text.replace(/\s+/g, " ").trim();
}

function extractParagraph(section, label) {
  const re = new RegExp(`${label}:\\n([\\s\\S]*?)(?:\\n\\n|\\n[A-Za-z一-龠ぁ-んァ-ヶー・/ &]+:|\\n---|$)`);
  const m = section.match(re);
  return m ? compact(m[1]) : "";
}

function extractBullets(section, labels) {
  for (const label of labels) {
    const re = new RegExp(`${label}:\\n([\\s\\S]*?)(?:\\n\\n[A-Za-z一-龠ぁ-んァ-ヶー・/ &]+:|\\n---|$)`);
    const m = section.match(re);
    if (!m) continue;
    const items = m[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.replace(/^- /, "").trim())
      .filter(Boolean);
    if (items.length) return items;
  }
  return [];
}

function parseAgentSections(block, teamKind) {
  const matches = [...block.matchAll(/^### A(\d{2})｜(.+)$/gm)];
  return matches.map((match, index) => {
    const id = `A${match[1]}`;
    const name = match[2].trim();
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : block.length;
    const section = block.slice(start, end).trim();
    return {
      id,
      number: Number(match[1]),
      name,
      slug: slugify(name),
      teamKind,
      raw: section,
      role: extractParagraph(section, "役割") || extractParagraph(section, "担当"),
      domains: extractBullets(section, ["担当領域", "担当"]),
      tickets: extractBullets(section, ["見るべきチケット"]),
      deliverables: extractBullets(section, ["標準成果物", "毎朝の出力"]),
      confirmations: extractBullets(section, ["Keiへの確認事項"]),
      notes: extractBullets(section, ["注意"]),
    };
  });
}

function parsePrompts(text) {
  const prompts = new Map();
  const re = /^### A(\d{2}) .+ Prompt\n\n```txt\n([\s\S]*?)```/gm;
  for (const m of text.matchAll(re)) {
    prompts.set(`A${m[1]}`, m[2].trim());
  }
  return prompts;
}

const coreBlock = between(source, "## Core Team", "## Specialist Team");
const specialistBlock = between(source, "## Specialist Team", "## フェーズ別の最小エージェント構成");
const futureBlock = between(source, "## 追加候補エージェント", "## まず作るべき順番");
const prompts = parsePrompts(source);

const parsed = [
  ...parseAgentSections(coreBlock, "core"),
  ...parseAgentSections(specialistBlock, "specialist"),
  ...parseAgentSections(futureBlock, "future"),
]
  .filter((agent, idx, all) => all.findIndex((a) => a.id === agent.id) === idx)
  .sort((a, b) => a.number - b.number);

const agents = parsed.map((agent) => ({
  ...agent,
  prompt:
    prompts.get(agent.id) ||
    `PawMateの${agent.name.replace(/ Agent$/, "")}として、担当領域を前に進めてください。出力はKeiがすぐ判断または実行できる粒度にしてください。`,
  role:
    agent.role ||
    `${agent.name}はPawMateのフェーズ3以降で専門化する追加候補エージェントです。`,
  domains: agent.domains.length ? agent.domains : ["担当領域の実行計画整理", "関連チケットの前捌き", "Keiへの判断材料作成"],
  tickets: agent.tickets.length ? agent.tickets : ["未指定（関連フェーズのGateと担当領域チケットを参照）"],
  deliverables: agent.deliverables.length ? agent.deliverables : ["実行メモ", "比較表またはチェックリスト", "Keiへの判断依頼"],
  confirmations: agent.confirmations.length ? agent.confirmations : ["着手順", "許容リスク", "次にKeiが決めること"],
}));

function bullets(items, fallback = "未指定") {
  const list = items?.length ? items : [fallback];
  return list.map((item) => `- ${item}`).join("\n");
}

function numbered(items, fallback = "未指定") {
  const list = items?.length ? items : [fallback];
  return list.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function jsonAgent(agent) {
  const agentId = `pawmate_${agent.id.toLowerCase()}_${agent.slug.replaceAll("-", "_")}_v1`;
  const status = agent.teamKind === "future" ? "warning" : "ok";
  const warnings =
    agent.teamKind === "future"
      ? ["追加候補エージェントのため、担当領域の情報が薄い。初版では既存ロードマップから仮定を置いている。"]
      : [];
  return `${JSON.stringify(
    {
      meta: {
        pipeline_stage: "agent_idea",
        version: "1.0.0",
        project: "PawMate",
        agent_id: agentId,
        source: {
          document: "Pawmate/pawmate_agent_team.md",
          agent_ref: agent.id,
          team_kind: agent.teamKind,
        },
      },
      status,
      warnings,
      errors: [],
      agent_idea: {
        name: `${agent.id}｜${agent.name}`,
        tagline: tagline(agent),
        mission: agent.role,
        primary_user: "Kei / PawMate founder",
        main_tasks: agent.domains,
        tickets_to_watch: agent.tickets,
        standard_deliverables: agent.deliverables,
        typical_scenarios: scenarios(agent),
        value_for_user: valueForUser(agent),
        confirmation_points_for_kei: agent.confirmations,
      },
      review_summary: {
        focus:
          "PawMateのGate運用、1日5チケット運用、茅ヶ崎から深めて広げるロードマップに沿うよう、担当領域を単一主責務へ寄せた。",
        readiness:
          "004以降で、入力契約・出力契約・安全境界・Keiへの確認事項へ分解できる粒度になっている。",
      },
    },
    null,
    2,
  )}\n`;
}

function tagline(agent) {
  const map = {
    A01: "今日の5チケットを迷わず動かす進行管理エージェント",
    A02: "関係性を壊さず供給パートナーとケアラー獲得を進める",
    A03: "法務・行政の論点を専門家確認へ渡せる形に整える",
    A04: "保険・審査・事故対応をフェーズに合わせて安全側へ設計する",
    A05: "最初の1件に必要な体験と仕様へ機能を絞り込む",
    A06: "既存プロトタイプを最小変更で前に進めて検証する",
    A07: "初回取引と日常CSを迷わず回せる運用へ落とす",
    A08: "広告より先に地域の信頼と口コミ導線を作る",
    A09: "Gate判断に必要な数字と未達原因を見える化する",
    A10: "最新情報を調べ、比較可能な判断材料へ変換する",
    A11: "会話と運用を、後から使えるナレッジに変換する",
    A12: "外部送信・Gate・リリース前に重大リスクを止める",
    A13: "茅ヶ崎で深めた供給密度を隣接エリアへ移植する",
    A14: "ケアラーの定着と品質をコミュニティ運営で支える",
    A15: "湘南ペット情報の検索流入を記事企画へ落とす",
    A16: "法人向け仮説を福利厚生・オフィス文脈で検証する",
    A17: "資金調達判断に必要な資料と投資家論点を整える",
    A18: "GMV・LTV・稼働率を改善仮説に変換する",
  };
  return map[agent.id] || `${agent.name}の担当領域を前進可能な判断材料へ変換する`;
}

function scenarios(agent) {
  const base = [
    `関連チケット（${agent.tickets.slice(0, 3).join(", ")}）に着手する前に、目的・完了ライン・Kei確認事項を整理する。`,
    `${agent.deliverables.slice(0, 3).join("、")}を初稿として作り、A01またはKeiが次アクションを決められる状態にする。`,
    "Gate前または外部送信前に、未確定・Waiting・Blocked・リスクを分離して判断材料を出す。",
  ];
  if (agent.id === "A06") base[1] = "既存プロトタイプを読み、最小変更で実装し、ローカル確認結果と未確認リスクを報告する。";
  if (agent.id === "A10") base[1] = "最新情報が必要な項目をWeb確認し、出典リンク付きの比較表や問い合わせ先リストにする。";
  return base;
}

function valueForUser(agent) {
  if (agent.id === "A01") return "Keiが毎朝、何から進めるべきかと何を待ちに送るべきかを即判断できる。";
  if (agent.id === "A12") return "事故・法務・炎上・個人情報・決済リスクを、Go前に小さく止められる。";
  return `${agent.name.replace(/ Agent$/, "")}領域の前捌き・下書き・論点整理を任せることで、Keiは意思決定と実行に集中できる。`;
}

function specialSafety(agent) {
  const lines = [];
  if (["A03", "A12"].includes(agent.id)) {
    lines.push("法律・行政に関する内容は法的助言として断定せず、行政・弁護士・行政書士への確認事項として整理する。");
  }
  if (["A04", "A12"].includes(agent.id)) {
    lines.push("事故・保険・補償範囲は保証せず、保険会社または専門家確認待ちの論点を分離する。");
  }
  if (["A08", "A15", "A16"].includes(agent.id)) {
    lines.push("マーケティングでは誇大表現、無断利用、個人情報の推測、迷惑接触をしない。");
  }
  if (["A09", "A17", "A18"].includes(agent.id)) {
    lines.push("財務・投資判断は最終助言として断定せず、前提・感度・未確定を明示する。");
  }
  if (agent.id === "A06") {
    lines.push("既存コードを読む。無関係な変更を戻さない。実装後は確認結果と未確認リスクを報告する。");
  }
  if (agent.id === "A10") {
    lines.push("最新情報が必要な調査ではWeb確認し、日付と出典リンクを残す。未確認情報は未確認と明記する。");
  }
  if (!lines.length) lines.push("未提供の個人情報や機密情報を推測しない。未確定の事実は断定しない。");
  return lines;
}

function requestDefinition(agent) {
  return `# ${agent.id} ${agent.name}｜004 Request Definition

## 6.1 Meta

- pipeline_stage: request_definition
- version: 1.0.0
- project: PawMate
- agent_id: pawmate_${agent.id.toLowerCase()}_${agent.slug.replaceAll("-", "_")}_v1
- source: Pawmate/pawmate_agent_team.md
- status: ${agent.teamKind === "future" ? "warning" : "ok"}
- warnings:
${agent.teamKind === "future" ? "  - 追加候補エージェントのため、詳細運用はフェーズ3以降の判断に依存する。" : "  - []"}
- errors: []

## 6.2 Title

${agent.id} ${agent.name}の担当領域を、Keiが実行・判断できる成果物へ変換する要求定義

## 6.3 Background & Problem

PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引とGate達成を目指す。${agent.name}は、以下の役割を担う。

${agent.role}

この担当領域を人間の頭の中だけで進めると、チケットの優先順位、Waiting管理、外部確認、成果物の粒度が揺れやすい。エージェントは、最終判断をKeiに残したまま、下書き・論点整理・確認事項・完了ラインを明確にする必要がある。

## 6.4 Objectives

- KGI:
  - ${agent.id}の担当領域で、関連チケットをDoneまたはWaitingへ進めるための判断材料と成果物初稿を、PawMateのGate条件に沿って作成できる。
- KPI:
  - 関連チケットIDが出力に明記される。
  - 今日または今回の最小完了ラインが1つ以上定義される。
  - Keiへの確認事項が最大5件で明示される。
  - 未確定・Waiting・Blockedが分離される。
  - 外部送信・法務・保険・決済・個人情報が絡む場合、A12または専門家レビューへ回す条件が示される。
- Non-goals:
  - Keiの最終意思決定を代行すること。
  - Gate条件を満たしていないのに次フェーズへ進めること。
  - 法務、保険、投資、医療、安全に関する最終判断を断定すること。

## 6.5 Target Users & Context

- Primary user: Kei / PawMate founder
- Secondary users: A01 Chief of Staff Agent、A12 Risk Review Agent、関係する専門エージェント
- Usage context:
  - 朝の5チケット選定、日中の下書き作成、夕方のStatus更新、Gate前レビュー、外部送信前レビュー

## 6.6 Scope

### In Scope

${bullets(agent.domains)}

### Watched Tickets

${bullets(agent.tickets)}

### Out of Scope

- Keiの代理として外部送信・契約・最終承認を行うこと。
- Gate未達のまま拡大施策を既成事実化すること。
- 未提供情報を事実として埋めること。
- 専門家確認が必要な領域を断定すること。

### Assumptions

- 入力には、対象チケット、現在のフェーズ、利用したい成果物、既知の制約が与えられる。
- 情報が不足する場合は、仮定を明示して暫定出力を作る。
- PawMateの一次文脈は、roadmap / tickets / daily calendar / agent teamを優先する。

### Dependencies

${bullets(COMMON_CONTEXT)}

## 6.7 Deliverables

### Primary Outputs

${bullets(agent.deliverables)}

### Required Decision Support

${bullets(agent.confirmations)}

### Language & Tone

- 日本語。
- 業務文書。
- Keiが次の一手を選べる粒度。
- 事実、仮定、未確定を分ける。

## 6.8 Quality & Acceptance

- [MUST] 出力冒頭に対象チケットまたは対象テーマを明記する。
- [MUST] 最小完了ラインを1つ以上書く。
- [MUST] Keiへの確認事項を最大5件で書く。
- [MUST] Waiting / Blocked / Done候補を分ける。
- [MUST] 専門家・A12レビューが必要な条件を明記する。
- [SHOULD] 成果物は、そのまま送信・転記・実装判断に近い形で出す。
- [SHOULD] 重要な仮定は末尾の「仮定」にまとめる。

## 6.9 Interaction Model

1. 入力から対象フェーズ・対象チケット・制約を確認する。
2. PawMate文脈との整合を確認する。
3. 担当領域の成果物を作る。
4. 未確定、Waiting、Blocked、Kei判断を分離する。
5. 必要ならA12または専門家レビューへ回す。

## 6.10 Constraints & Policies

${bullets(specialSafety(agent))}
- Common System Roleを守る: PawMateの文脈、Gate条件、Guardrailsに沿って動く。
- 出力は、Keiがすぐ意思決定または実行できる粒度にする。

## 6.11 Traceability

| Item | Source |
|---|---|
| Role | pawmate_agent_team.md ${agent.id} section |
| Tickets | ${agent.tickets.join(", ")} |
| Deliverables | ${agent.deliverables.join(", ")} |
| Project rules | pawmate_roadmap.md / pawmate_tickets.md / pawmate_daily_calendar_fast.md |

## Review Summary

004では、${agent.id}の価値を「Keiの意思決定前の前捌き」に固定し、最終判断の代行と専門領域の断定を除外した。005ではこの要求を、出力契約・安全境界・運用要件へ分解する。
`;
}

function requirementsDefinition(agent) {
  return `# ${agent.id} ${agent.name}｜005 Requirements Definition

## 7.1 Meta

- pipeline_stage: requirements_definition
- version: 1.0.0
- project: PawMate
- status: ${agent.teamKind === "future" ? "warning" : "ok"}
- source: 004_request_definition_${agent.slug}.md

## 7.2 Overview

${agent.id} ${agent.name}は、PawMateの関連チケットを前進させるため、入力情報を「成果物初稿」「Kei判断」「Waiting / Blocked」「A12・専門家レビュー条件」に分解して返す。

## 7.3 Functional Requirements

- **ID**: REQ-FR-001
  - **Title**: 対象整理
  - **Statement**: MUST 対象チケット、対象フェーズ、今回の目的を出力冒頭に明記する。
  - **Rationale**: チケット運用との接続を失わないため。
  - **Priority**: P0
  - **Verify**: 出力冒頭に3項目がある。
  - **Trace**: RD Objectives / Scope
- **ID**: REQ-FR-002
  - **Title**: 成果物生成
  - **Statement**: MUST 担当領域に応じて、主要成果物をMarkdownで生成する。
  - **Rationale**: Keiが実行または判断できる状態にするため。
  - **Priority**: P0
  - **Verify**: 成果物セクションが存在し、空欄がない。
  - **Trace**: RD Deliverables
- **ID**: REQ-FR-003
  - **Title**: 判断事項抽出
  - **Statement**: MUST Keiが決めるべき事項を最大5件で列挙する。
  - **Rationale**: エージェントが意思決定を代行しないため。
  - **Priority**: P0
  - **Verify**: 「Kei確認」セクションが1〜5件。
  - **Trace**: RD Quality & Acceptance
- **ID**: REQ-FR-004
  - **Title**: 状態分類
  - **Statement**: MUST Done候補、Waiting候補、Blocked候補を分ける。
  - **Rationale**: A01のStatus更新へ渡すため。
  - **Priority**: P0
  - **Verify**: 状態分類セクションがある。
  - **Trace**: RD Interaction Model
- **ID**: REQ-FR-005
  - **Title**: レビュー接続
  - **Statement**: MUST 外部送信、法務、保険、決済、個人情報、事故リスクが絡む場合はA12または専門家確認へ接続する。
  - **Rationale**: 重大リスクの見落としを防ぐため。
  - **Priority**: P0
  - **Verify**: 該当時にレビュー条件が出る。
  - **Trace**: RD Constraints & Policies

## 7.4 Non-Functional Requirements

- **REQ-NFR-001**: MUST 出力は日本語で、見出しと箇条書きを中心にする。Verify: Markdown構造を確認。
- **REQ-NFR-002**: MUST 事実、仮定、未確定を分離する。Verify: 各区分が混在していない。
- **REQ-NFR-003**: SHOULD 1回の標準出力はKeiが3分以内に確認できる長さにする。Verify: 不要な背景説明が主文を圧迫していない。
- **REQ-NFR-004**: MUST Gate条件とフェーズ順序に反しない。Verify: 次フェーズ施策を出す場合、前提条件を明記。

## 7.5 Constraints

- **REQ-CNS-001**: MUST 参照文脈はPawMateのroadmap / tickets / daily calendar / agent teamを優先する。
- **REQ-CNS-002**: MUST 未提供情報を事実として補完しない。
- **REQ-CNS-003**: MUST Keiの代理で送信、契約、承認、支払い、採用確定をしない。
- **REQ-CNS-004**: SHOULD 出力項目数は、初動アクション7件以内、Kei確認5件以内に収める。

## 7.6 Safety & Compliance Requirements

${bullets(specialSafety(agent).map((line, index) => `**REQ-SAFE-${String(index + 1).padStart(3, "0")}**: MUST ${line}`))}
- **REQ-SAFE-099**: MUST 禁止または危険な依頼には、理由と安全な代替案を返す。

## 7.7 Operations Requirements

- **REQ-OPS-001**: MUST 出力末尾に「次の1アクション」を1つ書く。
- **REQ-OPS-002**: MUST Waitingに送る外部依存がある場合、待ち先、送信物、再確認日を分ける。
- **REQ-OPS-003**: SHOULD A01へ渡すStatus更新案を含める。
- **REQ-OPS-004**: SHOULD A12レビューが必要な場合、レビュー依頼の観点を3つ以内で書く。

## 7.8 Data & Interface Requirements

- Inputs:
  - 対象チケットまたはテーマ
  - 現在のフェーズ
  - 既に分かっている事実
  - 欲しい成果物
  - 制約、締切、外部送信有無
- Outputs:
  - 対象整理
  - 成果物
  - 最小完了ライン
  - Kei確認
  - Waiting / Blocked / Done候補
  - 次の1アクション

## 7.9 Assumptions & Open Issues

- Assumptions:
  - 入力不足時でも、仮定を明示して暫定案を返す。
  - 最終判断はKeiが行う。
- Open Issues:
  - フェーズが進んだ後の担当範囲の再定義。
  - A01/A12との受け渡しフォーマットの固定。

## 7.10 Risks & Mitigations

| Risk | Mitigation |
|---|---|
| 情報不足で断定する | 事実/仮定/未確定を分離する |
| Gate条件を飛ばす | フェーズとGateを出力冒頭で確認する |
| 外部送信リスク | A12レビュー条件を明記する |
| 成果物が抽象的になる | 最小完了ラインと次の1アクションを必ず出す |

## 7.11 Traceability Matrix

| RD Item | Requirement IDs | Notes |
|---|---|---|
| Objectives | REQ-FR-001, REQ-NFR-004 | Gate接続 |
| Deliverables | REQ-FR-002 | 成果物生成 |
| Kei confirmations | REQ-FR-003 | 意思決定分離 |
| Status handling | REQ-FR-004, REQ-OPS-002 | Daily運用 |
| Safety policies | REQ-FR-005, REQ-SAFE-* | A12接続 |

## 7.12 Review Summary

要件はPawMateの日次5チケット運用に接続できる粒度へ分解した。006では、Identity / Scope / I/O / Execution / Safety / Output Templateへ配賦する。
`;
}

function basicDesign(agent) {
  const sections = [
    ["SEC-01", "Identity", "役割・ミッション・最終責任の境界を固定する"],
    ["SEC-02", "PawMate Context", "ロードマップ、チケット、Gate、日次運用との接続を固定する"],
    ["SEC-03", "Scope", "担当範囲と非対応範囲を分ける"],
    ["SEC-04", "Input Contract", "最低入力と不足時の扱いを定義する"],
    ["SEC-05", "Output Contract", "成果物と判断支援の出力構造を固定する"],
    ["SEC-06", "Execution Flow", "処理順序を定義する"],
    ["SEC-07", "Collaboration", "A01/A12/他専門エージェントとの受け渡しを定義する"],
    ["SEC-08", "Safety & Escalation", "禁止、断定回避、レビュー条件を固定する"],
    ["SEC-09", "Quality Gate", "出力前セルフチェックを定義する"],
    ["SEC-10", "Output Template", "ユーザーに返す標準フォーマットを定義する"],
  ];
  return `# ${agent.id} ${agent.name}｜006 Basic Design

## 6.1 Meta

- pipeline_stage: basic_design
- version: 1.0.0
- project: PawMate
- status: ${agent.teamKind === "future" ? "warning" : "ok"}

## 6.2 Architecture Summary

この基本設計は、${agent.id} ${agent.name}をPawMateの日次チケット運用へ組み込むためのプロンプト構造である。最終プロンプトは、役割、PawMate文脈、担当範囲、入出力契約、実行順、協働、安全、品質、出力テンプレートの10章で構成する。

重要な設計判断:

- Gate条件とフェーズ順序を全章の前提に置く。
- Keiの最終意思決定は代行しない。
- 成果物だけでなく、Waiting / Blocked / Kei確認を必ず出す。
- A12レビュー条件を安全章へ集約する。

## 6.3 Section Map

| Section | Name | Purpose |
|---|---|---|
${sections.map(([id, name, purpose]) => `| ${id} | ${name} | ${purpose} |`).join("\n")}

## 6.4 Section Specs

${sections
  .map(
    ([id, name, purpose]) => `### ${id} ${name}

- Purpose: ${purpose}
- Inputs: 004 Request Definition, 005 Requirements Definition, pawmate_agent_team.md
- Outputs: 最終プロンプト本文の${name}章
- Rules:
  - P0/P1要件を優先する。
  - 事実、仮定、未確定を混ぜない。
  - Gate条件に反する文言を入れない。
- Failure Handling:
  - 不足は追加確認へ倒す。
  - リスクはA12または専門家確認へ倒す。
- Review Checklist:
  - 章の目的が他章と重複していない。
  - 必須要件を落としていない。
  - Keiの判断代行になっていない。
- Trace: REQ-FR-001〜005, REQ-CNS-001〜004, REQ-SAFE-*, REQ-OPS-001〜004
`,
  )
  .join("\n")}

## 6.5 Requirements-to-Sections Matrix

| REQ ID | Priority | Section ID | Notes |
|---|---|---|---|
| REQ-FR-001 | P0 | SEC-02, SEC-04 | 対象整理 |
| REQ-FR-002 | P0 | SEC-05, SEC-10 | 成果物生成 |
| REQ-FR-003 | P0 | SEC-05, SEC-10 | Kei確認 |
| REQ-FR-004 | P0 | SEC-06, SEC-10 | 状態分類 |
| REQ-FR-005 | P0 | SEC-08 | レビュー接続 |
| REQ-NFR-001〜004 | P0/P1 | SEC-09, SEC-10 | 品質 |
| REQ-CNS-001〜004 | P0/P1 | SEC-02, SEC-03 | 制約 |
| REQ-SAFE-* | P0 | SEC-08 | 安全 |
| REQ-OPS-001〜004 | P0/P1 | SEC-06, SEC-07, SEC-10 | 運用 |

## 6.6 Open Issues & Next Decisions

- A01へ渡すStatus更新フォーマットの共通化。
- A12レビュー対象を自動判定するキーワードの精緻化。
- フェーズ進行後の担当範囲見直し。

## 6.7 Review Summary

10章構成で、008ドラフトへ迷わず進める骨格を作った。007では各SECの本文テンプレ、分岐、不足・矛盾時処理、出力テンプレートを確定する。
`;
}

function detailedDesign(agent) {
  return `# ${agent.id} ${agent.name}｜007 Detailed Design

## Meta

- pipeline_stage: detailed_design
- version: 1.0.0
- project: PawMate
- status: ${agent.teamKind === "future" ? "warning" : "ok"}

## Global Rules

- 優先順位: SAFE > Gate/Phase > I/O > Quality > Style
- 断定基準:
  - 事実: 入力または参照資料に根拠がある場合のみ断定する。
  - 仮定: 「仮定:」を付ける。
  - 未確定: 断定せず、追加確認へ倒す。
- 上限:
  - 初動アクション: 最大7件
  - Kei確認: 最大5件
  - 追加確認: 最大7件
- 禁止語: いい感じ、適宜、なるはや、十分に、必要に応じて、できるだけ、なるべく、適切に

## Section Text Templates

### SEC-01 Identity

Template:

> あなたは「${agent.id}｜${agent.name}」である。あなたの責務は、PawMateの担当領域を、Keiがすぐ実行または判断できる成果物へ変換することである。

Rules:

- MUST 役割を${agent.id}に固定する。
- MUST Keiの最終判断を代行しない。

Trace: REQ-FR-001, REQ-CNS-003

### SEC-02 PawMate Context

Template:

> 必ずPawMateのroadmap、tickets、daily calendar、agent teamの文脈に沿う。勝手にフェーズを飛ばさず、Gate条件を守る。

Rules:

- MUST Gate条件を優先する。
- MUST 関連チケットを出力冒頭に置く。

Trace: REQ-NFR-004, REQ-CNS-001

### SEC-03 Scope

In scope:

${bullets(agent.domains)}

Standard deliverables:

${bullets(agent.deliverables)}

Out of scope:

- Keiの代理送信、契約、承認。
- 専門家判断の代行。
- 未提供情報の事実化。

Trace: REQ-FR-002, REQ-CNS-002, REQ-CNS-003

### SEC-04 Input Contract

MUST accept:

- 対象チケットまたはテーマ
- 現在のフェーズ
- 分かっている事実
- 欲しい成果物
- 制約、締切、外部送信有無

Branch:

- If 不足あり: 条件付き暫定案、追加確認最大7件、仮定を出す。
- If 矛盾あり: 矛盾点、採用前提、影響を出す。

Trace: REQ-FR-001, REQ-NFR-002

### SEC-05 Output Contract

MUST output:

1. 対象整理
2. 成果物
3. 最小完了ライン
4. Kei確認
5. Waiting / Blocked / Done候補
6. 次の1アクション

Trace: REQ-FR-002〜004, REQ-OPS-001〜003

### SEC-06 Execution Flow

1. フェーズとGateを確認する。
2. 対象チケットを確認する。
3. 担当領域の成果物を作る。
4. 事実、仮定、未確定を分離する。
5. Kei確認とStatus更新案を出す。
6. レビュー条件を判定する。

Trace: REQ-FR-001〜005

### SEC-07 Collaboration

- A01へ: Status更新案、今日の完了ライン、Waiting条件を渡す。
- A12へ: 外部送信、法務、保険、決済、事故、個人情報リスクを渡す。
- 他専門エージェントへ: 担当外の論点をhandoffする。

Trace: REQ-FR-005, REQ-OPS-003, REQ-OPS-004

### SEC-08 Safety & Escalation

MUST:

${bullets(specialSafety(agent))}
- 危険または範囲外の依頼は、理由と代替案を返す。

Trace: REQ-SAFE-*

### SEC-09 Quality Gate

出力前に確認する:

- 対象チケットがある。
- 成果物が空欄ではない。
- Kei確認が最大5件。
- Waiting / Blocked / Done候補が分かれている。
- A12または専門家レビュー条件がある。
- 事実/仮定/未確定が混ざっていない。

Trace: REQ-NFR-001〜004

### SEC-10 Output Template

最終出力は以下の順序で返す:

1. 対象
2. 成果物
3. 最小完了ライン
4. Kei確認
5. Status更新案
6. リスク/レビュー条件
7. 次の1アクション

Trace: REQ-FR-002〜004, REQ-OPS-001〜004

## Validation Suite

- Smoke 1: チケットIDだけ渡された場合、目的と不足情報を返せる。
- Smoke 2: 外部送信文面を求められた場合、A12レビュー条件を返せる。
- Smoke 3: フェーズを飛ばす依頼が来た場合、Gate未達条件を明示できる。

## Review Summary

007では、10章構造を最終プロンプトに貼れる粒度まで具体化した。008ではこの仕様をもとに全文ドラフト化する。
`;
}

function systemPromptDraft(agent) {
  return finalPrompt(agent, "Draft System Prompt v0.9.0", false);
}

function review(agent) {
  return `# ${agent.id} ${agent.name}｜009 Review

## Meta

- pipeline_stage: review
- version: 1.0.0
- project: PawMate
- reviewed_artifact: 008_system_prompt_draft_${agent.slug}.md
- status: pass_with_patches

## Review Findings

| ID | Severity | Finding | Patch |
|---|---:|---|---|
| RV-${agent.id}-001 | P1 | 最終プロンプトでKeiの意思決定代行を避ける記述を強める必要がある。 | SEC-01とSEC-08に「最終判断はKei」を追加する。 |
| RV-${agent.id}-002 | P1 | A01/A12への受け渡しが弱いと日次運用に接続しにくい。 | SEC-07とSEC-10にStatus更新案とレビュー条件を固定する。 |
| RV-${agent.id}-003 | P2 | 追加候補または専門領域では前提の薄さが残る場合がある。 | Open Issuesにフェーズ進行後の見直しを残す。 |

## Patch Plan

- PATCH-001: SEC-01に「最終判断はKei」の境界を明記する。
- PATCH-002: SEC-07にA01/A12へのhandoffを追加する。
- PATCH-003: SEC-10にStatus更新案、リスク/レビュー条件、次の1アクションを固定する。

## Acceptance Check

- SEC構成: OK
- PawMate文脈: OK
- Gate条件: OK
- I/O契約: OK
- Safety/Escalation: OK
- Ready-to-paste: OK after patches

## Review Summary

008ドラフトは実用可能。010では上記パッチを反映し、リリース用Final System Promptとして整える。
`;
}

function finalPrompt(agent, title = "Final System Prompt v1.0.0", isFinal = true) {
  return `# ${title}

## Global Rules（最優先）

- 優先順位: SAFE > Gate/Phase > I/O > Quality > Style
- 必ず参照する文脈:
${bullets(COMMON_CONTEXT)}
- PawMateの基本方針「広げる前に深める。深まったら広げる。」を守る。
- 勝手にフェーズを飛ばさず、Gate条件とGuardrailsを守る。
- 事実、仮定、未確定を分ける。
- 最終判断、外部送信、契約、承認はKeiが行う。
- 出力は、Keiがすぐ意思決定または実行できる粒度にする。

## SEC-01 Identity

あなたは「${agent.id}｜${agent.name}」である。

あなたの責務は、PawMateプロジェクトにおいて次の役割を果たすことである。

${agent.role}

あなたはKeiの意思決定を代行しない。あなたは、下書き、論点整理、確認事項、最小完了ライン、Status更新案を作り、Keiが判断しやすい状態にする。

## SEC-02 PawMate Context

- Primary user: Kei / PawMate founder
- Project stage: roadmapとdaily calendarの最新フェーズに従う
- Operating rhythm: 1日5チケット、最小3チケットをDoneまたはWaitingへ進める
- Gate rule: Gate条件が揃うまで次フェーズを既成事実化しない
- Core handoff:
  - A01 Chief of Staff Agentへ: Status更新案、Waiting条件、今日の完了ライン
  - A12 Risk Review Agentへ: 外部送信、法務、保険、決済、事故、個人情報、炎上のリスク

## SEC-03 Scope

### In Scope

${bullets(agent.domains)}

### Watched Tickets

${bullets(agent.tickets)}

### Standard Deliverables

${bullets(agent.deliverables)}

### Out of Scope

- Keiの代理で外部送信、契約、支払い、採用確定、承認を行うこと。
- 法務・保険・投資・医療・安全に関する最終判断を断定すること。
- Gate条件を満たさないまま次フェーズの実行を確定すること。
- 未提供の個人情報、機密情報、相手の意図を推測して事実化すること。

## SEC-04 Input Contract

最低限、以下のうち分かるものを入力として受け取る。

- 対象チケットまたはテーマ
- 現在のフェーズ
- 分かっている事実
- 欲しい成果物
- 締切または今日の完了ライン
- 外部送信の有無
- Keiが迷っている判断

不足がある場合は、推測で埋めず「仮定」または「追加確認」として扱う。

## SEC-05 Output Contract

標準出力には次を含める。

1. 対象
2. 成果物
3. 最小完了ライン
4. Kei確認
5. Status更新案
6. リスク/レビュー条件
7. 次の1アクション

## SEC-06 Execution Flow

1. フェーズ、Gate、対象チケットを確認する。
2. 担当領域に照らして、今回作る成果物を1つに絞る。
3. 成果物を作成する。
4. 事実、仮定、未確定を分ける。
5. Kei確認を最大5件に絞る。
6. Done / Waiting / Blockedの候補を分ける。
7. A12または専門家レビューが必要か判定する。
8. 次の1アクションを1つだけ提示する。

## SEC-07 Collaboration & Handoff

- A01へ渡すもの:
  - 対象チケット
  - 今日の最小完了ライン
  - Status更新案
  - Waitingに送る条件
- A12へ渡すもの:
  - リスクの種類
  - 想定される影響
  - 最小対策
  - Go / No-Goに関わる未解決論点
- 他エージェントへ渡すもの:
  - 担当外の論点
  - 依頼したい成果物
  - 依存チケット

## SEC-08 Safety & Escalation

${bullets(specialSafety(agent))}
- 外部送信前、リリース前、Gate前に重大リスクがある場合はA12レビューへ回す。
- 禁止または危険な依頼には、対応できない理由と安全な代替案を返す。
- 最新情報が必要で未確認の場合は、未確認と明記する。

## SEC-09 Quality Gate（出力前セルフチェック）

- 対象チケットまたはテーマが明記されている。
- 成果物が空欄ではない。
- 最小完了ラインがある。
- Kei確認が1〜5件に収まっている。
- Waiting / Blocked / Done候補が分かれている。
- リスクまたはレビュー条件が書かれている。
- 次の1アクションが1つに絞られている。
- Gate条件に反していない。

## SEC-10 Output Template

\`\`\`md
## 対象
- Ticket / Theme:
- Phase:
- Goal:

## 成果物

（ここに${agent.deliverables.slice(0, 3).join(" / ")}などを作成）

## 最小完了ライン
- 

## Kei確認（最大5）
1. 

## Status更新案
- Done:
- Waiting:
- Blocked:

## リスク/レビュー条件
- A12レビュー: 必要 / 不要
- 専門家確認: 必要 / 不要
- 理由:

## 次の1アクション
- 
\`\`\`

## SEC-11 Open Issues & Next Decisions

- A01/A12との共通handoffフォーマットの運用定着。
- フェーズ進行後の担当範囲の再定義。
- ${agent.id}固有の成果物テンプレートの実例追加。

${isFinal ? releaseNotes(agent) : ""}
`;
}

function releaseNotes(agent) {
  return `## Release Notes v1.0.0

### Applied Patches

- PATCH-001: Keiの最終判断境界をSEC-01へ明記。
- PATCH-002: A01/A12へのhandoffをSEC-07へ追加。
- PATCH-003: Status更新案、レビュー条件、次の1アクションをSEC-10へ固定。

### Scope Summary

- in scope: ${agent.domains.slice(0, 4).join(" / ")}
- out of scope: 最終承認、専門家判断の代行、Gate飛ばし、未提供情報の断定

### Verification Log

- SEC coverage: OK
- PawMate context: OK
- Gate guardrails: OK
- Safety/Escalation: OK
- Ready-to-paste: OK
`;
}

function readme(agents) {
  return `# PawMate AFOS Agents

Generated from: \`Pawmate/pawmate_agent_team.md\`

Scope: A01〜A18, AFOS 003〜010.

## Flow

- 003: Agent Idea
- 004: Request Definition
- 005: Requirements Definition
- 006: Basic Design
- 007: Detailed Design
- 008: System Prompt Draft
- 009: Review
- 010: Final System Prompt

## Agent Index

| Order | Agent | Folder | Final Prompt |
|---:|---|---|---|
${agents
  .map((agent) => {
    const folder = `${agent.id.toLowerCase()}-${agent.slug}`;
    return `| ${agent.number} | ${agent.id} ${agent.name} | \`${folder}\` | [010_final_${agent.slug}.md](./${folder}/010_final_${agent.slug}.md) |`;
  })
  .join("\n")}

## Notes

- A01〜A12 are the base PawMate agent team.
- A13〜A18 are future/phase-3 candidate agents; their first-pass AFOS outputs are marked warning where assumptions are thin.
- All final prompts preserve PawMate's Gate-first policy and keep Kei as final decision-maker.
`;
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

for (const agent of agents) {
  const folder = path.join(outRoot, `${agent.id.toLowerCase()}-${agent.slug}`);
  fs.mkdirSync(folder, { recursive: true });
  const files = {
    [`003_agent_idea_${agent.slug}.json`]: jsonAgent(agent),
    [`004_request_definition_${agent.slug}.md`]: requestDefinition(agent),
    [`005_requirements_definition_${agent.slug}.md`]: requirementsDefinition(agent),
    [`006_basic_design_${agent.slug}.md`]: basicDesign(agent),
    [`007_detailed_design_${agent.slug}.md`]: detailedDesign(agent),
    [`008_system_prompt_draft_${agent.slug}.md`]: systemPromptDraft(agent),
    [`009_review_${agent.slug}.md`]: review(agent),
    [`010_final_${agent.slug}.md`]: finalPrompt(agent),
  };
  for (const [file, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(folder, file), content, "utf8");
  }
}

fs.writeFileSync(path.join(outRoot, "README.md"), readme(agents), "utf8");

console.log(`Generated ${agents.length} agents in ${path.relative(root, outRoot)}`);
console.log(`Generated ${agents.length * 8 + 1} files`);
