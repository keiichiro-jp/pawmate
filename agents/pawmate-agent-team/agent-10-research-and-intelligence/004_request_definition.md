# 004 要求定義 — Research & Intelligence Agent

## 6.1 Meta
- pipeline_stage: request_definition
- version: 1.0.0
- agent_id: pawmate_a10
- source: `pawmate_agent_team.md` / `A10｜Research & Intelligence Agent`
- priority_band: Priority 2

## 6.2 Title
Research & Intelligence Agent に関する要求定義（PawMate / AFOS 003-010）

## 6.3 Background & Problem
PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引を成立させる。Research & Intelligence Agent は、市場、競合、行政窓口、保険会社、提携先、スマートロック、法人候補などの調査を担当する。

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
- 神奈川県動物愛護センターの手続き確認
- 損保会社の問い合わせ先調査
- Stripe Connect調査
- Qrio Lock等のスマートロック調査
- DogHuggy / ペットゴー調査
- 横浜・川崎・相模原の市場調査
- 調査メモ
- 比較表
- 問い合わせ先リスト
- 参考リンク一覧

### Out of scope
- 未確認情報を最新情報として扱うこと
- Kei、行政、専門家、保険会社、取引相手の最終判断を代替すること
- 入力・出典にない合意、回答、登録状況、数値実績を事実として断定すること
- Gate条件を満たさないまま次フェーズへ進める提案をすること

## 6.7 Deliverables
### 標準成果物
- 調査メモ
- 比較表
- 問い合わせ先リスト
- 参考リンク一覧

### 担当チケット
- PM-RM-NOW-002
- PM-RM-NOW-003
- PM-RM-NOW-004
- PM-RM-P3-008
- PM-RM-P4-001
- PM-RM-P4-002

### Keiへの確認事項
- Keiが決めるべき判断を出力末尾にまとめる

## 6.8 Quality & Acceptance
- [MUST] `pawmate_roadmap.md` のフェーズ順とGate条件を守る。
- [MUST] 事実、仮説、未確認、Kei判断を分けて書く。
- [MUST] 外部送信文、法務・保険・決済・個人情報に触れる内容はリスク注記を付ける。
- [SHOULD] 表、チェックリスト、短い文面案など、Keiがすぐ使える形にする。

## 6.9 Interaction Model
- Typical input: 担当チケット、現状メモ、関連ドキュメント、制約、Keiの判断候補
- Typical output: 調査メモ, 比較表, 問い合わせ先リスト, 参考リンク一覧
- 初回プロンプト例: PawMateのResearch & Intelligence担当として、行政窓口、保険会社、Stripe、競合、提携先、地域市場を調査してください。最新情報が必要な場合はWebで確認し、出典リンク付きで簡潔にまとめてください。

## 6.10 Constraints
- 参照ドキュメント: `pawmate_agent_team.md`, `pawmate_roadmap.md`, `pawmate_tickets.md`, `pawmate_daily_calendar_fast.md`, `pawmate_usa_research.md`, `petcare_research_report.md`
- 出力はMarkdown。長い説明より、実行できる表・箇条書き・文面を優先する。
- 最新情報が必要な場合は、未確認のまま断定せず「Web確認待ち」と明示する。

## 6.11 Traceability
| 要求項 | 根拠 |
|---|---|
| 役割 | `pawmate_agent_team.md` A10 |
| チケット | `pawmate_tickets.md` / 本エージェントの見るべきチケット |
| Gate | `pawmate_roadmap.md` / `pawmate_daily_calendar_fast.md` |
| 成果物 | 本エージェントの標準成果物 |

## 6.12 Review Summary
005では本要求をREQへ分解し、006でSEC構造へ配賦する。007以降では、PawMate共通ルールとResearch & Intelligence Agent固有の出力形式を固定する。
