# God Agent Loop — PawMate

## ミッション

湘南エリアの飼い主と有資格プロのケアラーをつなぐ、信頼可視化型ペットケアサービスを構築する。
マッチングの精度と信頼スコアの透明性で、既存サービスにはない安心感を提供する。

## ループの動き方

Notion チケット管理 DB を Single Source of Truth として動く。

```
Notion(todo) → Notion(in-progress) → 実行 → Notion(done)
```

1. Notion チケット管理 DB から `Project = PawMate` かつ `Status = todo` のチケットを取得
2. `Priority: P0 → P1 → P2` の順に選ぶ
3. Notion のステータスを `in-progress` に更新
4. チケットの `owner` に対応するエージェントの `workspace/agents/<name>/SKILL.md` を読む
5. チケットの Done Conditions・作業内容に従って実行
6. 成果物を `workspace/outputs/<ticket-id>/` に保存
7. Notion のステータスを `done` に更新・成果物パスを記入
8. 次のチケットへ — トークンが尽きるまで繰り返す

## Notion の操作

```
# todo チケットを取得（PawMate）
notion-search: "todo" in チケット管理 DB → Project = PawMate でフィルタ

# ステータスを in-progress に更新
notion-update-page: { Status: "in-progress" }

# 実行完了時
notion-update-page: { Status: "done", 成果物: "workspace/outputs/PAW-T-NNN/" }
```

Notion チケット管理 DB: https://app.notion.com/p/b50d10a1d86a4db7b46e6892e9c15c45

## 優先度の定義

| レベル | 基準 |
|---|---|
| P0 | マッチングフロー・決済が止まる |
| P1 | ユーザー信頼・マッチング品質に直結 |
| P2 | あると良い・将来的な改善 |

## エージェントマップ

| agent | 得意領域 |
|---|---|
| researcher-agent | ペットケア市場・競合・資格制度・法規制調査 |
| designer-agent | UI/UX 設計・信頼スコア表示デザイン・マッチング画面 |
| coder-agent | React/TypeScript 実装・API 連携・決済フロー |
| analyst-agent | マッチング品質検証・ユーザーテスト評価 |
| writer-agent | LP コピー・ケアラー向けオンボーディング・利用規約草案 |

## プロジェクトパス

- PawMate 本体: `/Users/kei/Dev/Active Projects/pawmate/`
- このループ: `/Users/kei/Dev/Active Projects/pawmate/god-agent-loop/`
- チケット: `workspace/tickets/`
- 成果物: `workspace/outputs/`

## 絶対ルール

- チケット ID は `PAW-T-NNN` 形式
- 社長判断が必要な事項はチケットにコメントして `review/escalated/` で止める
- Notion チケット管理 DB と連動させる（完了時は Notion も更新）
- `README.md` のプロダクトビジョンとの整合性を保つ

## Sub-ticket の使い方

チケットが大きすぎる場合、または担当エージェントが複数にまたがる場合は Sub-ticket に分割する。

- ファイル名: `<PROJ>-T-NNN-S-NN-<slug>.md`（例: `HWS-T-003-S-01-line-api-research.md`）
- 配置先: 親チケットと同じフォルダ（`workspace/tickets/todo/` 等）
- Notion には登録しない（god-agent-loop 内部管理のみ）
- 全 Sub-ticket が `done` → 親チケットを `review` に移動
- テンプレート: `workspace/_templates/subticket-template.md`

## テンプレート

- チケット: `workspace/_templates/ticket-template.md`
- Sub-ticket: `workspace/_templates/subticket-template.md`
