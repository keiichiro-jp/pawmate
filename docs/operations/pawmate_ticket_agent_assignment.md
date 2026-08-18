# PawMate チケット担当エージェント割り振り表
くじら舎 ／ v1.0 ／ 2026.05.31

Source:
- `pawmate_tickets.md`
- `pawmate_agent_team.md`
- `pawmate_daily_calendar_fast.md`
- `pawmate_agent_output_test_report.md`

---

## 運用方針

| 役割 | 意味 |
|---|---|
| Primary | そのチケットを前に進める主担当。成果物ドラフトを作る |
| Secondary | 主担当を補助する専門エージェント |
| Review | 外部送信・法務・保険・決済・事故・個人情報・Gate前のレビュー担当 |
| Coordinator | 日次5チケットへの割り振り、Status更新、Handoff管理 |

基本ルール:
- A01 Chief of Staff が毎朝5チケットを読み、Primaryへ割り振る
- 専門エージェントは担当外チケットを抱え込まず、A01へHandoffする
- 外部送信前、Gate前、リリース前はA12 Risk Reviewを通す
- 法務・行政はA03、保険・事故はA04、実装はA05/A06、運用はA07、集客はA08、KPIはA09/A18を基本線にする

---

## Agent Legend

| Code | Agent |
|---|---|
| A01 | Chief of Staff Agent |
| A02 | Partnership & Caregiver Agent |
| A03 | Legal & Compliance Agent |
| A04 | Trust & Insurance Agent |
| A05 | Product Manager Agent |
| A06 | Vibe Engineering Agent |
| A07 | Operations & CS Agent |
| A08 | Growth Marketing Agent |
| A09 | Finance & KPI Agent |
| A10 | Research & Intelligence Agent |
| A11 | Documentation Agent |
| A12 | Risk Review Agent |
| A13 | Area Expansion Agent |
| A14 | Caregiver Community Agent |
| A15 | SEO Content Agent |
| A16 | Enterprise Sales Agent |
| A17 | Fundraising Agent |
| A18 | Data Analyst Agent |

---

## Phase 0 Assignments

| Ticket | Title | Primary | Secondary | Review | Notes |
|---|---|---|---|---|---|
| PM-RM-P0-001 | チカ先生にアポを取る | A02 | A11 | A12 | 外部送信前に文面レビュー |
| PM-RM-P0-002 | チカ先生と面談し、協力可否を確認する | A02 | A11, A04 | A12 | 保管業・報酬・動機確認を分ける |
| PM-RM-P0-003 | Hey!Dogsへ協力可能性を打診する | A02 | A08, A11 | A12 | 打診文面は関係性重視 |
| PM-RM-P0-004 | 神奈川県動物愛護センターへ事前相談する | A03 | A10, A11 | A12 | 法的助言ではなく行政確認の論点整理 |
| PM-RM-P0-005 | プロトタイプに資格表示・登録番号フィールドを追加する | A06 | A05, A03 | A12 | 行政確認前は文言を断定しない |
| PM-RM-P0-006 | 損保会社へ保険スキームを相談する | A04 | A10, A11 | A12 | 補償可否は保険会社回答待ち |
| PM-RM-P0-GATE | フェーズ0完了判定 | A01 | A03, A04, A09 | A12 | GO/NO-GOはKei最終判断 |

---

## Phase 1 Assignments

| Ticket | Title | Primary | Secondary | Review | Notes |
|---|---|---|---|---|---|
| PM-RM-P1-001 | 有資格ケアラー5〜10人を確保する | A02 | A08, A11 | A12 | 供給側の最重要チケット |
| PM-RM-P1-002 | ケアラーの保管業登録状況を確認・支援する | A03 | A02, A10 | A12 | 登録状況の事実確認を厳密に |
| PM-RM-P1-003 | ケアラープロフィール作成・撮影を支援する | A02 | A05, A08, A11 | A12 | 表示情報と信頼表現に注意 |
| PM-RM-P1-004 | 最初の1件を一緒に成功させる | A07 | A02, A05, A08, A11 | A12 | 初回取引の総合オペレーション |
| PM-RM-P1-005 | 近隣ペット飼育者へ直接声がけする | A08 | A11 | A12 | 過度な勧誘を避ける |
| PM-RM-P1-006 | チカ先生の既存顧客へ案内する | A08 | A02, A11 | A12 | チカ先生の関係性を最優先 |
| PM-RM-P1-007 | 広告を使わず口コミで最初の30人を作る | A08 | A11, A09 | A12 | 実績の先取り表現は禁止 |
| PM-RM-P1-008 | 報告カード機能を実装する | A06 | A05, A07 | A12 | GPS・写真・個人情報に注意 |
| PM-RM-P1-009 | リピート率表示をプロフィールに追加する | A05 | A06, A09, A18 | A12 | データ不足時の誤認表示を避ける |
| PM-RM-P1-010 | Meet & Greet予約フローを実装する | A05 | A06, A07 | A12 | 初回前の信頼形成が目的 |
| PM-RM-P1-011 | Stripe Connect本番環境を構築する | A06 | A05, A09, A10 | A12 | 決済・返金・分配はレビュー必須 |
| PM-RM-P1-012 | 初回トラブル対応フローを文書化する | A07 | A03, A04, A11 | A12 | 事故・鍵・キャンセルを分ける |
| PM-RM-P1-013 | ケアラー向けマニュアルを作成する | A07 | A11, A04 | A12 | 緊急時対応を曖昧にしない |
| PM-RM-P1-GATE | フェーズ1完了判定 | A01 | A09, A18, A07, A08 | A12 | KPI実績なしで通過宣言しない |

---

## Phase 2 Assignments

| Ticket | Title | Primary | Secondary | Review | Notes |
|---|---|---|---|---|---|
| PM-RM-P2-001 | ケアラー20人体制へ拡張する | A02 | A14, A09 | A12 | 品質を犠牲にしない |
| PM-RM-P2-002 | Hey!Dogs卒業生へリーチする | A02 | A08, A11 | A12 | 卒業生紹介可否は確認待ち |
| PM-RM-P2-003 | ケアラー向け月次勉強会を開催する | A14 | A07, A11, A04 | A12 | 事故予防・品質向上を中心に |
| PM-RM-P2-004 | 湘南エリア限定Instagram広告を開始する | A08 | A09, A11 | A12 | P1 Gate達成後。広告表現レビュー |
| PM-RM-P2-005 | 地域店舗・施設との提携を開拓する | A08 | A10, A11 | A12 | 店舗情報・提携条件は未確認扱い |
| PM-RM-P2-006 | 紹介コードを導入する | A06 | A05, A08, A09 | A12 | 不正利用・割引会計を確認 |
| PM-RM-P2-007 | 猫のシッティング需要を本格的に取り込む | A08 | A02, A05, A14 | A12 | 猫対応スキル表示と品質に注意 |
| PM-RM-P2-008 | 複数頭割引を実装する | A06 | A05, A09 | A12 | 決済額・ケアラー報酬へ反映 |
| PM-RM-P2-009 | 定期契約フローβ版を実装する | A05 | A06, A09, A07 | A12 | 解約・変更・決済タイミングを明確化 |
| PM-RM-P2-010 | キャットシッター専門スキルをプロフィールに追加する | A05 | A06, A08, A14 | A12 | スキル誇張を避ける |
| PM-RM-P2-011 | レビュー・評価システムを本格稼働する | A05 | A06, A07, A18 | A12 | 名誉毀損・不適切レビュー対策 |
| PM-RM-P2-012 | カスタマーサポート体制を平日毎日へ移行する | A07 | A11, A09 | A12 | エスカレーション基準が必要 |
| PM-RM-P2-013 | 保険スキームを正式契約・適用開始する | A04 | A03, A10, A11 | A12 | 契約・補償範囲は専門確認 |
| PM-RM-P2-GATE | フェーズ2完了判定 | A01 | A09, A18, A02, A07 | A12 | GMV・リピート・手取りを実績で判定 |

---

## Phase 3 Assignments

| Ticket | Title | Primary | Secondary | Review | Notes |
|---|---|---|---|---|---|
| PM-RM-P3-001 | 湘南5市へのエリア展開計画を実行する | A13 | A02, A08, A09 | A12 | P2 Gate未達なら計画まで |
| PM-RM-P3-002 | ケアラー50人体制を構築する | A02 | A13, A14, A09 | A12 | エリア別供給偏りを管理 |
| PM-RM-P3-003 | トップケアラー制度を導入する | A14 | A05, A18, A07 | A12 | 評価・リピート率の扱いに注意 |
| PM-RM-P3-004 | ケアラー向けアプリ機能を強化する | A05 | A06, A07, A14 | A12 | 予定・収入管理が中心 |
| PM-RM-P3-005 | 飼い主向けサブスクリプションを本格展開する | A05 | A06, A08, A09 | A12 | 継続課金・解約フロー要レビュー |
| PM-RM-P3-006 | 法人向けプランを検討する | A16 | A08, A09, A11 | A12 | 需要仮説検証まで。契約確定扱いしない |
| PM-RM-P3-007 | 湘南ペット情報メディアとしてSEOコンテンツを開始する | A15 | A08, A10, A11 | A12 | 医療・行政・施設情報は一次確認 |
| PM-RM-P3-008 | スマートロック連携β版を実装する | A06 | A05, A04, A10 | A12 | セキュリティ・鍵管理を重点レビュー |
| PM-RM-P3-009 | AIマッチングを実装する | A05 | A06, A18, A07 | A12 | バイアス・説明可能性を確認 |
| PM-RM-P3-010 | 定期契約を本格展開する | A05 | A06, A07, A09 | A12 | βの課題整理後に本格化 |
| PM-RM-P3-011 | 資金調達または自己資本継続の判断材料を整理する | A17 | A09, A18, A11 | A12 | 投資助言ではなく判断材料 |
| PM-RM-P3-GATE | フェーズ3完了判定 | A01 | A09, A18, A13, A17 | A12 | P4評価へ進むか判定 |

---

## Phase 4 Assignments

| Ticket | Title | Primary | Secondary | Review | Notes |
|---|---|---|---|---|---|
| PM-RM-P4-001 | 神奈川全域展開を評価する | A13 | A10, A09, A18 | A12 | 展開可否は供給ネットワーク条件次第 |
| PM-RM-P4-002 | ペットゴーとの提携交渉を評価する | A10 | A08, A17, A11 | A12 | 提携条件・ブランド毀損に注意 |
| PM-RM-P4-003 | フランチャイズ化を評価する | A13 | A07, A14, A09 | A12 | 標準化・品質管理が前提 |
| PM-RM-P4-004 | 資金調達・スタートアップ化を評価する | A17 | A09, A18, A11 | A12 | Unit Economicsが前提 |
| PM-RM-P4-GATE | フェーズ4方針決定 | A01 | A09, A17, A18, A13 | A12 | Keiが次の山を1つ選ぶ |

---

## Immediate Action Assignments

| Ticket | Title | Primary | Secondary | Review | Notes |
|---|---|---|---|---|---|
| PM-RM-NOW-001 | チカ先生にLINEを送る | A02 | A11 | A12 | P0-001へ接続 |
| PM-RM-NOW-002 | 神奈川県動物愛護センターの事前相談手順を確認する | A10 | A03, A11 | A12 | P0-004へ接続。最新情報確認 |
| PM-RM-NOW-003 | Stripe Connectの実装コストを把握する | A10 | A06, A09 | A12 | P1-011へ接続。公式情報確認 |
| PM-RM-NOW-004 | 損保ジャパンのペット保険担当に問い合わせる | A04 | A10, A11 | A12 | P0-006へ接続 |

---

## Daily Calendar Routing

高速日次カレンダーの1行を処理するときは、次の順で割り振る。

1. A01が当日の5チケットを読む
2. この割り振り表からPrimaryを特定する
3. Primaryが成果物ドラフトを作る
4. Secondaryが必要な論点・資料・実装補助を出す
5. Reviewが必要な場合、A12へ回す
6. A01がDone / Waiting / Blocked候補をまとめる
7. Keiが外部送信・Gate・重要判断を決める

### 2026-06-01 Example

| Ticket | Primary | Secondary | Review | Expected Status Movement |
|---|---|---|---|---|
| PM-RM-P0-001 | A02 | A11 | A12 | 文面承認後、Kei送信でWaiting |
| PM-RM-P0-002 | A02 | A11, A04 | A12 | 面談アジェンダDone、日程確定待ち |
| PM-RM-P0-003 | A02 | A08, A11 | A12 | 打診文面承認後、Kei送信でWaiting |
| PM-RM-P0-004 | A03 | A10, A11 | A12 | 行政窓口確認・相談依頼でWaiting |
| PM-RM-P0-006 | A04 | A10, A11 | A12 | 保険相談先確認・問い合わせでWaiting |

---

## Workload View

| Agent | Main Load |
|---|---|
| A01 | Gate、日次割り振り、Status更新 |
| A02 | ケアラー供給、チカ先生、Hey!Dogs |
| A03 | 行政、法務、登録要件 |
| A04 | 保険、審査、事故、安全 |
| A05 | 仕様、MVP、体験設計 |
| A06 | 実装、決済、連携 |
| A07 | 初回取引、CS、マニュアル |
| A08 | 需要獲得、口コミ、広告、提携 |
| A09 | GMV、収益、Unit Economics |
| A10 | 外部調査、一次情報確認 |
| A11 | 文書化、議事録、手順書 |
| A12 | リスクレビュー |
| A13 | エリア展開 |
| A14 | ケアラーコミュニティ |
| A15 | SEOコンテンツ |
| A16 | 法人営業 |
| A17 | 資金調達判断材料 |
| A18 | データ分析、Gate判定表 |

