# PawMate

湘南エリアの飼い主と有資格プロのケアラーをつなぐ、信頼可視化型ペットケアサービスのプロトタイプです。**犬も猫も、初日から。**（2026年8月に猫ファースト戦略へ全面改訂 — キャットシッターを第一級サービスとして扱います）

## ローカル起動

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## 現在の範囲

- Vite + React + TypeScript の静的プロトタイプ
- LP、ケアラー検索（対応ペット種別フィルタ付き）、依頼掲示板、登録、マイペット（犬・猫・小動物）、予約、メッセージ、管理者審査のデモ画面
- キャットシッターのサービスカテゴリと猫専門ケアラーのプロフィール表現
- 本番DB、実認証、Stripe Connect、eKYCは未実装
- `pawmate-full.html` は移植元の参照ファイルとして保持

## ドキュメント索引

**数値・定義の正典は `pawmate_premises.md`。** 各ドキュメントの記載が食い違う場合は premises が優先されます。歴史的記録（下記「記録・調査（改変しない）」）に現れる旧数値は premises §12 の対照表で読み替えてください。

### 正典・前提

| ドキュメント | 内容 |
|---|---|
| `pawmate_premises.md` | 共通前提シート（サービス・価格・ミックス・エリア・市場データ・ペルソナの単一の真実源） |
| `pawmate_competitor_landscape.md` | 犬猫横断の競合分析（湘南実在競合・全国系・出典URL付き） |

### 中核戦略

| ドキュメント | 内容 |
|---|---|
| `pawmate_business_plan.md` | 事業計画マスター（差別化・TAM/SAM/SOM・GO/NO-GO） |
| `pawmate_stp.md` | セグメンテーション・ターゲティング・ポジショニング |
| `pawmate_4p.md` | マーケティングミックス（4サービス・料金・チャネル・プロモーション） |
| `pawmate_unit_economics.md` | LTV/CAC・回収期間・ケアラー経済性・感度分析 |
| `pawmate_finance.md` | 資金計画・フェーズ別P&L（**P&Lの正典**）・CF計画 |
| `pawmate_persona_estimate.md` | ペルソナ人数のファネル推計（湘南4市） |
| `pawmate_how_to_win.md` | 勝ち筋（Where to Play / How to Win） |
| `pawmate_mvv.md` | ミッション・ビジョン・バリュー |
| `pawmate_brand.md` | ブランド設計（約束・トーン・カラー） |
| `pawmate_roadmap.md` | フェーズ0〜4ロードマップ（猫はフェーズ1スコープ） |

### 顧客・体験設計

| ドキュメント | 内容 |
|---|---|
| `pawmate_jtbd.md` | JTBD/Pains/Gains（犬・猫の飼い主＋ケアラー） |
| `pawmate_cjm.md` | カスタマージャーニー（犬: 田中美咲／猫: 石井さやか／ケアラー） |
| `pawmate_service_blueprint.md` | サービスブループリント（犬版＋キャットシッター版） |

### リスク・法務・保険

| ドキュメント | 内容 |
|---|---|
| `pawmate_risk.md` | リスク登録簿（猫固有リスク・季節集中を含む） |
| `pawmate_insurance_scheme.md` | 保険・補償の3層スキームと保険会社への照会事項 |
| `pawmate_animal_handling_scheme.md` | 第一種動物取扱業の法的スキーム整理 |

### 営業資料・実行

| ドキュメント | 内容 |
|---|---|
| `pawmate_trainer_proposal.md` | ドッグトレーナー向け勧誘1枚もの（散歩¥3,000ベース） |
| `pawmate_cat_sitter_proposal.md` | キャットシッター向け勧誘1枚もの（¥4,000ベース・組織化提案） |
| `pawmate_sony_startup_template_draft.md` | Sony Startup Acceleration Program 提出ドラフト（外部向け集約） |
| `pawmate_tickets.md` | チケット台帳（Epic CATに猫改修チケット） |
| `pawmate_ticket_agent_assignment.md` | チケット→エージェント割当 |
| `pawmate_daily_calendar.md` / `pawmate_daily_calendar_fast.md` | 日次実行カレンダー |
| `pawmate_capabilities.md` | 創業者ケイパビリティ分析 |
| `pawmate_agent_team.md` / `agents/` / `afos/` | AI運用エージェント定義 |

### 記録・調査（改変しない）

| ドキュメント | 内容 |
|---|---|
| `petcare_research_brief.md` / `petcare_research_report.md` | 初期リサーチ（一部数値は旧推計 — premises §12参照） |
| `pawmate_usa_research.md` | Rover/Wagティアダウンと日本ローカライズ原則 |
| `pawmate_cowork_run_2026-06-0*.md` | 日付付きcowork実行記録 |
| `pawmate_daily_output_0601_0602.md` | 実行記録（旧手数料モデルの記載あり — premises §12参照） |
| `pawmate_agent_output_test_report.md` | エージェント出力テスト報告 |
