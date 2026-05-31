# PawMate Agent Output Test Report
くじら舎 ／ v1.0 ／ 2026.05.31

Source:
- `agents/pawmate-agent-team/`
- `afos/agents/`
- `pawmate_agent_team.md`
- `pawmate_daily_calendar_fast.md`
- `pawmate_tickets.md`

---

## Test Summary

実施内容:
- A01〜A18の全エージェントについて、静的品質チェックを実施
- A01〜A18を6グループに分け、共通入力に対する出力スモークテストを実施
- 評価観点は、役割適合、PawMate文脈適合、Gate/Waiting運用、Kei最終判断の保持、実行可能性、危険な断定の有無

共通テスト入力:

```txt
今日のPawMate高速カレンダーの5チケットを前に進めたい。
外部送信や専門家確認が必要なものはWaitingに送り、
Keiが今日判断すべきことを明確にして。
```

重要な前提:
- 現在日付は 2026-05-31
- `pawmate_daily_calendar_fast.md` の最初の実行行は 2026-06-01
- よい出力は「今日の行がない」ことを明示し、直近の 2026-06-01 を仮置きするか、対象日確認を行うべき

---

## Overall Result

| Result | Count |
|---|---:|
| PASS | 10 |
| WARN | 8 |
| FAIL | 0 |

結論:
- 全エージェントは実運用可能
- 致命的なFAILはなし
- WARNの主因は、専門エージェントが「今日の5チケット全部」を抱え込み、A01の全体進行役に寄りすぎる可能性
- 追加で強化すべき共通ルールは「担当外チケットは処理せず、A01または主担当へHandoffする」こと

---

## Static Check Result

全18エージェントで以下を確認し、すべてOK。

| Check | Result |
|---|---|
| `SEC-01 Identity` | OK |
| `SEC-02 Scope` | OK |
| `SEC-03 I/O Contract` | OK |
| `SEC-04 Behavior` | OK |
| `SEC-05 Output Format` | OK |
| `SEC-06 Safety & Compliance` | OK |
| `SEC-07 Ops & Quality` | OK |
| `SEC-08 Failure & Escalation` | OK |
| Kei最終判断を代替しない安全線 | OK |
| 出典にない事実を断定しない安全線 | OK |
| Waiting運用 | OK |
| Gate運用 | OK |
| PawMate主要ドキュメント参照 | OK |
| `release_status: ready` | OK |
| `SKILL.md` frontmatter | OK |
| `SKILL.md` にFinal System Prompt埋め込み | OK |

---

## Agent Results

| Agent | Result | Quality Notes |
|---|---|---|
| A01 Chief of Staff | PASS | 5チケット全体の進行、Waiting、Kei判断の整理が自然。日付未掲載時の仮置きも適切。 |
| A02 Partnership & Caregiver | WARN | 供給・関係構築は良い。行政・保険まで抱えると越境するため、担当外はHandoff必須。 |
| A03 Legal & Compliance | WARN | 法務・行政論点整理は安全。5チケット全体を握らず、P0-004中心に限定すべき。 |
| A04 Trust & Insurance | PASS | 保険・審査・事故対応のWaiting化が明確。補償可否を断定しない。 |
| A05 Product Manager | WARN | MVP仕様化は良い。今日の5件にPM担当がない時、担当外ルーティングを強めたい。 |
| A06 Vibe Engineering | WARN | 実装差分案は良い。担当外やGate未達時に実装へ走りすぎない明示が必要。 |
| A07 Operations & CS | PASS | 初回取引・トラブル・マニュアルを実行可能な運用に分解できる。 |
| A08 Growth Marketing | PASS | 口コミ・近隣声がけ・顧客案内を、実績先取りなしで整理できる。 |
| A09 Finance & KPI | WARN | Gate/KPI管理は安全。5チケット全体ではなくKPI影響だけ見るとよい。 |
| A10 Research & Intelligence | WARN | 調査・一次情報確認は良い。5件全部を完結しようとせず外部確認支援に限定したい。 |
| A11 Documentation | PASS | 送信文・面談アジェンダ・相談記録テンプレへ落とす力が高い。 |
| A12 Risk Review | PASS | Gate前の止め方、Waiting条件、危険な断定回避が最も安定。 |
| A13 Area Expansion | PASS | P2 Gate未達時は計画・候補整理までに止める線引きができる。 |
| A14 Caregiver Community | PASS | 勉強会・トップケアラー制度を実行可能に分解できる。 |
| A15 SEO Content | WARN | 記事企画は良い。外部施設・医療・行政情報を一次確認前に公開しない明示が必要。 |
| A16 Enterprise Sales | WARN | 法人仮説の整理は良い。P2/P3 Gate未達時に法人展開を確定扱いしない強化が必要。 |
| A17 Fundraising | PASS | Unit Economics、調達/自己資本比較を安全に扱える。投資助言を避けられる。 |
| A18 Data Analyst | PASS | 実績未入力時にGate通過を宣言せず、必要データを棚卸しできる。 |

---

## PASS Agents

### A01 Chief of Staff

強い点:
- 5チケット全体を見る役割と完全に合っている
- 今日の日付とカレンダーのズレを扱える
- Waiting / Kei判断 / 今日落としてはいけない1つが自然

運用メモ:
- 毎朝の主導役に最適

### A04 Trust & Insurance

強い点:
- 保険会社回答待ちをWaiting化できる
- 補償可否を断定しない
- P0 Gateの「保険の目処」と接続できる

運用メモ:
- P0-006、P1-012、P2-013で呼ぶ

### A07 Operations & CS

強い点:
- 初回取引、Meet & Greet、トラブル対応を手順化できる
- 外部確認が必要な責任範囲をWaitingにできる

運用メモ:
- 初回取引前後に常駐させる価値が高い

### A08 Growth Marketing

強い点:
- 広告より先に口コミ・近隣声がけへ寄せられる
- 実績や登録数を先取りしない
- 外部送信をKei送信前提にできる

運用メモ:
- P1では近隣声がけ、P2以降は広告・提携に展開

### A11 Documentation

強い点:
- 5チケットを実行ログ、送信文、面談議事録、相談記録に変換できる
- 後で迷わない運用資産を作れる

運用メモ:
- 外部接触や面談の前後に呼ぶ

### A12 Risk Review

強い点:
- 進めてよいこと、Waitingへ送る条件、止める条件の分解が明確
- 「たぶん大丈夫」を止められる

運用メモ:
- 外部送信前、Gate前、リリース前は必須

### A13 Area Expansion

強い点:
- P2 Gate未達なら展開実行ではなく計画・候補整理に止められる
- 供給ファーストの原則を守れる

運用メモ:
- フェーズ3候補だが、早期には計画担当として使える

### A14 Caregiver Community

強い点:
- 勉強会、事故予防、トップケアラー制度を品質維持施策として扱える

運用メモ:
- P2以降で品質・定着を支える

### A17 Fundraising

強い点:
- 調達判断を実行ではなく判断材料作成に留められる
- P3 Gate依存を守れる

運用メモ:
- フェーズ3後半までは調達資料ではなくUnit Economics整理に使う

### A18 Data Analyst

強い点:
- 実績データなしでGate通過を宣言しない
- P1/P2/P3 Gateを判定表に落とせる

運用メモ:
- A09と組ませるとKPI運用が安定する

---

## WARN Patterns

### W1｜専門エージェントが5チケット全部を抱え込みやすい

該当:
- A02
- A03
- A05
- A06
- A09
- A10
- A15
- A16

リスク:
- A01のChief of Staff役と重複する
- 担当外領域で断定する可能性が出る
- 5チケット運用が部署別責任ではなく、全員PM化して散らかる

改善ルール:
- 専門エージェントは担当チケットだけ処理する
- 担当外チケットは `Handoff` としてA01または主担当へ返す
- 出力に「担当外 / 主担当 / 自分が支援できること」を必ず書く

### W2｜日付未掲載時の扱い

該当:
- 全員に共通して注意

リスク:
- 2026-05-31のようにカレンダー行がない日に、存在しない「今日の5チケット」を作ってしまう

改善ルール:
- 当日行がない場合は、以下のどちらかにする
  - 対象日確認を求める
  - 直近の実行日を「仮置き」と明示する

### W3｜未来フェーズチケットの扱い

該当:
- A05
- A06
- A09
- A13
- A15
- A16
- A17
- A18

リスク:
- P0/P1 Gate未達なのにP2/P3/P4を実行扱いにしてしまう

改善ルール:
- Gate未達なら、未来チケットは `Planning`、`Blocked`、`Waiting` のいずれかに留める
- 「実行」ではなく「設計」「候補整理」「評価軸作成」まで

### W4｜外部情報・専門判断の断定

該当:
- A03
- A04
- A10
- A15
- A16
- A17

リスク:
- 行政、保険、法務、医療、投資、地域施設情報を未確認で断定する

改善ルール:
- 最新情報が必要ならWebまたは一次情報確認を明記する
- 外部送信はKei送信前提
- 専門判断は専門家・行政・保険会社の回答待ちとしてWaitingに送る

---

## Recommended Prompt Patch

全エージェントの `SEC-04 Behavior` または `SEC-07 Ops & Quality` に、以下の共通ルールを追加すると品質が上がる。

```txt
担当外チケットが入力に含まれる場合、自分で処理せず、`Handoff` として主担当エージェントまたはA01 Chief of Staffへ返す。
その際、自分が支援できる範囲、主担当、Waiting条件だけを明示する。

今日の日付に対応する行が `pawmate_daily_calendar_fast.md` に存在しない場合、存在しないチケットを作らない。
対象日確認を行うか、直近の実行日を「仮置き」と明示する。

現フェーズのGate条件を満たしていない未来フェーズチケットは、実行扱いにしない。
`Planning`、`Blocked`、`Waiting`、または「評価軸作成」に留める。
```

---

## Operational Recommendation

実運用の呼び方:

1. A01 Chief of Staffが毎朝5チケットを読む
2. A01が各チケットを主担当へ割り振る
3. 主担当だけが成果物を作る
4. A12 Risk Reviewが外部送信・法務・保険・決済・事故・個人情報をレビューする
5. A01がDone / Waiting / Blockedを更新案としてまとめる
6. Keiが最終判断する

最初に常用すべき組み合わせ:
- A01 Chief of Staff
- A02 Partnership & Caregiver
- A03 Legal & Compliance
- A04 Trust & Insurance
- A11 Documentation
- A12 Risk Review

開発が入る日:
- A05 Product Manager
- A06 Vibe Engineering
- A12 Risk Review

初回取引が近い日:
- A07 Operations & CS
- A08 Growth Marketing
- A11 Documentation
- A12 Risk Review

KPI/Gate判定日:
- A01 Chief of Staff
- A09 Finance & KPI
- A18 Data Analyst
- A12 Risk Review

---

## Final Verdict

サブエージェントチームは実運用可能。

品質は全体として高いが、次の一点だけ先に直すとさらに安定する。

**専門エージェントは5チケット全部を処理しない。担当外はHandoffする。**

このルールを共通プロンプトに入れれば、A01が司令塔、各専門エージェントが部署担当、A12が安全審査という形でかなり綺麗に回る。

---

## Optimization Applied

2026-05-31 にWARN要因へ対応済み。

変更内容:
- `scripts/build_pawmate_agent_team.py` の共通生成テンプレートにHandoffルールを追加
- 全18エージェントを再生成
- `pawmate_tickets.md` のStatus定義へ `Waiting` を追加

追加した共通ルール:
- 担当外チケットは自分で処理せず、`Handoff` として主担当またはA01へ返す
- 今日の日付に対応する行が高速カレンダーにない場合、対象日確認または直近実行日の仮置きを明示する
- Gate未達の未来フェーズチケットは実行扱いにせず、Planning / Blocked / Waiting / 評価軸作成に留める
- 出力前の自己検証に、担当外抱え込み、日付行捏造、未来Gate越えのチェックを追加

再チェック結果:

| Check | Result |
|---|---|
| A01〜A18 Handoffルール | OK |
| A01〜A18 日付未掲載時ルール | OK |
| A01〜A18 未来Gate抑制 | OK |
| A01〜A18 自己検証追加 | OK |
| `pawmate_tickets.md` Waiting定義 | OK |

最適化後の評価:
- 旧WARN 8件は、共通プロンプト上の主要原因を解消済み
- 実運用上は、専門エージェントを直接呼ぶ前にA01でチケット割り振りする運用が推奨
- A12レビューは引き続き外部送信・法務・保険・決済・事故・個人情報の前に必須
