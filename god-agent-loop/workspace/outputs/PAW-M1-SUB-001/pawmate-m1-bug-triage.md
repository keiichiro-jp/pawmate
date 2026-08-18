# PawMate M1 必須バグトリアージ

**作成日**: 2026-06-11  
**作成者**: god-agent-loop (coder-agent + qa-agent)  
**チケット**: PAW-M1-SUB-001 (TKT-109)  
**対象コード**: `src/App.tsx` / `src/data/pawmateData.ts`

---

## サマリー

TypeScript コンパイルエラー: **0件**  
P0バグ（M1βブロック）: **2件**  
P1バグ（UX破綻・信頼性問題）: **4件**  
M1対象外（既知・後回し）: **4件**

---

## P0 — M1βでブロックになるバグ

### BUG-001: MG完了状態がリアクティブでない — 初回予約に進めない

| 項目 | 内容 |
|---|---|
| **重大度** | P0 |
| **場所** | `App.tsx` L691 (`CarerDetailPage`) / `data/pawmateData.ts` L750 |
| **症状** | Meet & Greet を完了しても、ケアラー詳細ページに戻ると「初回予約にはMeet & Greetが必要です」ブロックが表示され続ける |

**再現手順**
1. ケアラー一覧 →「きむら あいこ」を選択
2. 「Meet & Greetをリクエストする」→ 全ステップ完了（"完了を確認する" クリック）
3. 「プロフィールに戻る」をクリック
4. → 「初回予約へ進む」ボタンが出ず、MG要求ブロック画面のまま

**根本原因**

```tsx
// CarerDetailPage L691
const mgCompleted = meetAndGreetRequests.some(
  (r) => r.carerName === carer.name && r.status === "completed",
);
```

`meetAndGreetRequests` は `pawmateData.ts` の静的配列。初期データには「さとう まりな」のMG完了(`status: "completed"`)しか含まれない。`MeetAndGreetPage` でステップを完了してもこの配列は更新されないため、他のケアラーについては永久にMGブロックが外れない。

**修正方針**

```tsx
// App.tsx の App コンポーネントに追加
const [completedMGCarerIds, setCompletedMGCarerIds] = useState<Set<number>>(
  () => new Set(
    meetAndGreetRequests
      .filter(r => r.status === "completed")
      .map(r => carers.find(c => c.name === r.carerName)?.id ?? -1)
  )
);

// MeetAndGreetPage に onComplete コールバックを追加
function handleMGComplete(carerId: number) {
  setCompletedMGCarerIds(prev => new Set(prev).add(carerId));
}

// CarerDetailPage に渡す
const mgCompleted = completedMGCarerIds.has(carer.id);
```

**影響範囲**: マッチングフロー全体（ケアラー選択→MG→初回予約の核心パス）

---

### BUG-002: 招待コード（紹介コード）が無検証で「適用済み」になる

| 項目 | 内容 |
|---|---|
| **重大度** | P0 |
| **場所** | `App.tsx` L500–504 (`RegisterPage.applyReferral`) |
| **症状** | 任意の文字列を入力して「適用」を押すと「紹介コード適用済み」になり500円割引が表示される |

**再現手順**
1. 新規登録ページを開く
2. 紹介コード欄に「INVALID999」と入力
3. 「適用」をクリック
4. → 「✓ 紹介コード適用済み — 次回500円割引」と表示される

**根本原因**

```tsx
// App.tsx L500-504
function applyReferral() {
  if (!referralInput.trim()) return;
  // ← バリデーションなし。空欄でなければ何でも通る
  setReferralApplied(true);
  notify(`紹介コード「${referralInput}」を適用しました。次回予約で500円割引が付与されます。`);
}
```

**修正方針**

```tsx
function applyReferral() {
  if (!referralInput.trim()) return;
  // referralCodes から有効コードかチェック（本番はAPI呼び出し）
  const valid = referralCodes.some(r => r.code === referralInput.trim().toUpperCase());
  if (!valid) {
    notify("紹介コードが見つかりません。ご確認ください。");
    return;
  }
  setReferralApplied(true);
  notify(`紹介コード「${referralInput}」を適用しました。次回予約で500円割引が付与されます。`);
}
```

**影響範囲**: ユーザー登録フロー・招待制βの信頼性

---

## P1 — UX破綻・信頼性問題（M1βでブロックしないが修正推奨）

### BUG-003: 予約見積もりページで希望日が未入力でもリクエスト送信できる

| 項目 | 内容 |
|---|---|
| **重大度** | P1 |
| **場所** | `App.tsx` L2345, L2399–2403 (`BookingEstimatePage`) |
| **症状** | 希望日を選ばずに「この内容で予約をリクエストする」を押せる |

**根本原因**

```tsx
// L2345 — 非管理の TextField（state なし）
<TextField label="希望日" type="date" />

// L2399 — バリデーションなし
onClick={() => { notify("予約リクエストを送りました。..."); goTo("my-bookings"); }}
```

`希望日` の input が React state で管理されていないため、値の検証ができない。

**修正方針**: `useState<string>("")` で日付を管理し、空の場合は `notify("希望日を選択してください")` でブロック。

---

### BUG-004: 予約一覧の React key が重複する可能性

| 項目 | 内容 |
|---|---|
| **重大度** | P1 |
| **場所** | `App.tsx` L861 (`BookingsPage`) |
| **症状** | 同一ケアラーに同日予約が2件あると key 重複 → React警告・表示崩れ |

**根本原因**

```tsx
<div className="booking-card" key={booking.carer + booking.date}>
```

`Booking` 型に `id` フィールドがない。文字列結合は衝突リスクあり。

**修正方針**: `Booking` 型に `id: string` を追加（例: `"BK-001"`）し、`key={booking.id}` に変更。

---

### BUG-005: 「ログアウト」がセッション状態をクリアしない

| 項目 | 内容 |
|---|---|
| **重大度** | P1 |
| **場所** | `App.tsx` L248 (Nav), L295 (AppShell) |
| **症状** | ログアウト後も role / selectedCarer / MG完了状態などがメモリ上に残る |

**根本原因**

```tsx
// L295 — landing に遷移するだけ
<button className="sidebar-item" type="button" onClick={() => goTo("landing")}>ログアウト</button>
```

**修正方針**: ログアウト時に `setRole("owner")`, `setSelectedCarer(carers[0])`, `setCompletedMGCarerIds(new Set(...))` などのリセット処理を実行する `handleLogout()` 関数を追加。

---

### BUG-006: ケアラー検索 0件時の空状態UIなし

| 項目 | 内容 |
|---|---|
| **重大度** | P1 |
| **場所** | `App.tsx` L376 (`LandingPage` / `CarersPage` 検索結果表示) |
| **症状** | 検索結果が0件のとき何も表示されず、ユーザーが「フィルタが機能していないのか」と混乱 |

**修正方針**: `searchResults !== null && searchResults.length === 0` の場合に「条件に合うケアラーが見つかりませんでした」メッセージを表示。

---

## M1対象外（既知・スコープ外）

| No | 内容 | 理由 |
|---|---|---|
| M1-OUT-001 | Stripe本番未接続 | 意図的。PaymentsPage・BookingEstimatePage にコメントあり。保険スキーム確定後 |
| M1-OUT-002 | ケアラー側アプリ未実装（MG承認がデモボタン） | M2スコープ |
| M1-OUT-003 | Safari/iOS実機確認 | M1完了条件に含まれるが実機が必要。PAW-T-001の残タスク |
| M1-OUT-004 | 決済リダイレクト後のroute保持（ページリロード時にlandingに戻る） | `pageFromLocation()` は実装済みだが本番URL構造に依存 |

---

## 修正優先順序（M1βまで）

```
BUG-001 (P0) → BUG-002 (P0) → BUG-003 (P1) → BUG-004 (P1) → BUG-005 (P1) → BUG-006 (P1)
```

BUG-001とBUG-002はβユーザー招待前に必ず修正する。  
BUG-003〜006はβ開始後のスプリントで対応可能だが、初成約前に完了が望ましい。

---

## 付録: TypeScript ビルド状態

```
npx tsc --noEmit → エラー0件（2026-06-11 確認済み）
```
