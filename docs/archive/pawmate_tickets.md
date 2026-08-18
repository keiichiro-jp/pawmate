# PawMate チケット台帳 → 移行済み

> **このファイルは 2026-06-03 に廃止されました。**
>
> チケット管理は `pawmate/tickets/` に移行しています。

## 新しいチケット置き場

```
pawmate/tickets/
  in-progress/   ← 着手中・進行中（sub_status: doing / waiting / ready / blocked）
  todo/          ← 未着手バックログ
  done/          ← 完了済み
  archive/       ← 旧形式・退避済みファイル
```

詳細は [`pawmate/tickets/README.md`](tickets/README.md) を参照。

**チケットのフォルダ移動（todo / in-progress / done）は secretary（秘書）が担当する。** 担当エージェントは進捗を報告し、秘書がライフサイクルを反映する。

## 旧ファイルのアーカイブ先

`pawmate/tickets/archive/20260603-single-file/pawmate_tickets.md`
