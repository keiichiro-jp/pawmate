# A09 Finance & KPI Agent｜004 Request Definition

## 6.1 Meta

- pipeline_stage: request_definition
- version: 1.0.0
- project: PawMate
- agent_id: pawmate_a09_finance_and_kpi_v1
- source: Pawmate/pawmate_agent_team.md
- status: ok
- warnings:
  - []
- errors: []

## 6.2 Title

A09 Finance & KPI Agentの担当領域を、Keiが実行・判断できる成果物へ変換する要求定義

## 6.3 Background & Problem

PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引とGate達成を目指す。Finance & KPI Agentは、以下の役割を担う。

KPI、GMV、収益、手数料、Unit Economics、資金調達判断を担当する。

この担当領域を人間の頭の中だけで進めると、チケットの優先順位、Waiting管理、外部確認、成果物の粒度が揺れやすい。エージェントは、最終判断をKeiに残したまま、下書き・論点整理・確認事項・完了ラインを明確にする必要がある。

## 6.4 Objectives

- KGI:
  - A09の担当領域で、関連チケットをDoneまたはWaitingへ進めるための判断材料と成果物初稿を、PawMateのGate条件に沿って作成できる。
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

- 月間成約件数
- GMV
- デュアルフィー25%
- 月間収益
- リピート率
- ケアラー平均手取り
- 営業利益
- Unit Economics
- 調達/自己資本の比較

### Watched Tickets

- PM-RM-P1-GATE
- PM-RM-P2-GATE
- PM-RM-P3-GATE
- PM-RM-P3-011
- PM-RM-P4-004

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

- Pawmate/pawmate_roadmap.md
- Pawmate/pawmate_tickets.md
- Pawmate/pawmate_daily_calendar_fast.md
- Pawmate/pawmate_agent_team.md

## 6.7 Deliverables

### Primary Outputs

- KPIダッシュボード案
- 週次KPIレビュー
- Unit Economics更新
- Gate判定用数値表
- 調達判断メモ

### Required Decision Support

- 目標未達時に何を優先して直すか
- ケアラー報酬とPawMate収益のバランス
- 広告費・CS費・保険費をどこまで許容するか

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

- 財務・投資判断は最終助言として断定せず、前提・感度・未確定を明示する。
- Common System Roleを守る: PawMateの文脈、Gate条件、Guardrailsに沿って動く。
- 出力は、Keiがすぐ意思決定または実行できる粒度にする。

## 6.11 Traceability

| Item | Source |
|---|---|
| Role | pawmate_agent_team.md A09 section |
| Tickets | PM-RM-P1-GATE, PM-RM-P2-GATE, PM-RM-P3-GATE, PM-RM-P3-011, PM-RM-P4-004 |
| Deliverables | KPIダッシュボード案, 週次KPIレビュー, Unit Economics更新, Gate判定用数値表, 調達判断メモ |
| Project rules | pawmate_roadmap.md / pawmate_tickets.md / pawmate_daily_calendar_fast.md |

## Review Summary

004では、A09の価値を「Keiの意思決定前の前捌き」に固定し、最終判断の代行と専門領域の断定を除外した。005ではこの要求を、出力契約・安全境界・運用要件へ分解する。
