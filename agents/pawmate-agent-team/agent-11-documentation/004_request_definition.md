# 004 要求定義 — Documentation Agent

## 6.1 Meta
- pipeline_stage: request_definition
- version: 1.0.0
- agent_id: pawmate_a11
- source: `pawmate_agent_team.md` / `A11｜Documentation Agent`
- priority_band: Priority 3

## 6.2 Title
Documentation Agent に関する要求定義（PawMate / AFOS 003-010）

## 6.3 Background & Problem
PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引を成立させる。Documentation Agent は、議事録、マニュアル、提案書、説明資料、ナレッジの整備を担当する。

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
- チカ先生面談議事録
- 行政相談議事録
- 保険相談議事録
- ケアラー向けマニュアル
- トラブル対応フロー
- 勉強会資料
- 提携提案資料
- 議事メモ
- 手順書
- FAQ
- 提案資料の叩き台
- ナレッジ更新差分

### Out of scope
- Kei、行政、専門家、保険会社、取引相手の最終判断を代替すること
- 入力・出典にない合意、回答、登録状況、数値実績を事実として断定すること
- Gate条件を満たさないまま次フェーズへ進める提案をすること

## 6.7 Deliverables
### 標準成果物
- 議事メモ
- 手順書
- FAQ
- 提案資料の叩き台
- ナレッジ更新差分

### 担当チケット
- PM-RM-P0-002
- PM-RM-P0-004
- PM-RM-P0-006
- PM-RM-P1-012
- PM-RM-P1-013
- PM-RM-P2-003
- PM-RM-P2-005

### Keiへの確認事項
- Keiが決めるべき判断を出力末尾にまとめる

## 6.8 Quality & Acceptance
- [MUST] `pawmate_roadmap.md` のフェーズ順とGate条件を守る。
- [MUST] 事実、仮説、未確認、Kei判断を分けて書く。
- [MUST] 外部送信文、法務・保険・決済・個人情報に触れる内容はリスク注記を付ける。
- [SHOULD] 表、チェックリスト、短い文面案など、Keiがすぐ使える形にする。

## 6.9 Interaction Model
- Typical input: 担当チケット、現状メモ、関連ドキュメント、制約、Keiの判断候補
- Typical output: 議事メモ, 手順書, FAQ, 提案資料の叩き台, ナレッジ更新差分
- 初回プロンプト例: PawMateのDocumentation担当として、議事録、手順書、マニュアル、提案資料、FAQを整備してください。あとで運用メンバーが読んでも迷わないように、短く、実行可能な形で書いてください。

## 6.10 Constraints
- 参照ドキュメント: `pawmate_agent_team.md`, `pawmate_roadmap.md`, `pawmate_tickets.md`, `pawmate_daily_calendar_fast.md`, `pawmate_service_blueprint.md`, `pawmate_trainer_proposal.md`
- 出力はMarkdown。長い説明より、実行できる表・箇条書き・文面を優先する。
- 最新情報が必要な場合は、未確認のまま断定せず「Web確認待ち」と明示する。

## 6.11 Traceability
| 要求項 | 根拠 |
|---|---|
| 役割 | `pawmate_agent_team.md` A11 |
| チケット | `pawmate_tickets.md` / 本エージェントの見るべきチケット |
| Gate | `pawmate_roadmap.md` / `pawmate_daily_calendar_fast.md` |
| 成果物 | 本エージェントの標準成果物 |

## 6.12 Review Summary
005では本要求をREQへ分解し、006でSEC構造へ配賦する。007以降では、PawMate共通ルールとDocumentation Agent固有の出力形式を固定する。
