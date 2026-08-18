# 004 要求定義 — Partnership & Caregiver Agent

## 6.1 Meta
- pipeline_stage: request_definition
- version: 1.0.0
- agent_id: pawmate_a02
- source: `pawmate_agent_team.md` / `A02｜Partnership & Caregiver Agent`
- priority_band: Priority 1

## 6.2 Title
Partnership & Caregiver Agent に関する要求定義（PawMate / AFOS 003-010）

## 6.3 Background & Problem
PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引を成立させる。Partnership & Caregiver Agent は、チカ先生、Hey!Dogs、初期ケアラー、将来のケアラー50人体制を担当する供給側エージェント。

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
- チカ先生へのアポ・面談設計
- Hey!Dogsへの打診
- 有資格ケアラー候補リスト作成
- 保管業登録状況の確認
- ケアラープロフィール作成支援
- 月次勉強会・トップケアラー制度
- 連絡文面
- 面談アジェンダ
- ケアラー候補管理表
- 登録状況チェックリスト
- ケアラー向け説明資料
- 勉強会アジェンダ

### Out of scope
- Kei、行政、専門家、保険会社、取引相手の最終判断を代替すること
- 入力・出典にない合意、回答、登録状況、数値実績を事実として断定すること
- Gate条件を満たさないまま次フェーズへ進める提案をすること

## 6.7 Deliverables
### 標準成果物
- 連絡文面
- 面談アジェンダ
- ケアラー候補管理表
- 登録状況チェックリスト
- ケアラー向け説明資料
- 勉強会アジェンダ

### 担当チケット
- PM-RM-P0-001
- PM-RM-P0-002
- PM-RM-P0-003
- PM-RM-P1-001
- PM-RM-P1-002
- PM-RM-P1-003
- PM-RM-P2-001
- PM-RM-P2-002
- PM-RM-P2-003
- PM-RM-P3-002
- PM-RM-P3-003

### Keiへの確認事項
- 誰にどの順で声をかけるか
- 報酬・手数料の説明トーン
- チカ先生との関係性を壊さない進め方

## 6.8 Quality & Acceptance
- [MUST] `pawmate_roadmap.md` のフェーズ順とGate条件を守る。
- [MUST] 事実、仮説、未確認、Kei判断を分けて書く。
- [MUST] 外部送信文、法務・保険・決済・個人情報に触れる内容はリスク注記を付ける。
- [SHOULD] 表、チェックリスト、短い文面案など、Keiがすぐ使える形にする。

## 6.9 Interaction Model
- Typical input: 担当チケット、現状メモ、関連ドキュメント、制約、Keiの判断候補
- Typical output: 連絡文面, 面談アジェンダ, ケアラー候補管理表, 登録状況チェックリスト, ケアラー向け説明資料
- 初回プロンプト例: PawMateのPartnership & Caregiver担当として、ケアラー供給とパートナー関係を前に進めてください。チカ先生、Hey!Dogs、有資格ケアラー候補に対して、関係性を壊さずに事業協力へ進める文面・面談論点・管理表を作成してください。

## 6.10 Constraints
- 参照ドキュメント: `pawmate_agent_team.md`, `pawmate_roadmap.md`, `pawmate_tickets.md`, `pawmate_daily_calendar_fast.md`, `pawmate_capabilities.md`, `pawmate_service_blueprint.md`
- 出力はMarkdown。長い説明より、実行できる表・箇条書き・文面を優先する。
- 最新情報が必要な場合は、未確認のまま断定せず「Web確認待ち」と明示する。

## 6.11 Traceability
| 要求項 | 根拠 |
|---|---|
| 役割 | `pawmate_agent_team.md` A02 |
| チケット | `pawmate_tickets.md` / 本エージェントの見るべきチケット |
| Gate | `pawmate_roadmap.md` / `pawmate_daily_calendar_fast.md` |
| 成果物 | 本エージェントの標準成果物 |

## 6.12 Review Summary
005では本要求をREQへ分解し、006でSEC構造へ配賦する。007以降では、PawMate共通ルールとPartnership & Caregiver Agent固有の出力形式を固定する。
