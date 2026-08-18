---
id: PM-RM-P0-005
title: プロトタイプに資格表示・登録番号フィールドを追加する
status: done
sub_status: null
owner: A06
priority: P1
epic: P0
due: 2026-06-30
dependencies: [PM-RM-P0-004]
created: 2026-05-31
---

# PM-RM-P0-005: プロトタイプに資格表示・登録番号フィールドを追加する

## 目的
ケアラープロフィールに資格名・動物取扱業登録番号・登録種別を表示し、飼い主が有資格者かどうかをプロフィール上で判断できるようにする。

## Subtasks
- [x] ケアラープロフィールの現行データ構造を確認する
- [x] 資格名フィールドを追加する（`certs[]` を「保有資格」ラベル付きで表示）
- [x] 動物取扱業登録番号フィールドを追加する
- [x] 登録種別フィールドを追加する
- [x] 登録番号の表示位置をプロフィールUIに追加する
- [x] 有資格バッジの表示仕様を整理する（`license.verified = true` → 緑「✓ 確認済み」バッジ）
- [x] サンプルデータを更新する
- [x] 画面表示を確認する（`npm run build` 成功 / lint エラーなし）

## Acceptance Criteria
- [x] ケアラープロフィール上で資格名と登録番号が確認できる
- [x] 飼い主が「有資格者であること」をプロフィール上で判断できる

## 完了メモ（2026-06-02 A06実施）
- `CarerCard`・`CarerDetailPage`・`CarerProfilePage`・管理画面審査パネルを改修
- `styles.css` に `.verified-badge`, `.pending-badge`, `.certs-section` 等を追加
- ビルド成功・lint エラーなし
