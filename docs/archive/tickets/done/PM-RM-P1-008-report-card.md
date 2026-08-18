---
id: PM-RM-P1-008
title: 報告カード機能を実装する
status: done
sub_status: null
owner: A06
priority: P0
epic: P1
due: 2026-09-30
dependencies: [PM-RM-P0-005]
created: 2026-05-31
---

# PM-RM-P1-008: 報告カード機能を実装する

## 目的
ケアラーがケア実施後にGPSと写真付きの報告カードを送れるようにし、飼い主が安心して確認できる仕組みを作る。

## Subtasks
- [x] 報告カードの入力項目を定義する（気分・状態 / 食事 / 排泄 / ケアメモ / 注意事項）
- [x] GPS記録の要件を定義する（緯度経度＋ルートラベル。本番は Mapbox/Google Maps 連携想定）
- [x] 写真添付の要件を定義する（複数枚・キャプション付き）
- [x] ケアラー入力画面を設計する（`ReportCardSubmitPage`）
- [x] 飼い主向け閲覧画面を設計する（`ReportCardViewPage`）
- [x] 報告カード保存処理を実装する
- [x] 写真アップロード処理を実装する（プロトタイプ: トグルでシミュレーション）
- [x] GPS情報の保存・表示を実装する（プロトタイプ: 座標プレースホルダー）
- [x] 報告カード送信通知を実装する
- [ ] 初回取引で利用テストする（Phase 1 実取引時に実施）

## Acceptance Criteria
- [x] ケアラーがケア実施後にGPSと写真付きの報告カードを送れる
- [x] 飼い主が報告カードを確認できる

## 完了メモ（2026-06-02 A06実施）
- `pawmateData.ts` に `ReportCard` 型・`reportCards[]` サンプルデータを追加
- `ReportCardViewPage`・`ReportCardSubmitPage` を実装
- 予約管理ページから「報告カードを見る」ボタンで遷移可能に
- `styles.css` に約200行の報告カード専用スタイルを追加
- ビルド成功・lint エラーなし
