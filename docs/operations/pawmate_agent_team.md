# PawMate エージェントチーム設計
くじら舎 ／ v1.0 ／ 2026.05.31

Source:
- `pawmate_capabilities.md`
- `pawmate_roadmap.md`
- `pawmate_tickets.md`
- `pawmate_daily_calendar_fast.md`

---

## 結論

PawMateには、秘書エージェント1人だけでは足りない。

理由:
- ロードマップが「事業開発」「プロダクト」「法務・行政」「保険」「供給獲得」「需要獲得」「CS」「財務」まで広い
- 1日5チケット運用にすると、進行管理だけでなく各領域の前捌きが必要になる
- 外部返信待ち、行政相談、保険相談、ケアラー打診、プロダクト実装が並列で走る
- Keiが全意思決定者であるほど、周辺の準備・調査・下書き・論点整理をエージェントに任せる価値が高い

したがって、PawMateは以下の **12エージェント体制** を基本にする。

---

## 組織図

```mermaid
flowchart TD
  CEO["Kei / Founder"]
  COS["Chief of Staff Agent<br/>進行管理・優先順位・Gate管理"]
  BD["Partnership & Caregiver Agent<br/>チカ先生・Hey!Dogs・ケアラー獲得"]
  LEGAL["Legal & Compliance Agent<br/>行政・動物取扱業・規約"]
  TRUST["Trust & Insurance Agent<br/>保険・審査・安全"]
  PROD["Product Manager Agent<br/>要件・体験・仕様"]
  ENG["Vibe Engineering Agent<br/>実装・検証・技術負債"]
  OPS["Operations & CS Agent<br/>運用・問い合わせ・トラブル"]
  MKT["Growth Marketing Agent<br/>口コミ・Instagram・SEO"]
  FIN["Finance & KPI Agent<br/>GMV・収益・Unit Economics"]
  RESEARCH["Research & Intelligence Agent<br/>競合・市場・提携先調査"]
  DOCS["Documentation Agent<br/>議事録・マニュアル・ナレッジ"]
  QA["Risk Review Agent<br/>事故・品質・Gate前レビュー"]

  CEO --> COS
  COS --> BD
  COS --> LEGAL
  COS --> TRUST
  COS --> PROD
  PROD --> ENG
  COS --> OPS
  COS --> MKT
  COS --> FIN
  COS --> RESEARCH
  COS --> DOCS
  COS --> QA
```

---

## Core Team｜毎日動かすエージェント

### A01｜Chief of Staff Agent

役割:
PawMate全体の秘書・PMO。日次5チケット運用、ブロッカー管理、Gate判定、Keiへの意思決定依頼を担う。

担当領域:
- `pawmate_daily_calendar_fast.md` の毎朝チェック
- `pawmate_tickets.md` のStatus更新案
- 1日5チケットの優先順位調整
- Waiting / Blocked / Done の棚卸し
- Gate条件との差分管理

見るべきチケット:
- PM-RM-P0-GATE
- PM-RM-P1-GATE
- PM-RM-P2-GATE
- PM-RM-P3-GATE
- PM-RM-P4-GATE

毎朝の出力:
- 今日の5チケット
- 今日の最小完了ライン
- Waitingへ送るもの
- Keiが判断すべきこと

起動頻度:
- 毎日 8:30
- 毎週金曜夕方に週次レビュー

---

### A02｜Partnership & Caregiver Agent

役割:
チカ先生、Hey!Dogs、初期ケアラー、将来のケアラー50人体制を担当する供給側エージェント。

担当領域:
- チカ先生へのアポ・面談設計
- Hey!Dogsへの打診
- 有資格ケアラー候補リスト作成
- 保管業登録状況の確認
- ケアラープロフィール作成支援
- 月次勉強会・トップケアラー制度

見るべきチケット:
- PM-RM-P0-001
- PM-RM-P0-002
- PM-RM-P0-003
- PM-RM-P1-001
- PM-RM-P1-002
- PM-RM-P1-003
- PM-RM-P2-001
- PM-RM-P2-002
- PM-RM-P2-003
- PM-RM-P3-002
- PM-RM-P3-003

標準成果物:
- 連絡文面
- 面談アジェンダ
- ケアラー候補管理表
- 登録状況チェックリスト
- ケアラー向け説明資料
- 勉強会アジェンダ

Keiへの確認事項:
- 誰にどの順で声をかけるか
- 報酬・手数料の説明トーン
- チカ先生との関係性を壊さない進め方

---

### A03｜Legal & Compliance Agent

役割:
動物愛護法、動物取扱業、行政相談、利用規約、プライバシーポリシーの論点を整理する。

担当領域:
- 神奈川県動物愛護センターへの事前相談準備
- 動物取扱業登録要件の確認
- プラットフォーム責任範囲の整理
- 行政書士・弁護士へ渡す論点整理
- 利用規約・プライバシーポリシーの叩き台

見るべきチケット:
- PM-RM-P0-004
- PM-RM-P1-002
- PM-RM-P1-012
- PM-RM-P2-013

標準成果物:
- 行政相談質問リスト
- 法的スキーム1枚紙
- 登録要件チェックリスト
- 規約論点メモ
- 専門家相談ブリーフ

注意:
- 最終判断は必ず専門家・行政確認に回す
- エージェントは法的助言ではなく、論点整理と下書きを担当する

---

### A04｜Trust & Insurance Agent

役割:
保険、審査、安全、事故対応、信頼インフラを担当する。

担当領域:
- 損保ジャパン・東京海上などへの保険相談準備
- 補償範囲・事故リスクの整理
- ケアラー審査フロー
- eKYC導入候補の整理
- 緊急時対応フロー
- 事故・ヒヤリハット管理

見るべきチケット:
- PM-RM-P0-006
- PM-RM-P1-002
- PM-RM-P1-012
- PM-RM-P2-013
- PM-RM-P3-008

標準成果物:
- 保険相談ブリーフ
- 補償範囲比較表
- 審査フロー
- 緊急時対応手順
- 事故報告テンプレート

Keiへの確認事項:
- どのリスクまでPawMateが負うか
- 保険料を誰が負担するか
- フェーズ1の暫定運用をどこまで許容するか

---

### A05｜Product Manager Agent

役割:
PawMateの体験設計、機能要件、優先順位、ユーザーフローを担当する。

担当領域:
- 資格表示・登録番号表示
- 報告カード
- リピート率表示
- Meet & Greet
- レビュー・評価
- 複数頭割引
- 定期契約
- ケアラー向けアプリ
- AIマッチング

見るべきチケット:
- PM-RM-P0-005
- PM-RM-P1-008
- PM-RM-P1-009
- PM-RM-P1-010
- PM-RM-P2-008
- PM-RM-P2-009
- PM-RM-P2-010
- PM-RM-P2-011
- PM-RM-P3-004
- PM-RM-P3-009
- PM-RM-P3-010

標準成果物:
- 機能要件メモ
- 画面フロー
- Acceptance Criteria
- MVP / Later の切り分け
- 実装順序案

Keiへの確認事項:
- 初回取引に必要な最小機能
- 安心感を作るために必要な表示
- 作り込みすぎを止める判断

---

### A06｜Vibe Engineering Agent

役割:
実装、コード確認、テスト、デモ確認を担当する開発エージェント。

担当領域:
- プロトタイプ改修
- データ構造更新
- UI実装
- Stripe Connect
- 報告カード
- Meet & Greet
- レビュー
- 紹介コード
- サブスク/定期契約
- 技術的リスク整理

見るべきチケット:
- PM-RM-P0-005
- PM-RM-P1-008
- PM-RM-P1-010
- PM-RM-P1-011
- PM-RM-P2-006
- PM-RM-P2-008
- PM-RM-P2-009
- PM-RM-P2-011
- PM-RM-P3-004
- PM-RM-P3-005
- PM-RM-P3-008
- PM-RM-P3-009
- PM-RM-P3-010

標準成果物:
- 実装PR相当の変更
- ローカル確認結果
- テスト結果
- 技術的未解決事項

注意:
- 実装前にProduct Manager Agentの要件を読む
- Stripeや保険・法務に関わる処理はLegal/Trust Agentの論点と合わせる

---

### A07｜Operations & CS Agent

役割:
予約運用、初回取引、問い合わせ、トラブル対応、ケアラーサポートを担当する。

担当領域:
- 初回取引の実行手順
- Meet & Greet運用
- 当日連絡体制
- ケアラー向けマニュアル
- CSテンプレート
- 平日毎日対応への移行
- 問い合わせカテゴリ管理

見るべきチケット:
- PM-RM-P1-004
- PM-RM-P1-012
- PM-RM-P1-013
- PM-RM-P2-003
- PM-RM-P2-012
- PM-RM-P3-004

標準成果物:
- 初回取引チェックリスト
- CS返信テンプレート
- トラブル対応フロー
- ケアラーマニュアル
- 運用ログ

Keiへの確認事項:
- 初回取引でどこまでKeiが伴走するか
- 事故・クレーム時のエスカレーション基準
- パート採用の発動条件

---

### A08｜Growth Marketing Agent

役割:
需要側の獲得、口コミ、Instagram、紹介コード、SEO、地域提携のマーケティングを担当する。

担当領域:
- 近隣ペット飼育者への声がけ
- チカ先生既存顧客への案内
- 口コミ設計
- Instagram広告
- 地域提携
- 紹介コード
- 猫シッティング需要
- SEOコンテンツ

見るべきチケット:
- PM-RM-P1-005
- PM-RM-P1-006
- PM-RM-P1-007
- PM-RM-P2-004
- PM-RM-P2-005
- PM-RM-P2-006
- PM-RM-P2-007
- PM-RM-P3-005
- PM-RM-P3-006
- PM-RM-P3-007

標準成果物:
- 声がけ文面
- 顧客案内文
- 口コミ依頼文
- 広告コピー
- 提携先リスト
- SEO記事企画
- チャネル別成果メモ

Keiへの確認事項:
- 最初に声をかける人の順番
- 広告開始のタイミング
- 地域でのブランドトーン

---

### A09｜Finance & KPI Agent

役割:
KPI、GMV、収益、手数料、Unit Economics、資金調達判断を担当する。

担当領域:
- 月間成約件数
- GMV
- デュアルフィー25%
- 月間収益
- リピート率
- ケアラー平均手取り
- 営業利益
- Unit Economics
- 調達/自己資本の比較

見るべきチケット:
- PM-RM-P1-GATE
- PM-RM-P2-GATE
- PM-RM-P3-GATE
- PM-RM-P3-011
- PM-RM-P4-004

標準成果物:
- KPIダッシュボード案
- 週次KPIレビュー
- Unit Economics更新
- Gate判定用数値表
- 調達判断メモ

Keiへの確認事項:
- 目標未達時に何を優先して直すか
- ケアラー報酬とPawMate収益のバランス
- 広告費・CS費・保険費をどこまで許容するか

---

## Specialist Team｜必要な時に呼ぶエージェント

### A10｜Research & Intelligence Agent

役割:
市場、競合、行政窓口、保険会社、提携先、スマートロック、法人候補などの調査を担当する。

担当領域:
- 神奈川県動物愛護センターの手続き確認
- 損保会社の問い合わせ先調査
- Stripe Connect調査
- Qrio Lock等のスマートロック調査
- DogHuggy / ペットゴー調査
- 横浜・川崎・相模原の市場調査

見るべきチケット:
- PM-RM-NOW-002
- PM-RM-NOW-003
- PM-RM-NOW-004
- PM-RM-P3-008
- PM-RM-P4-001
- PM-RM-P4-002

標準成果物:
- 調査メモ
- 比較表
- 問い合わせ先リスト
- 参考リンク一覧

注意:
- 最新情報が必要な調査は必ずWeb確認する

---

### A11｜Documentation Agent

役割:
議事録、マニュアル、提案書、説明資料、ナレッジの整備を担当する。

担当領域:
- チカ先生面談議事録
- 行政相談議事録
- 保険相談議事録
- ケアラー向けマニュアル
- トラブル対応フロー
- 勉強会資料
- 提携提案資料

見るべきチケット:
- PM-RM-P0-002
- PM-RM-P0-004
- PM-RM-P0-006
- PM-RM-P1-012
- PM-RM-P1-013
- PM-RM-P2-003
- PM-RM-P2-005

標準成果物:
- 議事メモ
- 手順書
- FAQ
- 提案資料の叩き台
- ナレッジ更新差分

---

### A12｜Risk Review Agent

役割:
Gate前、リリース前、外部送信前にリスクを洗い出すレビュー担当。

担当領域:
- 法務リスク
- 事故リスク
- 炎上リスク
- ケアラー品質リスク
- 個人情報リスク
- 決済/返金リスク
- 拡大しすぎリスク

見るべきチケット:
- すべてのGateチケット
- PM-RM-P0-004
- PM-RM-P0-006
- PM-RM-P1-011
- PM-RM-P1-012
- PM-RM-P2-013
- PM-RM-P3-008
- PM-RM-P4-GATE

標準成果物:
- リスクレビュー
- Go / No-Go判定メモ
- 未解決リスク一覧
- 最小対策案

---

## フェーズ別の最小エージェント構成

### フェーズ0

必須:
- A01 Chief of Staff Agent
- A02 Partnership & Caregiver Agent
- A03 Legal & Compliance Agent
- A04 Trust & Insurance Agent
- A05 Product Manager Agent
- A06 Vibe Engineering Agent
- A10 Research & Intelligence Agent
- A11 Documentation Agent
- A12 Risk Review Agent

まだ軽くてよい:
- A07 Operations & CS Agent
- A08 Growth Marketing Agent
- A09 Finance & KPI Agent

理由:
フェーズ0は「やる前に確認する」段階なので、行政・保険・供給パートナー・資格表示改修が中心。

### フェーズ1

必須:
- A01 Chief of Staff Agent
- A02 Partnership & Caregiver Agent
- A05 Product Manager Agent
- A06 Vibe Engineering Agent
- A07 Operations & CS Agent
- A08 Growth Marketing Agent
- A09 Finance & KPI Agent
- A12 Risk Review Agent

必要に応じて:
- A03 Legal & Compliance Agent
- A04 Trust & Insurance Agent
- A11 Documentation Agent

理由:
最初の1件を成立させるには、供給・需要・プロダクト・決済・運用が同時に動く。

### フェーズ2

必須:
- A01〜A12すべて

理由:
月500件、GMV200万円、ケアラー20人、広告、提携、CS、保険正式化が同時に走る。ここからは全員必要。

### フェーズ3以降

追加したいエージェント:
- Area Expansion Agent
- Caregiver Community Agent
- SEO Content Agent
- Enterprise Sales Agent
- Fundraising Agent
- Data Analyst Agent

理由:
湘南5市、法人、SEO、資金調達は専門化したほうが速い。

---

## 追加候補エージェント

### A13｜Area Expansion Agent

担当:
藤沢、鎌倉、平塚、辻堂への展開。

見るべきチケット:
- PM-RM-P3-001
- PM-RM-P3-002

### A14｜Caregiver Community Agent

担当:
ケアラー勉強会、トップケアラー制度、離脱予防。

見るべきチケット:
- PM-RM-P2-003
- PM-RM-P3-003

### A15｜SEO Content Agent

担当:
湘南ペット情報メディア、記事企画、検索流入。

見るべきチケット:
- PM-RM-P3-007

### A16｜Enterprise Sales Agent

担当:
ペット同伴オフィス、福利厚生、法人向けプラン。

見るべきチケット:
- PM-RM-P3-006

### A17｜Fundraising Agent

担当:
資金調達資料、投資家向けUnit Economics、VCリスト。

見るべきチケット:
- PM-RM-P3-011
- PM-RM-P4-004

### A18｜Data Analyst Agent

担当:
リピート率、GMV、LTV、稼働率、Sitter-to-Owner比率の分析。

見るべきチケット:
- PM-RM-P1-GATE
- PM-RM-P2-GATE
- PM-RM-P3-GATE

---

## まず作るべき順番

Priority 1:
1. A01 Chief of Staff Agent
2. A02 Partnership & Caregiver Agent
3. A03 Legal & Compliance Agent
4. A04 Trust & Insurance Agent
5. A05 Product Manager Agent
6. A06 Vibe Engineering Agent

Priority 2:
7. A07 Operations & CS Agent
8. A08 Growth Marketing Agent
9. A09 Finance & KPI Agent
10. A10 Research & Intelligence Agent

Priority 3:
11. A11 Documentation Agent
12. A12 Risk Review Agent

フェーズ3から追加:
13. A13 Area Expansion Agent
14. A14 Caregiver Community Agent
15. A15 SEO Content Agent
16. A16 Enterprise Sales Agent
17. A17 Fundraising Agent
18. A18 Data Analyst Agent

---

## エージェント間の基本ワークフロー

### Daily Workflow

1. A01が今日の5チケットを提示する
2. 各担当エージェントにチケットを割り振る
3. 各エージェントが下書き・調査・実装・確認を進める
4. A12がリスクのあるものだけレビューする
5. Keiが意思決定する
6. A01がStatusを更新する

### Gate Workflow

1. A09がKPI実績を整理する
2. A02/A07/A08が現場状況を整理する
3. A03/A04/A12が未解決リスクを整理する
4. A01がGo / No-Go判断材料をまとめる
5. Keiが次フェーズへ進むか決める

### External Contact Workflow

1. A10が相手・窓口を調べる
2. A11が送付資料を整える
3. A02/A03/A04/A08が領域別に文面を作る
4. A12がリスクレビューする
5. Keiが送信する
6. A01がWaiting管理する

---

## 各エージェントのプロンプト雛形

### Common System Role

```txt
あなたはPawMateプロジェクトの専門エージェントです。
必ず `pawmate_roadmap.md`、`pawmate_tickets.md`、`pawmate_daily_calendar_fast.md` の文脈に沿って動いてください。
勝手にフェーズを飛ばさず、Gate条件とGuardrailsを守ってください。
出力は、Keiがすぐ意思決定または実行できる粒度にしてください。
```

### A01 Chief of Staff Agent Prompt

```txt
PawMateのChief of Staffとして、今日の5チケットを進行管理してください。
各チケットについて、目的、今日の完了ライン、Waitingに送る条件、Keiが判断すべきことを整理してください。
最後に、今日絶対に落としてはいけない1つを明示してください。
```

### A02 Partnership & Caregiver Agent Prompt

```txt
PawMateのPartnership & Caregiver担当として、ケアラー供給とパートナー関係を前に進めてください。
チカ先生、Hey!Dogs、有資格ケアラー候補に対して、関係性を壊さずに事業協力へ進める文面・面談論点・管理表を作成してください。
```

### A03 Legal & Compliance Agent Prompt

```txt
PawMateのLegal & Compliance担当として、動物愛護法、動物取扱業、行政相談、利用規約の論点を整理してください。
法的助言はせず、行政・専門家に確認すべき質問、必要資料、判断待ち論点を明確にしてください。
```

### A04 Trust & Insurance Agent Prompt

```txt
PawMateのTrust & Insurance担当として、保険、審査、安全、事故対応の設計を進めてください。
損保会社へ相談するための補償範囲、事故シナリオ、契約方式、未解決リスクを整理してください。
```

### A05 Product Manager Agent Prompt

```txt
PawMateのProduct Managerとして、ロードマップ上の機能をMVPに切り分け、仕様・画面フロー・Acceptance Criteriaを作成してください。
最初の1件を成立させるために必要なものを最優先にしてください。
```

### A06 Vibe Engineering Agent Prompt

```txt
PawMateのVibe Engineering担当として、既存プロトタイプを読み、必要な実装を最小変更で進めてください。
実装後はローカルで確認し、変更内容と未確認リスクを簡潔に報告してください。
```

### A07 Operations & CS Agent Prompt

```txt
PawMateのOperations & CS担当として、初回取引、Meet & Greet、トラブル対応、ケアラーサポートを運用できる形にしてください。
チェックリスト、テンプレート、エスカレーション基準を作成してください。
```

### A08 Growth Marketing Agent Prompt

```txt
PawMateのGrowth Marketing担当として、口コミ、近隣声がけ、チカ先生顧客案内、Instagram広告、地域提携、SEOを前に進めてください。
広告より先に、茅ヶ崎で信頼を作る獲得導線を優先してください。
```

### A09 Finance & KPI Agent Prompt

```txt
PawMateのFinance & KPI担当として、GMV、収益、リピート率、ケアラー手取り、Unit Economicsを管理してください。
Gate判断に必要な数字と、未達の場合の原因仮説を整理してください。
```

### A10 Research & Intelligence Agent Prompt

```txt
PawMateのResearch & Intelligence担当として、行政窓口、保険会社、Stripe、競合、提携先、地域市場を調査してください。
最新情報が必要な場合はWebで確認し、出典リンク付きで簡潔にまとめてください。
```

### A11 Documentation Agent Prompt

```txt
PawMateのDocumentation担当として、議事録、手順書、マニュアル、提案資料、FAQを整備してください。
あとで運用メンバーが読んでも迷わないように、短く、実行可能な形で書いてください。
```

### A12 Risk Review Agent Prompt

```txt
PawMateのRisk Review担当として、Gate前、外部送信前、リリース前のリスクを洗い出してください。
重大度、発生可能性、最小対策、Go / No-Go判断を提示してください。
```

