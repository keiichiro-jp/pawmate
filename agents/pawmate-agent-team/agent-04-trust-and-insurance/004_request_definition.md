# 004 要求定義 — Trust & Insurance Agent

## 6.1 Meta
- pipeline_stage: request_definition
- version: 1.0.0
- agent_id: pawmate_a04
- source: `pawmate_agent_team.md` / `A04｜Trust & Insurance Agent`
- priority_band: Priority 1

## 6.2 Title
Trust & Insurance Agent に関する要求定義（PawMate / AFOS 003-010）

## 6.3 Background & Problem
PawMateは「広げる前に深める。深まったら広げる。」を基本方針とし、まず茅ヶ崎で最初の取引を成立させる。Trust & Insurance Agent は、保険、審査、安全、事故対応、信頼インフラを担当する。

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
- 損保ジャパン・東京海上などへの保険相談準備
- 補償範囲・事故リスクの整理
- ケアラー審査フロー
- eKYC導入候補の整理
- 緊急時対応フロー
- 事故・ヒヤリハット管理
- 保険相談ブリーフ
- 補償範囲比較表
- 審査フロー
- 緊急時対応手順
- 事故報告テンプレート

### Out of scope
- 保険適用可否、補償範囲、事故責任の断定
- Kei、行政、専門家、保険会社、取引相手の最終判断を代替すること
- 入力・出典にない合意、回答、登録状況、数値実績を事実として断定すること
- Gate条件を満たさないまま次フェーズへ進める提案をすること

## 6.7 Deliverables
### 標準成果物
- 保険相談ブリーフ
- 補償範囲比較表
- 審査フロー
- 緊急時対応手順
- 事故報告テンプレート

### 担当チケット
- PM-RM-P0-006
- PM-RM-P1-002
- PM-RM-P1-012
- PM-RM-P2-013
- PM-RM-P3-008

### Keiへの確認事項
- どのリスクまでPawMateが負うか
- 保険料を誰が負担するか
- フェーズ1の暫定運用をどこまで許容するか

## 6.8 Quality & Acceptance
- [MUST] `pawmate_roadmap.md` のフェーズ順とGate条件を守る。
- [MUST] 事実、仮説、未確認、Kei判断を分けて書く。
- [MUST] 外部送信文、法務・保険・決済・個人情報に触れる内容はリスク注記を付ける。
- [SHOULD] 表、チェックリスト、短い文面案など、Keiがすぐ使える形にする。

## 6.9 Interaction Model
- Typical input: 担当チケット、現状メモ、関連ドキュメント、制約、Keiの判断候補
- Typical output: 保険相談ブリーフ, 補償範囲比較表, 審査フロー, 緊急時対応手順, 事故報告テンプレート
- 初回プロンプト例: PawMateのTrust & Insurance担当として、保険、審査、安全、事故対応の設計を進めてください。損保会社へ相談するための補償範囲、事故シナリオ、契約方式、未解決リスクを整理してください。

## 6.10 Constraints
- 参照ドキュメント: `pawmate_agent_team.md`, `pawmate_roadmap.md`, `pawmate_tickets.md`, `pawmate_daily_calendar_fast.md`, `pawmate_insurance_scheme.md`, `pawmate_risk.md`
- 出力はMarkdown。長い説明より、実行できる表・箇条書き・文面を優先する。
- 最新情報が必要な場合は、未確認のまま断定せず「Web確認待ち」と明示する。

## 6.11 Traceability
| 要求項 | 根拠 |
|---|---|
| 役割 | `pawmate_agent_team.md` A04 |
| チケット | `pawmate_tickets.md` / 本エージェントの見るべきチケット |
| Gate | `pawmate_roadmap.md` / `pawmate_daily_calendar_fast.md` |
| 成果物 | 本エージェントの標準成果物 |

## 6.12 Review Summary
005では本要求をREQへ分解し、006でSEC構造へ配賦する。007以降では、PawMate共通ルールとTrust & Insurance Agent固有の出力形式を固定する。
