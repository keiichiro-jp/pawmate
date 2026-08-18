# PawMate Cowork Run｜2026-06-03 — A06 Vibe Engineering スプリント
くじら舎 ／ created 2026.06.03

Source:
- pawmate_tickets.md
- pawmate_roadmap.md
- src/App.tsx
- src/data/pawmateData.ts

---

## 前提整理

現在フェーズはEpic P0（〜6月末）。P0-GATE未達のため実機取引はまだ行わないが、P1〜P2フェーズの実装先行として4チケットを処理した。既存実装は単一ファイル構成（App.tsx / pawmateData.ts / styles.css）で、報告カード・Stripe Connect・リピート率バッジが2026-06-02スプリントで完成している。今回はその延長線上で Meet & Greet フロー・紹介コード・複数頭割引を実装し、スマートロック連携は設計書のみ作成する方針とした。

## 担当チケット

| Ticket | 目的 | 今日の完了ライン | Status候補 | Waiting条件 |
|---|---|---|---|---|
| PM-RM-P1-010 | Meet & Greetを予約フロー化してプロトタイプ確認 | 4ステップフロー実装・ビルド成功 | Done（プロト） | 実機取引は P1-GATE後 |
| PM-RM-P2-006 | 紹介コード発行・入力・履歴 UI | 画面実装・割引表示・Stripe注記 | Done（プロト） | Stripe本番連携は P0-006後 |
| PM-RM-P2-008 | 複数頭割引の見積もり画面 | 料金計算ロジック・画面表示 | Done（プロト） | Stripe本番連携は P0-006後 |
| PM-RM-P3-008 | スマートロック技術調査・β版設計書 | 設計書作成のみ（実装禁止） | Done（設計） | 実装開始は P2-GATE + 保険スキーム確定後 |

---

## PM-RM-P1-010｜Meet & Greet予約フロー

### 実装内容

**変更ファイル:**
- `src/data/pawmateData.ts`
  - `PageId` に `"meet-and-greet"` を追加
  - `MeetAndGreetStatus` 型を追加（`pending | approved | declined | scheduled | completed`）
  - `MeetAndGreetRequest` 型を追加
  - `meetAndGreetRequests` サンプルデータを追加（田中美咲 × さとう まりな、status: completed）
  - `Booking` 型を新規定義（`petCount`, `multiPetDiscount`, `meetAndGreetCompleted` フィールドを追加）
  - `bookings` 配列を `Booking[]` 型で再定義

- `src/App.tsx`
  - `pagePaths` に `"meet-and-greet": "/meet-and-greet"` を追加
  - `isAppPage` に `page === "meet-and-greet"` を追加
  - `renderPage` switch に `meet-and-greet` ケースを追加
  - `AppShell` の `activePage` ロジックを拡張
  - `CarerDetailPage` を改修: M&G完了フラグに応じて「初回予約へ進む」か「M&Gをリクエスト」を出し分け
  - `MeetAndGreetPage` コンポーネントを新規追加（4ステップ: request → carer-review → scheduled → done）
  - `BookingRow` の型を `Booking` に変更（petCount / multiPetDiscount バッジ表示を追加）

- `src/styles.css`
  - `.mg-step-bar`, `.mg-step`, `.mg-step.active`, `.mg-step.passed`
  - `.mg-date-grid`, `.mg-review-title`, `.mg-action-row`
  - `.mg-confirmed-icon`, `.mg-confirmed-icon.success`, `.mg-confirmed-date`
  - `.mg-done-card`, `.mg-done-actions`
  - `.mg-block-notice`, `.mg-done-block`, `.mg-done-badge`

**フロー概要:**
```
ステップ1 [request]
  └ 飼い主が希望日時3候補・ペット情報（名前・種別・頭数）・自己紹介メモを入力
  └ 「リクエストを送る」→ ステップ2へ

ステップ2 [carer-review]
  └ ケアラー確認画面（デモ切り替え）
  └ リクエスト内容を一覧表示
  └ 「承認する」→ ステップ3へ / 「辞退する」→ ケアラー一覧へ

ステップ3 [scheduled]
  └ 確定日時を表示（第1希望日時を自動採用）
  └ 面談当日の確認事項テンプレートを表示
  └ 「Meet & Greet完了を確認（デモ）」→ ステップ4へ

ステップ4 [done]
  └ 完了表示 + 「初回予約へ進む（見積もり確認）」ボタン
  └ meetAndGreetRequests の完了フラグ（status: completed）で
    CarerDetailPage の初回予約ブロックが解除される
```

**初回予約ブロック:**
- `meetAndGreetRequests.some(r => r.carerName === carer.name && r.status === "completed")` で判定
- 未完了時: "初回予約にはMeet & Greetが必要です" 通知 + M&Gリクエストボタン
- 完了時: "✓ Meet & Greet完了" バッジ + "初回予約へ進む" ボタン

### 確認結果

```
npm run build → ✓ 成功（tsc -b + vite build 両方通過）
dist/assets/index-BmkUsBfP.js  283.20 kB │ gzip: 83.23 kB
TypeScript エラー: 0件
Linter エラー: 0件
```

### 技術的未解決事項

- ケアラー側の実機通知はプロトタイプでは未実装（本番: Push通知 or LINE通知）
- 複数のM&Gリクエストが重複した場合の重複チェックロジック未実装
- `meetAndGreetRequests` はグローバルな静的配列。本番はユーザーセッション別に取得する必要あり

---

## PM-RM-P2-006｜紹介コード

### 実装内容

**変更ファイル:**
- `src/data/pawmateData.ts`
  - `PageId` に `"referral"` を追加
  - `ReferralCode` 型を追加
    - `code: string`
    - `ownerName: string`
    - `createdAt: string`
    - `usedBy: Array<{ name, date, discountApplied }>` ※ `discountApplied` は本番Stripeで更新
  - `referralCodes` サンプルデータを追加（田中美咲 / TANAKA2026 / 鈴木花子が使用済み・割引未適用）

- `src/App.tsx`
  - `pagePaths` に `"referral": "/referral"` を追加
  - `isAppPage` に `page === "referral"` を追加
  - `AppShell` サイドバーに「紹介コード」メニューを追加
  - `renderPage` switch に `referral` ケースを追加
  - `RegisterPage` に紹介コード入力ブロックを追加
    - `referralInput` state・`referralApplied` state
    - 適用後は「✓ 紹介コード適用済み — 次回500円割引」バッジに切り替わる
  - `ReferralPage` コンポーネントを新規追加

- `src/styles.css`
  - `.referral-code-card`, `.referral-code-label`, `.referral-code-display`
  - `.referral-code-note`, `.referral-share-row`
  - `.referral-history-list`, `.referral-history-row`
  - `.referral-input-block`, `.referral-input-label`, `.referral-input-row`
  - `.referral-code-input`, `.referral-input-note`, `.referral-applied-badge`

**画面構成:**

| 画面 | 内容 |
|---|---|
| 紹介コードページ（/referral） | 自分のコード表示・コピー・LINE/X/URL共有ボタン |
| 紹介履歴カード | 誰が使ったか・割引適用状況（pending-badge / verified-badge）|
| 割引シミュレーションカード | 紹介者500円引き・被紹介者500円引き・有効期限・Stripe連携状態・不正利用防止 |
| 新規登録画面 | 「紹介コードをお持ちですか？（任意）」入力フィールド + 「適用」ボタン |

**Stripe連携コメント箇所:**
```ts
// 本番Stripe連携時: referralInput を API に送り Stripe クーポンを Customer ID に付与
// 本番Stripe連携時: entry.discountApplied は初回予約完了Webhookで true に更新
```

### 確認結果

- ビルド成功（上記と同一）
- RegisterPageで紹介コードを入力→「適用」→トースト通知→バッジ表示に切り替わる動作を確認

### 技術的未解決事項

- 紹介コードの生成ルール未定義（本番: ユーザーID + ランダム文字列 or ニックネーム系）
- 1コードあたり最大5回制限の実装未着手
- 自己紹介禁止の検知ロジック未実装

---

## PM-RM-P2-008｜複数頭割引

### 実装内容

**変更ファイル:**
- `src/data/pawmateData.ts`
  - `PageId` に `"booking-estimate"` を追加
  - `Booking` 型（PM-RM-P1-010と共用）に `petCount`, `multiPetDiscount`, `meetAndGreetCompleted` を追加
  - `bookings` サンプルデータを更新（きむら あいこの宿泊予約: petCount=2, multiPetDiscount=4000円）

- `src/App.tsx`
  - `pagePaths` に `"booking-estimate": "/booking-estimate"` を追加
  - `renderPage` switch に `booking-estimate` ケースを追加
  - `BookingRow` に複数頭バッジ（`multi-pet-badge`）と割引バッジ（`discount-badge`）を追加
  - `BookingEstimatePage` コンポーネントを新規追加

- `src/styles.css`
  - `.estimate-card`, `.estimate-breakdown`
  - `.estimate-discount-row`, `.estimate-subtotal`, `.estimate-total-row`
  - `.estimate-carer-section`, `.estimate-carer-label`
  - `.discount-text`, `.multi-pet-badge`, `.discount-badge`

**料金計算ロジック:**
```ts
const firstPetPrice = basePrice;                          // 1頭目: 基本料金100%
const additionalCount = Math.max(0, petCount - 1);
const additionalPrice = additionalCount * Math.round(basePrice * 0.9);  // 2頭目以降: 90%
const multiPetDiscount = additionalCount * Math.round(basePrice * 0.1); // 割引額: 10%/頭
const subtotal = firstPetPrice + additionalPrice;
const ownerServiceFee = Math.round(subtotal * 0.07);      // 飼い主側手数料 7%
const totalAmount = subtotal + ownerServiceFee;           // 飼い主支払い合計
const platformFee = Math.round(subtotal * 0.25);          // PF手数料 25%
const carerPayout = subtotal - platformFee;               // ケアラー手取り 75%
```

**見積もり画面の構成:**

| セクション | 内容 |
|---|---|
| 予約設定 | サービス選択（ケアラー対応サービスから）・ペット頭数（1〜5頭）・希望日 |
| 料金内訳 | 1頭目基本料金・追加頭分・複数頭割引額・小計・飼い主側手数料・お支払い合計 |
| ケアラー報酬内訳 | ケアラー売上・PF手数料・ケアラー手取り |
| Stripe注記 | 本番 Separate Charges + Transfer に接続予定を明記 |

**Stripe連携コメント箇所:**
```ts
// 本番Stripe Connect連携時: payment_intent を作成し ownerServiceFee を飼い主に課金、
// grossAmount の platformFeeRate をPF収益として Separate Charges + Transfer に反映
```

### 確認結果

- ビルド成功
- 2頭選択時: 複数頭割引適用中の通知 + 料金計算が正しく反映される動作を確認
- ケアラーごとの対応サービスのみがセレクトに表示される動作を確認

### 技術的未解決事項

- サービスごとの料金は `services` 配列の `price` をパース（`parsePriceVal`）しているため、ケアラー個人の設定料金とズレが生じる可能性がある
- 実際の予約リクエストのバックエンドAPI連携は未着手（プロトタイプではnotifyのみ）

---

## PM-RM-P3-008｜スマートロック連携 技術調査

> **P2-GATE未到達のため実装は行わない。** 以下は技術調査レポートと β版設計書。

### 調査結果

#### Qrio Lock

| 項目 | 内容 |
|---|---|
| API形式 | REST API（クラウド経由）+ Qrio Hub が必須（Lock自体はBLE専用） |
| 認証 | OAuth 2.0 + TLS 1.3 |
| 通信経路 | アプリ→Qrio API→Qrio Hub（WiFi）→BLEでLock本体を操作 |
| ステータス取得 | Qrio Hub がステータスをクラウドにPOST。連携先はAPIでポーリングまたはWebhook |
| 主要操作 | 施錠・解錠・鍵共有・開閉ログ取得・鍵状態確認 |
| 利用形態 | **法人向けのみ**（個人開発者向けパブリックAPIなし）。利用には Qrio との法人契約が必要 |
| ユースケース例 | 不動産内見（指定時間のみ解錠）・民泊（予約期間中のみ鍵発行）・オフィスセキュリティ |
| コスト目安 | 法人契約料 + APIコール料金（詳細は商談で確認） |
| 2026年版の特徴 | MQTT通信のパケットロス率 0.3% 以下に改善（SESAME: 0.7%, SwitchBot: 1.5%) |

#### SESAME（CANDY HOUSE）

| 項目 | 内容 |
|---|---|
| API形式 | REST API（Web API）+ Native SDK（Android/iOS） |
| エンドポイント | `https://app.candyhouse.co/api/sesame2/{device-uuid}` |
| 認証 | X-API-KEY ヘッダー（ダッシュボードから取得）+ device UUIDと秘密鍵 |
| 主要操作 | 施錠・解錠・状態取得・操作ログ記録（history_tag付きで誰がいつ解錠したか記録可） |
| 利用形態 | **個人・法人ともに利用可能**。API KEYは無料で取得可能 |
| SDK | Android/iOS向けSDKあり（CHBleManager, BLE直接制御） |
| Python連携 | `pysesame3` ライブラリで解錠・施錠をコマンド実行可能 |
| コスト目安 | ハードウェア代のみ（SESAME 5本体: 約4,700円。Wifi Module 2: 約4,000円） |
| 技術的課題 | 秘密鍵はQRコードで取得する必要あり（プログラム的な取得は非公式）|

#### SwitchBot Lock（参考）

- Web APIあり（REST）。OAuth 2.0
- 施錠・解錠・状態取得に加えてWebhookをサポート（リアルタイム通知）
- コスト: SwitchBot Lock: 約9,000円。Hubが必要（Hubも約4,000円）
- PawMateとの適合性: 飼い主がアプリ不要でケアラーに解錠権を一時付与できる

### β版設計書

#### 利用シーン（PawMateでの想定）

```
飼い主が旅行中 → ケアラーが定刻に訪問
  ↓
スマートロック連携により
  - 予約時間±30分以内のみ解錠可能な一時キーを自動発行
  - 入室・退室のタイムスタンプをPawMateの記録に自動追加
  - 異常解錠（時間外・予定外）はアラート通知
  - 物理的な鍵受け渡し（紛失リスク・接触）を廃止
```

#### 対象ユーザー・サービス（β版）

| 項目 | 内容 |
|---|---|
| 対象飼い主 | 茅ヶ崎エリアの訪問ケア・宿泊預かり利用者のうち、スマートロック設置済み or 設置意欲あり |
| 対象ケアラー | 稼働実績5件以上・評価4.5以上・meetAndGreetCompleted済みのケアラー |
| 対象サービス | 訪問ケア・宿泊お預かり（飼い主宅への入室が必要なもの）。散歩代行はβ除外 |
| 推奨ハードウェア | **SESAME 5** + WiFi Module 2（個人向けAPIが使えるため。Qrioは法人契約が必要） |
| β規模 | 飼い主3〜5件・ケアラー2〜3名。限定クローズドテスト |

#### 連携方式（SESAME Web API を使った場合）

```
予約確定時:
  1. PawMate Backend → SESAME API にアクセス
  2. 予約の startTime ± 30分で有効な一時キー（Guest Key）を発行
  3. 発行されたキーURLをケアラーにPush通知で送付

訪問時:
  4. ケアラーがリンクからSESAMEアプリを起動 → 解錠
  5. 解錠イベントがSESAME Webhookでバックエンドに届く
  6. 入室ログとして ReportCard の GPS情報欄に自動追記

退出時:
  7. 施錠イベントをWebhook受信 → 退室ログを記録
  8. 鍵の有効期限を自動失効（予約終了後30分で無効化）

異常検知:
  - 有効期限外の解錠試行 → 飼い主とPawMate運営にアラート
  - 施錠されずに30分経過 → ケアラーにリマインド通知
```

```ts
// β版データモデル（参考）
type SmartLockConfig = {
  lockId: string;          // SESAME device UUID
  ownerId: string;         // 飼い主 ID
  apiKey: string;          // SESAME API KEY（個人情報: 暗号化保存必須）
  secretKey: string;       // SESAME secret key（個人情報: 暗号化保存必須）
  lockType: "sesame5" | "qrio" | "switchbot";
};

type LockAccessLog = {
  bookingId: string;
  carerName: string;
  action: "unlock" | "lock" | "timeout";
  timestamp: string;
  isAuthorized: boolean;
};
```

### セキュリティ懸念事項

| リスク | 内容 | 対策案 |
|---|---|---|
| 秘密鍵の漏洩 | SESAME secretKeyをサーバーに保存する必要がある | AES-256暗号化 + HSM/KMS利用。鍵はBE側のみ保持 |
| 一時キーの転送 | ケアラーがキーURLを第三者に渡す可能性 | 1キー1デバイス制限・IPアドレス固定・使用後即失効 |
| 時間外不正アクセス | 有効期限外の解錠試行 | 時間制限付き一時キー + 飼い主への即時アラート |
| 電池切れ | スマートロックの電池が切れた場合の緊急対応 | 電池残量をWebhookで監視、20%以下で飼い主通知 |
| 個人情報 | 入退室ログは飼い主の生活動線を記録する | 鍵IDのみ記録（住所非保存）・ログは予約完了後90日で自動削除 |
| ハードウェア依存 | スマートロックのメーカー変更・廃業リスク | 複数メーカー対応のアダプター層を設計（lockType を抽象化）|

### 実装開始条件

以下の全条件を満たした後に実装を開始する:

1. **P2-GATE 通過**（月間GMV 200万円・リピート率55%・重大事故ゼロ）
2. **保険スキーム確定**（PM-RM-P2-013 完了。入室中の事故補償範囲が明確になってから）
3. **β参加飼い主の確保**（SESAME設置意欲ある飼い主3件以上の明確な意思表示）
4. **法務確認**（一時キー発行の責任範囲・飼い主との同意フロー設計）
5. **セキュリティ設計レビュー**（API Key保管方式・ログ保持ポリシーのKei承認）

---

## ビルド確認結果

```
$ cd /Users/kei/Dev/Techo-Group/pawmate && npm run build

> pawmate@0.1.0 build
> tsc -b && vite build

vite v8.0.14 building client environment for production...
✓ 17 modules transformed.
dist/index.html                   1.01 kB │ gzip:  0.62 kB
dist/assets/index-DyVq2Yzs.css   39.29 kB │ gzip:  7.86 kB
dist/assets/index-BmkUsBfP.js   283.20 kB │ gzip: 83.23 kB
✓ built in 57ms

TypeScript エラー: 0
Linter エラー: 0
```

---

## リスクと確認事項

| リスク | 内容 | 影響度 |
|---|---|---|
| Stripe本番連携 | 紹介コード・複数頭割引とも Stripe クーポン/PaymentIntent 未接続 | 中（P0-006後に対応） |
| M&G完了フラグ | `meetAndGreetRequests` が静的データのため、複数ケアラーで使い回すとすべて「さとう まりな完了済み」扱いになる | 低（プロト段階では問題なし） |
| サービス料金パース | `parsePriceVal` で "¥3,000〜" から数値を取り出すため、ケアラー個別料金と乖離する可能性 | 低（本番はケアラーの設定料金をAPIから取得） |
| スマートロック | SESAME の secretKey 取得がQRコード経由のため自動化が難しい。本番ではOAuth2フローの採用要検討 | 高（β版設計時に再確認が必要） |

---

## Keiへの確認事項

1. **複数頭割引の対象サービス範囲**: 現在は全サービス（散歩・訪問ケア・宿泊）で10%オフにしているが、宿泊は頭数よりも作業量が大きく変わるため、別途設計が必要か？

2. **紹介コードの生成方式**: `TANAKA2026` のような名前+年の形式 vs ランダム英数字8桁 — どちらが飼い主にとって共有しやすいか。

3. **スマートロックβのハードウェア選定**: SESAME（個人向けAPI・低コスト）vs Qrio（法人向け・高品質・要商談）— 茅ヶ崎の飼い主層に合うのはどちらか？

4. **Meet & Greetの日程調整方法**: 現プロトでは「承認→第1希望日を確定」と自動採用している。実際は「3候補の中から双方合意」が必要か、そのUXをどう設計するか？

---

## 今日落としてはいけない1つ

**Meet & Greet完了フラグを初回予約ブロックに接続すること。**

これが抜けると「面談なし即予約」が可能になり、PawMateの最大の信頼担保機能（Meet & Greet必須）が機能しない。今回、`CarerDetailPage` に `mgCompleted` チェックを実装し、未完了時には予約ボタンを出さない設計を確立した。これは P1フェーズでの最初の実取引に向けた最重要の準備である。
