# Skill: God Agent Loop — Sub-ticket Template

Sub-ticket は Ticket の中で独立して実行できる作業単位。
Notion には登録しない（god-agent-loop 内部の実行管理のみ）。

ファイル名: `<PROJ>-T-NNN-S-NN-<slug>.md`
配置先: 親チケットと同じフォルダ（`tickets/todo/`, `tickets/in-progress/` 等）

---

```markdown
---
id: <PROJ>-T-NNN-S-NN
parent: <PROJ>-T-NNN             # 必須。親チケット ID
title: <この Sub-ticket の成果物で書く>
owner: <researcher|designer|coder|analyst|writer>-agent
estimate: <S=1h以下 | M=半日>    # Sub-ticket は最大 M まで。L になるなら Ticket に昇格
status: todo                     # todo | in-progress | review | done
created: YYYY-MM-DD
---

# <PROJ>-T-NNN-S-NN: <タイトル>

> 親チケット: [<PROJ>-T-NNN](../<PROJ>-T-NNN-<slug>.md)

## やること

<何をするか。1〜3行で。>

## 完了条件

- [ ] <条件1>
- [ ] <条件2>

## 成果物

- **保存先**: `workspace/outputs/<PROJ>-T-NNN/<filename>.<ext>`
  （親チケットの outputs フォルダに保存する）

## 実行ログ

<!-- エージェントが実行後にここに追記する -->

### <YYYY-MM-DD> <agent名>
- 実施内容:
- 結果:
```

---

## Sub-ticket の使い方

### 切り出すタイミング
- 親 Ticket のスコープを整理したとき、並列実行できる作業を発見した場合
- 担当エージェントが複数にまたがる場合
- 1つの作業が半日を超える見込みになった場合

### ライフサイクル
```
親チケット todo  →  Sub-ticket × N を作成  →  各 Sub を実行  →  全 Sub done  →  親チケット review
```

### 親チケットとの関係
- Sub-ticket は親チケットの `作業スコープ` のチェックアイテムに対応する
- 全 Sub-ticket が `done` になったら、親チケットを `review` に移動する
- Notion のチケットは親チケットのみ更新する（Sub-ticket は Notion に登録不要）

### estimate の上限
- Sub-ticket は `S（1h以下）` または `M（半日）` まで
- `L（1日）` になりそうなら Ticket として独立させて Notion に登録する
