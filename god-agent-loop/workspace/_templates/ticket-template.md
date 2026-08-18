# Skill: God Agent Loop — Ticket Template

god-agent-loop の **Ticket** は、1エージェントが 1セッション以内に完了できる実行単位。
明確な成果物・完了条件・担当エージェントを持つ。

このテンプレを `god-agent-loop/workspace/tickets/todo/<PROJ>-T-NNN-<slug>.md` としてコピーして使う。

---

```markdown
---
id: <PROJ>-T-NNN
title: <成果物で書く。「〜を調査する」より「〜の調査レポートを作成する」>
milestone: <M1 | M2 | M3 ...>   # 紐づく Milestone ID
priority: <P0 | P1 | P2>
status: todo                     # todo | in-progress | review | done
owner: <researcher|designer|coder|analyst|writer>-agent
estimate: <S=1h以下 | M=半日 | L=1日 | XL=要分割>
depends_on: []                   # 依存チケット ID のリスト。なければ []
created: YYYY-MM-DD
notion_ticket: <Notion チケット URL>   # Notion と連動している場合
---

# <PROJ>-T-NNN: <タイトル>

## 目的

<この Ticket を完了させると何が実現するか。Milestone のどの完了条件に貢献するか。2〜4行。>

## 背景

<必要な前提情報。参照すべきドキュメント・過去の決定・外部仕様。>

## 成果物（Deliverable）

- **形式**: <MarkDown / コード / HTML / JSON / etc.>
- **保存先**: `workspace/outputs/<PROJ>-T-NNN/<filename>.<ext>`

## 完了条件（Done Conditions）

完了とみなすためにすべて満たすべき条件。

- [ ] <検証可能な条件1>
- [ ] <検証可能な条件2>
- [ ] <検証可能な条件3>

## 作業スコープ

実行する作業のチェックリスト。

- [ ] <手順1>
- [ ] <手順2>
- [ ] <手順3>

## 対象外（Out of Scope）

<この Ticket で扱わないことを明示する。>

## 実行ログ

<!-- エージェントが実行後にここに追記する -->

### <YYYY-MM-DD> <agent名>
- 実施内容:
- 結果:
- 次アクション:
```

---

## Sub-ticket の切り出し基準

以下に当てはまる場合は Sub-ticket に分割すること:
- 担当エージェントが異なる作業が混在している
- estimate が `XL`（1日超）になる
- 並列実行できる独立した作業が2つ以上ある

Sub-ticket のファイル名: `<PROJ>-T-NNN-S-NN-<slug>.md`（例: `WLD-T-003-S-01-api-research.md`）
詳細は `subticket-template.md` を参照。

## ファイル命名規則

| prefix | プロジェクト |
|---|---|
| `WLD` | World Life Daily |
| `HWS` | HumanWork Station |
| `MOSO` | 妄想エージェント（mosoagent） |
| `UCM` | うちのこ物語（kujirasha） |
| `PAW` | PawMate |
| `PTZ` | Petzine |
| `PIL` | Pilates App |
| `RYO` | 良国 |
| `NTI` | NTI |
