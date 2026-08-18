---
id: PM-RM-P1-011
title: Stripe Connect本番環境を構築する
status: in-progress
sub_status: waiting
owner: A06
priority: P0
epic: P1
due: 2026-09-30
dependencies: [PM-RM-P0-006]
created: 2026-05-31
---

# PM-RM-P1-011: Stripe Connect本番環境を構築する

## 状態メモ（waiting）
PM-RM-P0-006（保険スキーム相談）の完了待ち。完了次第 Stripe 本番アカウント開設・テスト決済へ進む。
プロトタイプ実装は完了済み。

## 目的
飼い主→PawMate→ケアラーへの決済・分配フローを本番環境で稼働させる。

## Subtasks
- [x] Stripe Connectの実装方式を確認する（Express タイプ。ケアラー自身がオンボーディング）
- [x] エスクロー相当の運用可否を確認する（Separate Charges + Transfers + manual capture で代替）
- [x] 手数料25%の分配設計を整理する（飼い主側7% / PF手数料25% / ケアラー75%）
- [x] ケアラー入金フローを設計する（完了後{holdDays}営業日で自動振込）
- [x] 返金・キャンセル時の処理を設計する（48h前:全額 / 24h前:50% / 当日:0%）
- [x] Connectアカウント登録フローをプロトタイプ実装する
- [x] 決済処理をプロトタイプ実装する
- [x] 売上分配処理をプロトタイプ実装する
- [ ] Stripe本番アカウントを準備する（PM-RM-P0-006 完了後に実施）
- [ ] テスト決済を実施する
- [ ] 本番決済の運用手順を文書化する

## Acceptance Criteria
- [x] 飼い主が決済できる（プロトタイプ UI 実装済み）
- [x] ケアラーへの分配とPawMate手数料が処理できる（設計確定・サンプルデータ実装済み）
- [x] 返金・キャンセル時の対応方針が明確である
- [ ] 本番決済が通る

## 完了メモ（2026-06-02 A06実施 プロトタイプ実装分）
- `PaymentsPage`（`/payments`）を新設: 概要タブ / Connect アカウントタブ / 決済履歴タブ
- ビルド成功・lint エラーなし
