---
id: PM-RM-P1-009
title: リピート率表示をプロフィールに追加する
status: done
sub_status: null
owner: A06
priority: P1
epic: P1
due: 2026-09-30
dependencies: [PM-RM-P0-005]
created: 2026-05-31
---

# PM-RM-P1-009: リピート率表示をプロフィールに追加する

## 目的
飼い主がプロフィール上でリピート率を確認できるようにし、ケアラー選択の信頼材料を提供する。

## Subtasks
- [x] リピート率の定義を決める（同一ケアラーへの2回目以降の予約数 ÷ 完了予約総数）
- [x] リピート率の計算ロジックを決める
- [x] 初期データが少ない場合の表示ルールを決める（5件未満 → 「データ蓄積中」）
- [x] ケアラープロフィールに表示枠を追加する（CarerCard: コンパクトバー / CarerDetailPage: フルブロック）
- [x] サンプルデータで表示確認する
- [x] 表示文言を調整する（「〇件の完了ケアをもとに算出」と根拠を明示）

## Acceptance Criteria
- [x] 飼い主がプロフィール上でリピート率を確認できる
- [x] 初期データ不足時にも誤解を生まない表示になっている

## 完了メモ（2026-06-02 A06実施）
- `Carer` 型に `repeatRateBase: number | null` を追加
- 閾値 `REPEAT_RATE_MIN_BASE = 5`。5件未満は率を非表示
- `RepeatRateBadge` コンポーネントを実装（`compact` prop で切替）
- ビルド成功・lint エラーなし
