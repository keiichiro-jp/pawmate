# PawMate チケット管理

## 担当者（必須）

| 操作 | 担当 |
|---|---|
| `todo/` ↔ `in-progress/` ↔ `done/` への**ファイル移動** | **secretary（秘書）のみ** |
| frontmatter の `status` / `sub_status` の更新（移動に伴う） | **secretary（秘書）のみ** |
| チケット本文の Subtasks・メモ・進捗の更新 | 担当 `owner`（Kei / A06 等）または実行エージェント |
| 新規チケットの作成・Epic 再編・archive 退避 | **secretary（秘書）のみ** |

**サブエージェント・担当 owner はフォルダを動かさない。** 着手・完了・待ち・ブロックの報告は秘書へ渡し、秘書がライフサイクルを反映する。

運用の詳細: `agents/secretary/skills/pawmate-roadmap-tickets.md`

## フォルダ構造

```
tickets/
  in-progress/   ← 着手中・進行中
  todo/          ← 未着手（バックログ含む）
  done/          ← 完了
  archive/       ← 旧形式の退避先
```

## ファイル命名規則

`<ID>-<slug>.md`

例: `PM-RM-P0-001-chika-apo.md`

ID体系: `PM-RM-<Epic>-<番号>` または `PM-RM-<Epic>-GATE`

## Frontmatter フィールド

```yaml
---
id: PM-RM-P0-001
title: チカ先生にアポを取る
status: todo | in-progress | done
sub_status: null | doing | waiting | ready | blocked   # in-progress 時のみ有効
owner: Kei | A06 | A08 | ...
priority: P0 | P1 | P2 | P3
epic: P0 | P1 | P2 | P3 | P4 | NOW
due: 2026-06-30
dependencies: [PM-RM-P0-001]
created: 2026-05-31
---
```

## sub_status の意味

| sub_status | 意味 | 典型的な状態 |
|---|---|---|
| `doing` | 鋭意作業中 | エージェントまたは Kei が積極的に進めている |
| `waiting` | 外部返信・承認待ち | メール送信済み・面談待ち・返信待ち |
| `ready` | 準備完了・条件待ち | 資料・文面が揃っており、ゲート通過後に即実行できる |
| `blocked` | ブロック中 | 解決が必要な依存関係がある |

## Epic 体系

| Epic | 期間 | 概要 |
|---|---|---|
| P0 | 〜2026年6月末 | 動かす前に確認する（法的・供給・保険） |
| P1 | 2026年7〜9月 | 最初の取引を作る |
| P2 | 2026年10〜12月 | 茅ヶ崎を制圧する |
| P3 | 2027年1〜6月 | 湘南5市へ拡大 |
| P4 | 2027年7月〜 | 神奈川全域・次の一手 |
| NOW | 即時 | すぐ動けるアクション（本チケットに紐づく） |

## チケット移動ルール（secretary が実行）

1. 作業開始時: `todo/` → `in-progress/` に移動、`status: in-progress` + `sub_status` を更新
2. 外部待ちになったとき: `sub_status: waiting` に更新（フォルダは `in-progress/` のまま）
3. 準備完了・ゲート待ち: `sub_status: ready` に更新（フォルダは `in-progress/` のまま）
4. 完了時: `in-progress/` または `todo/` → `done/` に移動、`status: done`・`sub_status: null` に更新
5. 再構成時の旧チケット: 削除せず `archive/<YYYYMMDD>-<reason>/` に退避

> `workspace/tickets/`（Techo-Group 横断チケット）のライフサイクルとは別系統。PawMate ロードマップチケット（`PM-RM-*`）は本ディレクトリのみを対象とする。

## 旧ファイルについて

`archive/20260603-single-file/pawmate_tickets.md` に退避済み。
