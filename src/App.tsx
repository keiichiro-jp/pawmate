import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import {
  adminApplicants,
  adminBookingRows,
  adminIncidentRows,
  adminMetrics,
  adminPaymentRows,
  adminQualityRows,
  adminTasks,
  areas,
  bookings,
  carers,
  connectAccounts,
  meetAndGreetRequests,
  paymentRecords,
  referralCodes,
  reportCards,
  requests,
  services,
  stripeConfig,
  trustItems,
  type Booking,
  type Carer,
  type PageId,
  type ReportCard,
  type Role,
} from "./data/pawmateData";

type SortKey = "rating" | "price" | "reviews";

/** 信頼スコア（0–100）を計算する */
function calcTrustScore(carer: Carer): number {
  let score = 0;
  // 登録情報確認済み: 40pt
  if (carer.license.verified) score += 40;
  // 保有資格: 1件10pt × 最大2件 = 20pt
  score += Math.min(carer.certs.length, 2) * 10;
  // リピート率: 5件以上のデータがある場合のみ
  if (carer.repeatRateBase !== null && carer.repeatRateBase >= 5) {
    const pct = parseInt(carer.repeatRate, 10) || 0;
    if (pct >= 80) score += 25;
    else if (pct >= 60) score += 15;
    else score += 5;
  }
  // 評価: 15pt max
  if (carer.rating >= 4.8) score += 15;
  else if (carer.rating >= 4.5) score += 10;
  else if (carer.rating >= 4.0) score += 5;
  return Math.min(score, 100);
}

function TrustScoreBadge({ carer, compact = false }: { carer: Carer; compact?: boolean }) {
  const score = calcTrustScore(carer);
  const tone = score >= 80 ? "high" : score >= 60 ? "mid" : "low";
  if (compact) {
    return (
      <div className={`trust-score-compact tone-${tone}`}>
        <span className="trust-score-label">信頼スコア</span>
        <span className="trust-score-value">{score}</span>
        <span className="trust-score-max">/100</span>
      </div>
    );
  }
  return (
    <div className={`trust-score-block tone-${tone}`}>
      <div className="trust-score-block-head">
        <span className="trust-score-block-label">信頼スコア</span>
        <span className="trust-score-block-value">{score}<small>/100</small></span>
      </div>
      <div className="trust-score-bar-wrap">
        <div className="trust-score-bar-fill" style={{ width: `${score}%` }} />
      </div>
      <p className="trust-score-hint">
        登録情報確認・資格・リピート率・評価をもとに算出
      </p>
    </div>
  );
}

function parsePriceVal(price: string): number {
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

const appPages: PageId[] = [
  "dashboard",
  "carers",
  "requests",
  "my-pets",
  "my-bookings",
  "messages",
];

const pagePaths: Record<PageId, string> = {
  landing: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  carers: "/carers",
  "carer-detail": "/carers/detail",
  requests: "/requests",
  "my-pets": "/my-pets",
  "my-bookings": "/my-bookings",
  messages: "/messages",
  "carer-profile": "/carer-profile",
  "report-card": "/report-card",
  payments: "/payments",
  "meet-and-greet": "/meet-and-greet",
  "referral": "/referral",
  "booking-estimate": "/booking-estimate",
  admin: "/admin",
};

function pageFromLocation(): PageId {
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  const entry = Object.entries(pagePaths).find(([, path]) => path === currentPath);
  return entry ? (entry[0] as PageId) : "landing";
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** 消印風スタンプ（装飾のみ）: 円形・掠れたインク・エリア名＋日付 */
function Postmark({ ring, line1, line2, className }: { ring: string; line1: string; line2: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <span className={cx("postmark", className)} aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs>
          <path id={`ring-${uid}`} d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" fill="none" />
          <filter id={`rough-${uid}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" result="n" seed="7" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 0.82" />
            </feComponentTransfer>
          </filter>
        </defs>
        <g filter={`url(#rough-${uid})`} fill="none" stroke="currentColor">
          <circle cx="60" cy="60" r="54" strokeWidth="2.4" strokeDasharray="18 2.5 30 1.5 44 2" />
          <circle cx="60" cy="60" r="35" strokeWidth="1.3" strokeDasharray="26 2 14 1.5 40 2.5" />
          <text fontSize="11.5" fontFamily="'Cormorant Garamond', serif" fontWeight="600" letterSpacing="2.6" fill="currentColor" stroke="none">
            <textPath href={`#ring-${uid}`} startOffset="0%">{ring}</textPath>
          </text>
          <text x="60" y="57" textAnchor="middle" fontSize="13" fontFamily="'Cormorant Garamond', serif" fontWeight="600" letterSpacing="1.5" fill="currentColor" stroke="none">{line1}</text>
          <path d="M 34 66 Q 47 63.5, 60 66 T 86 66" strokeWidth="1" strokeDasharray="10 1.5 22 1" />
          <text x="60" y="80" textAnchor="middle" fontSize="10" fontFamily="'Cormorant Garamond', serif" letterSpacing="2" fill="currentColor" stroke="none">{line2}</text>
        </g>
      </svg>
    </span>
  );
}

export default function App() {
  const [page, setPage] = useState<PageId>(() => pageFromLocation());
  const [role, setRole] = useState<Role>("owner");
  const [selectedCarer, setSelectedCarer] = useState<Carer>(carers[0]);
  const [selectedReport, setSelectedReport] = useState<ReportCard>(reportCards[0]);
  const [toast, setToast] = useState("");

  const isAppPage = appPages.includes(page) || page === "carer-detail" || page === "report-card" || page === "payments" || page === "meet-and-greet" || page === "referral" || page === "booking-estimate";

  useEffect(() => {
    const handlePopState = () => setPage(pageFromLocation());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function goTo(nextPage: PageId) {
    setPage(nextPage);
    if (window.location.pathname !== pagePaths[nextPage]) {
      window.history.pushState(null, "", pagePaths[nextPage]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCarer(carer: Carer) {
    setSelectedCarer(carer);
    goTo("carer-detail");
  }

  function openReport(report: ReportCard) {
    setSelectedReport(report);
    goTo("report-card");
  }

  return (
    <>
      <Nav page={page} isAppPage={isAppPage} goTo={goTo} />
      {isAppPage ? (
        <AppShell page={page} goTo={goTo}>
          {renderPage()}
        </AppShell>
      ) : (
        renderPage()
      )}
      <Toast message={toast} />
    </>
  );

  function renderPage() {
    switch (page) {
      case "landing":
        return <LandingPage goTo={goTo} openCarer={openCarer} />;
      case "login":
        return <LoginPage goTo={goTo} notify={notify} />;
      case "register":
        return <RegisterPage goTo={goTo} notify={notify} role={role} setRole={setRole} />;
      case "dashboard":
        return <DashboardPage goTo={goTo} notify={notify} openReport={openReport} />;
      case "carers":
        return <CarersPage openCarer={openCarer} />;
      case "carer-detail":
        return <CarerDetailPage carer={selectedCarer} notify={notify} goTo={goTo} />;
      case "requests":
        return <RequestsPage notify={notify} />;
      case "my-pets":
        return <MyPetsPage notify={notify} />;
      case "my-bookings":
        return <BookingsPage goTo={goTo} notify={notify} openReport={openReport} />;
      case "messages":
        return <MessagesPage notify={notify} />;
      case "carer-profile":
        return <CarerProfilePage notify={notify} />;
      case "report-card":
        return <ReportCardViewPage report={selectedReport} goTo={goTo} />;
      case "payments":
        return <PaymentsPage notify={notify} />;
      case "meet-and-greet":
        return <MeetAndGreetPage carer={selectedCarer} goTo={goTo} notify={notify} />;
      case "referral":
        return <ReferralPage notify={notify} />;
      case "booking-estimate":
        return <BookingEstimatePage carer={selectedCarer} goTo={goTo} notify={notify} />;
      case "admin":
        return <AdminPage notify={notify} />;
      default:
        return <LandingPage goTo={goTo} openCarer={openCarer} />;
    }
  }
}

function Nav({
  page,
  isAppPage,
  goTo,
}: {
  page: PageId;
  isAppPage: boolean;
  goTo: (page: PageId) => void;
}) {
  return (
    <header className="nav">
      <button className="logo-button" type="button" onClick={() => goTo("landing")}>
        <span className="logo-mark">P</span>
        <span>PawMate</span>
      </button>
      <nav className="nav-links" aria-label="主要ナビゲーション">
        <button type="button" onClick={() => goTo("carers")}>ケアラーを探す</button>
        <button type="button" onClick={() => goTo("requests")}>依頼を探す</button>
        <button type="button" onClick={() => goTo("landing")}>ご利用方法</button>
      </nav>
      <div className="nav-actions">
        {isAppPage ? (
          <>
            <button className="btn ghost small" type="button" onClick={() => goTo("dashboard")}>ダッシュボード</button>
            <button className="btn ghost small" type="button" onClick={() => goTo("landing")}>ログアウト</button>
          </>
        ) : (
          <>
            <button className={cx("btn ghost small", page === "login" && "active")} type="button" onClick={() => goTo("login")}>
              ログイン
            </button>
            <button className="btn primary small" type="button" onClick={() => goTo("register")}>無料登録</button>
          </>
        )}
      </div>
    </header>
  );
}

function AppShell({ page, goTo, children }: { page: PageId; goTo: (page: PageId) => void; children: ReactNode }) {
  const items: Array<{ id: PageId; label: string; badge?: string }> = [
    { id: "dashboard", label: "ダッシュボード" },
    { id: "carers", label: "ケアラーを探す" },
    { id: "requests", label: "依頼掲示板", badge: "3" },
    { id: "my-pets", label: "マイペット" },
    { id: "my-bookings", label: "予約管理" },
    { id: "messages", label: "メッセージ", badge: "2" },
    { id: "referral", label: "紹介コード" },
    { id: "payments", label: "決済（デモ）" },
  ];
  const activePage = (page === "carer-detail" || page === "report-card" || page === "meet-and-greet" || page === "booking-estimate")
    ? (page === "report-card" ? "my-bookings" : "carers")
    : page === "referral" ? "referral"
    : page;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-profile">
          <span className="avatar small-avatar">TM</span>
          <div>
            <strong>田中 美咲</strong>
            <span>飼い主</span>
          </div>
        </div>
        <p className="sidebar-label">メニュー</p>
        {items.map((item) => (
          <button
            key={item.id}
            className={cx("sidebar-item", activePage === item.id && "active")}
            type="button"
            onClick={() => goTo(item.id)}
          >
            <span>{item.label}</span>
            {item.badge && <b>{item.badge}</b>}
          </button>
        ))}
        <div className="sidebar-separator" />
        <button className="sidebar-item" type="button" onClick={() => goTo("landing")}>ログアウト</button>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}

function LandingPage({ goTo, openCarer }: { goTo: (page: PageId) => void; openCarer: (carer: Carer) => void }) {
  const [searchDate, setSearchDate] = useState("");
  const [searchService, setSearchService] = useState("すべて");
  const [searchArea, setSearchArea] = useState("すべて");
  const [searchResults, setSearchResults] = useState<Carer[] | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const sortedResults = useMemo(() => {
    if (!searchResults) return [];
    return [...searchResults].sort((a, b) => {
      if (sortKey === "rating") return b.rating - a.rating;
      if (sortKey === "price") return parsePriceVal(a.price) - parsePriceVal(b.price);
      return b.reviews - a.reviews;
    });
  }, [searchResults, sortKey]);

  function handleSearch() {
    const filtered = carers.filter((carer) => {
      const matchesService = searchService === "すべて" || carer.services.includes(searchService);
      const matchesArea = searchArea === "すべて" || carer.area === searchArea;
      return matchesService && matchesArea;
    });
    setSearchResults(filtered);
    setSortKey("rating");
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">登録情報確認型 · 湘南エリア先行</p>
            <h1>信頼できるプロが、<br />いつもの場所で、<br /><span className="klee">いつものように</span>。</h1>
            <p className="lead">
              湘南で暮らす有資格のケアラーが、ペットの日常をそっと支えます。
              旅行を諦めない。出張を諦めない。体調不良の日も罪悪感を持たない。
            </p>
            <div className="hero-actions">
              <button className="btn primary" type="button" onClick={() => goTo("carers")}>ケアラーを探す</button>
              <button className="btn ghost" type="button" onClick={() => goTo("carer-profile")}>プロとして参加する</button>
            </div>
            <div className="area-tags">
              {areas.map((area) => <span key={area}>{area}</span>)}
            </div>
          </div>
          <div className="hero-collage">
            <figure className="polaroid main tilt-r">
              <span className="tape" />
              <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80" alt="湘南で散歩する犬" />
              <figcaption className="polaroid-caption">おさんぽ日和</figcaption>
            </figure>
            <figure className="polaroid sub tilt-l">
              <span className="tape" />
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80" alt="くつろぐ猫" />
              <figcaption className="polaroid-caption">おるすばん中</figcaption>
            </figure>
            <Postmark className="hero-postmark" ring="PAWMATE · SHONAN · KANAGAWA · JAPAN ·" line1="SHONAN" line2="2026. 8. 18" />
            <span className="hero-memo">a good day by the sea</span>
          </div>
        </div>
        <div className="hero-search-card">
          <label className="field">
            <span>日時</span>
            <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
          </label>
          <label className="field">
            <span>サービス</span>
            <select value={searchService} onChange={(e) => setSearchService(e.target.value)}>
              <option>すべて</option>
              {services.map((s) => <option key={s.id}>{s.title}</option>)}
            </select>
          </label>
          <label className="field">
            <span>エリア</span>
            <select value={searchArea} onChange={(e) => setSearchArea(e.target.value)}>
              <option>すべて</option>
              {areas.map((a) => <option key={a}>{a}</option>)}
            </select>
          </label>
          <button className="btn primary hero-search-btn" type="button" onClick={handleSearch}>
            ケアラーを検索
          </button>
        </div>
      </section>

      {searchResults !== null && (
        <section className="hero-results-section">
          <div className="hero-results-inner">
            <div className="sort-bar">
              <span>{sortedResults.length}件のケアラーが見つかりました</span>
              <div className="sort-tabs">
                {(
                  [
                    { key: "rating" as SortKey, label: "評価順" },
                    { key: "price" as SortKey, label: "価格順（安い順）" },
                    { key: "reviews" as SortKey, label: "レビュー数順" },
                  ]
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    className={cx("btn ghost small", sortKey === key && "sort-active")}
                    type="button"
                    onClick={() => setSortKey(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {sortedResults.length === 0 ? (
              <p className="no-results">条件に合うケアラーが見つかりませんでした。エリアやサービスを変えてお試しください。</p>
            ) : (
              <>
                <div className="carer-grid">
                  {sortedResults.map((carer) => <CarerCard key={carer.id} carer={carer} openCarer={openCarer} />)}
                </div>
                <div className="results-footer">
                  <button className="btn ghost" type="button" onClick={() => goTo("carers")}>
                    すべてのケアラーを見る
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <SectionHeader label="Services" title="すべて有資格プロによる自宅訪問型ケア" />
      <section className="section grid-3">
        {services.map((service) => (
          <article className="service-card" key={service.id}>
            <div className={cx("service-icon", service.icon)} />
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <strong>{service.price}<span>/{service.unit}</span></strong>
          </article>
        ))}
      </section>

      <SectionHeader label="Trust Infrastructure" title="安心のためにさまざまな仕組みを整えました。" />
      <section className="section trust-grid">
        <Postmark className="trust-postmark" ring="PAWMATE · TRUST · VERIFIED ·" line1="確認済" line2="SHONAN OFFICE" />
        {trustItems.map((item) => (
          <article className="trust-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div>
          <p className="eyebrow">For Professionals</p>
          <h2>あなたはケアだけに集中していい。</h2>
          <p>
            集客、予約管理、決済、信頼担保をPawMateが肩代わりします。
            登録情報を確認できるプロが、正当に評価され、継続的に報われる場所を作ります。
          </p>
          <ul className="check-list">
            <li>ケアラー側手数料18%、飼い主側7%のデュアルフィー制</li>
            <li>登録番号、資格、リピート率をプロフィールで明示</li>
            <li>初回案件は人力マッチングで立ち上げを支援</li>
          </ul>
          <button className="btn primary" type="button" onClick={() => goTo("carer-profile")}>ケアラー登録へ</button>
        </div>
        <div className="quote-card">
          <span className="tape" />
          <Postmark className="quote-postmark" ring="PAWMATE · STAY RECORD · SHONAN ·" line1="滞在記" line2="2026. 8. 18" />
          <p>「プロフェッショナルな愛情」</p>
          <span>愛情だけでは足りない。技術だけでも足りない。資格を持ったプロが、ペットへの愛情を持ってケアする。</span>
        </div>
      </section>

      <section className="cta-section">
        <h2>ペットと暮らす人が、もっと自由に。</h2>
        <p>茅ヶ崎・藤沢・鎌倉・平塚・辻堂で先行展開中。</p>
        <div>
          <button className="btn light" type="button" onClick={() => goTo("register")}>無料で始める</button>
          <button className="btn outline-light" type="button" onClick={() => goTo("carers")}>ケアラーを見る</button>
        </div>
      </section>
      <Footer goTo={goTo} />
    </main>
  );
}

function LoginPage({ goTo, notify }: { goTo: (page: PageId) => void; notify: (message: string) => void }) {
  return (
    <AuthShell title="ログイン" subtitle="PawMateに戻って、次のケアを確認しましょう。">
      <TextField label="メールアドレス" type="email" placeholder="hello@example.com" />
      <TextField label="パスワード" type="password" placeholder="8文字以上" />
      <button className="btn primary full" type="button" onClick={() => { notify("ログインしました"); goTo("dashboard"); }}>ログイン</button>
      <button className="link-button center" type="button" onClick={() => goTo("register")}>アカウントを作成する</button>
      <button className="link-button center muted" type="button" onClick={() => goTo("admin")}>管理者デモへ</button>
    </AuthShell>
  );
}

function RegisterPage({
  goTo,
  notify,
  role,
  setRole,
}: {
  goTo: (page: PageId) => void;
  notify: (message: string) => void;
  role: Role;
  setRole: (role: Role) => void;
}) {
  const [referralInput, setReferralInput] = useState("");
  const [referralApplied, setReferralApplied] = useState(false);

  function applyReferral() {
    if (!referralInput.trim()) return;
    /* 本番Stripe連携時: referralInput を API に送り Stripe クーポンを Customer ID に付与 */
    setReferralApplied(true);
    notify(`紹介コード「${referralInput}」を適用しました。次回予約で500円割引が付与されます。`);
  }

  return (
    <AuthShell title="無料登録" subtitle="飼い主として依頼するか、プロとして参加するかを選べます。">
      <div className="role-grid">
        <button className={cx("role-card", role === "owner" && "selected")} type="button" onClick={() => setRole("owner")}>
          <strong>飼い主</strong>
          <span>ケアを依頼する</span>
        </button>
        <button className={cx("role-card", role === "carer" && "selected")} type="button" onClick={() => setRole("carer")}>
          <strong>ケアラー</strong>
          <span>プロとして参加する</span>
        </button>
      </div>
      <div className="form-row">
        <TextField label="姓" placeholder="山田" />
        <TextField label="名" placeholder="太郎" />
      </div>
      <TextField label="メールアドレス" type="email" placeholder="hello@example.com" />
      <TextField label="パスワード" type="password" placeholder="8文字以上" />
      <label className="field">
        <span>居住/活動エリア</span>
        <select>
          {areas.map((area) => <option key={area}>{area}</option>)}
        </select>
      </label>
      <div className="referral-input-block">
        <p className="referral-input-label">紹介コードをお持ちですか？（任意）</p>
        {referralApplied ? (
          <div className="referral-applied-badge">
            <span className="verified-badge">✓ 紹介コード適用済み — 次回500円割引</span>
          </div>
        ) : (
          <div className="referral-input-row">
            <input
              className="referral-code-input"
              type="text"
              placeholder="例：TANAKA2026"
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
            />
            <button className="btn ghost small" type="button" onClick={applyReferral}>
              適用
            </button>
          </div>
        )}
        <p className="referral-input-note">
          {/* 本番Stripe連携時: 紹介コードをバックエンドで検証し Stripe Coupon ID を取得 */}
          紹介コードを入力すると、初回予約で500円割引が付与されます。
        </p>
      </div>
      <button
        className="btn primary full"
        type="button"
        onClick={() => {
          notify("登録しました");
          goTo(role === "carer" ? "carer-profile" : "dashboard");
        }}
      >
        登録して始める
      </button>
    </AuthShell>
  );
}

function DashboardPage({
  goTo,
  notify,
  openReport,
}: {
  goTo: (page: PageId) => void;
  notify: (message: string) => void;
  openReport: (report: ReportCard) => void;
}) {
  return (
    <Stack title="ダッシュボード" subtitle="おかえりなさい、美咲さん。次のケアとメッセージを確認できます。">
      <div className="stats-grid">
        <Stat value="3" label="進行中の予約" />
        <Stat value="12" label="総依頼回数" />
        <Stat value="2" label="未読メッセージ" />
        <Stat value="4.8" label="平均評価" />
      </div>
      <div className="grid-2">
        <Card title="直近の予約" action={<button className="btn ghost small" type="button" onClick={() => goTo("my-bookings")}>すべて見る</button>}>
          {bookings.slice(0, 2).map((booking) => <BookingRow key={booking.carer + booking.date} booking={booking} />)}
        </Card>
        <Card title="マイペット" action={<button className="btn ghost small" type="button" onClick={() => goTo("my-pets")}>管理する</button>}>
          <div className="pet-card">
            <span className="pet-avatar">P</span>
            <strong>ポチ</strong>
            <p>柴犬 · オス · 3歳</p>
            <button className="btn ghost small" type="button" onClick={() => notify("ペット追加フォームを開きました")}>ペットを追加</button>
          </div>
        </Card>
      </div>
      {reportCards.length > 0 && (
        <Card title="最新の報告カード" action={<button className="btn ghost small" type="button" onClick={() => openReport(reportCards[0])}>すべて見る</button>}>
          <ReportCardRow report={reportCards[0]} onClick={() => openReport(reportCards[0])} />
        </Card>
      )}
    </Stack>
  );
}

function CarersPage({ openCarer }: { openCarer: (carer: Carer) => void }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("すべて");
  const filtered = useMemo(
    () =>
      carers.filter((carer) => {
        const matchesArea = area === "すべて" || carer.area === area;
        const matchesQuery = `${carer.name} ${carer.area} ${carer.services.join(" ")}`.includes(query);
        return matchesArea && matchesQuery;
      }),
    [area, query],
  );

  return (
    <Stack title="ケアラーを探す" subtitle="登録情報、資格、リピート率で比較できます。">
      <div className="filter-bar">
        <TextField label="検索" placeholder="名前・サービスで検索" value={query} onChange={setQuery} />
        <label className="field">
          <span>エリア</span>
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            <option>すべて</option>
            {areas.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>日付</span>
          <input type="date" />
        </label>
      </div>
      <p className="result-count">{filtered.length}件のケアラーが見つかりました</p>
      <div className="carer-grid">
        {filtered.map((carer) => <CarerCard key={carer.id} carer={carer} openCarer={openCarer} />)}
      </div>
    </Stack>
  );
}

function CarerCard({ carer, openCarer }: { carer: Carer; openCarer: (carer: Carer) => void }) {
  return (
    <article className="carer-card">
      <img src={carer.image} alt={`${carer.name}の活動イメージ`} />
      <div className="carer-body">
        <div className="carer-heading">
          <span className="avatar">{carer.avatar}</span>
          <div>
            <h3>{carer.name}</h3>
            <p>{carer.area} · 経験 {carer.exp}</p>
          </div>
        </div>
        <div className="license-box">
          <div className="license-box-head">
            <strong>{carer.license.type}</strong>
            {carer.license.verified
              ? <span className="verified-badge">✓ 確認済み</span>
              : <span className="pending-badge">確認中</span>}
          </div>
          <div className="license-num-row">登録番号: {carer.license.num}</div>
        </div>
        {carer.certs.length > 0 && (
          <div className="certs-section">
            <p className="certs-label">保有資格</p>
            <div className="pill-row">
              {carer.certs.map((cert) => <span key={cert}>{cert}</span>)}
            </div>
          </div>
        )}
        <RepeatRateBadge repeatRate={carer.repeatRate} repeatRateBase={carer.repeatRateBase} compact />
        <TrustScoreBadge carer={carer} compact />
        <div className="carer-meta">
          <strong>{carer.price}<span>/{carer.unit}</span></strong>
          <span>評価 {carer.rating}（{carer.reviews}件）</span>
        </div>
        <button className="btn primary small full card-action" type="button" onClick={() => openCarer(carer)}>
          プロフィールを見る
        </button>
      </div>
    </article>
  );
}

function CarerDetailPage({ carer, notify, goTo }: { carer: Carer; notify: (message: string) => void; goTo: (page: PageId) => void }) {
  const days = ["月", "火", "水", "木", "金", "土", "日"];
  const mgCompleted = meetAndGreetRequests.some(
    (r) => r.carerName === carer.name && r.status === "completed",
  );

  return (
    <Stack title={carer.name} subtitle={`${carer.area} · 経験 ${carer.exp} · 評価 ${carer.rating}（${carer.reviews}件）`}>
      <button className="btn ghost small back-button" type="button" onClick={() => goTo("carers")}>ケアラー一覧に戻る</button>
      <div className="profile-hero">
        <img src={carer.image} alt={`${carer.name}のプロフィール`} />
        <div>
          <div className="profile-title">
            <span className="avatar large">{carer.avatar}</span>
            <div>
              <h2>{carer.name}</h2>
              <p>評価 {carer.rating}（{carer.reviews}件）</p>
            </div>
          </div>
          <p>{carer.bio}</p>
          <RepeatRateBadge repeatRate={carer.repeatRate} repeatRateBase={carer.repeatRateBase} />
          <TrustScoreBadge carer={carer} />
          <div className="license-box prominent">
            <div className="license-box-head">
              <strong>{carer.license.type}</strong>
              {carer.license.verified
                ? <span className="verified-badge">✓ 確認済み</span>
                : <span className="pending-badge">確認中</span>}
            </div>
            <div className="license-num-row">登録番号: {carer.license.num}</div>
          </div>
          {carer.certs.length > 0 && (
            <div className="certs-section">
              <p className="certs-label">保有資格</p>
              <div className="pill-row">
                {carer.certs.map((cert) => <span key={cert}>{cert}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid-2">
        <Card title="信頼情報">
          <InfoList
            rows={[
              ["活動レポート", carer.reportStyle],
              ["Meet & Greet", carer.meetAndGreet],
              ["対応ペット", carer.pets.join(" / ")],
              ["対応サービス", carer.services.join(" / ")],
            ]}
          />
        </Card>
        <Card title="リクエスト">
          <div className="availability">
            {days.map((day, index) => (
              <span className={cx(carer.availability[index] && "open")} key={day}>{day}</span>
            ))}
          </div>
          <TextField label="希望日" type="date" />
          <label className="field">
            <span>サービス</span>
            <select>{carer.services.map((service) => <option key={service}>{service}</option>)}</select>
          </label>
          <label className="field">
            <span>メッセージ</span>
            <textarea placeholder="ペットの性格や面談希望日時を書いてください" />
          </label>
          {mgCompleted ? (
            <div className="mg-done-block">
              <span className="mg-done-badge">✓ Meet &amp; Greet完了</span>
              <button
                className="btn primary full"
                type="button"
                onClick={() => goTo("booking-estimate")}
              >
                初回予約へ進む（見積もり確認）
              </button>
              <button
                className="btn ghost full"
                type="button"
                onClick={() => goTo("meet-and-greet")}
              >
                Meet &amp; Greetを再リクエスト
              </button>
            </div>
          ) : (
            <div>
              <div className="mg-block-notice">
                <strong>初回予約にはMeet &amp; Greetが必要です</strong>
                <p>初回ケア前に必ず顔合わせを行います。Meet &amp; Greet完了後に予約へ進めます。</p>
              </div>
              <button
                className="btn primary full"
                type="button"
                onClick={() => goTo("meet-and-greet")}
              >
                Meet &amp; Greetをリクエストする
              </button>
            </div>
          )}
        </Card>
      </div>
    </Stack>
  );
}

function RequestsPage({ notify }: { notify: (message: string) => void }) {
  return (
    <Stack title="依頼掲示板" subtitle="飼い主からの依頼を閲覧し、有資格ケアラーとして応募できます。">
      <div className="tabs"><button className="active" type="button">すべて</button><button type="button">マイ依頼</button><button type="button">応募済み</button></div>
      <div className="request-list">
        {requests.map((request) => (
          <article className="request-card" key={request.id}>
            <div className="request-top">
              <div>
                <span className="pill warning">応募 {request.applies}件</span>
                <h3>{request.service} · {request.pet}</h3>
              </div>
              <strong>{request.price}</strong>
            </div>
            <p>{request.note}</p>
            <div className="inline-meta">
              <span>{request.date} {request.time}</span>
              <span>{request.area}</span>
              <span>{request.owner}</span>
            </div>
            <button className="btn primary small" type="button" onClick={() => notify(`${request.service}に応募しました`)}>
              この依頼に応募する
            </button>
          </article>
        ))}
      </div>
    </Stack>
  );
}

function MyPetsPage({ notify }: { notify: (message: string) => void }) {
  return (
    <Stack title="マイペット" subtitle="登録したペット情報は予約リクエストとMeet & Greetに自動で引き継がれます。">
      <div className="grid-3">
        <article className="pet-card big">
          <span className="pet-avatar">P</span>
          <strong>ポチ</strong>
          <p>柴犬 · オス · 3歳</p>
          <span>アレルギーなし。散歩中は引っ張り癖あり。</span>
          <button className="btn ghost small" type="button" onClick={() => notify("ペット情報を保存しました")}>編集</button>
        </article>
        <button className="add-card" type="button" onClick={() => notify("ペット追加フォームを開きました")}>
          <strong>ペットを追加</strong>
          <span>名前、写真、持病、ワクチン、緊急連絡先を登録</span>
        </button>
      </div>
    </Stack>
  );
}

function BookingsPage({
  goTo,
  notify,
  openReport,
}: {
  goTo: (page: PageId) => void;
  notify: (message: string) => void;
  openReport: (report: ReportCard) => void;
}) {
  return (
    <Stack title="予約管理" subtitle="Meet & Greet、予約、支払い、レビューまで一箇所で確認できます。">
      <div className="tabs"><button className="active" type="button">進行中</button><button type="button">確定済み</button><button type="button">完了済み</button></div>
      <div className="booking-list">
        {bookings.map((booking) => {
          const linkedReport = reportCards.find((r) => r.carerName === booking.carer && booking.status === "完了");
          return (
            <div className="booking-card" key={booking.carer + booking.date}>
              <BookingRow booking={booking} />
              <div className="row-actions">
                <button className="btn primary small" type="button" onClick={() => goTo("messages")}>チャット</button>
                {booking.status === "支払い待ち" && (
                  <button className="btn ghost small" type="button" onClick={() => goTo("payments")}>支払い</button>
                )}
                {booking.status === "完了" && (
                  <>
                    {linkedReport
                      ? <button className="btn ghost small" type="button" onClick={() => openReport(linkedReport)}>報告カードを見る</button>
                      : <button className="btn ghost small" type="button" onClick={() => notify("報告カードはまだ届いていません")}>報告カードを見る</button>
                    }
                    <button className="btn ghost small" type="button" onClick={() => notify("レビューを投稿しました")}>レビューを書く</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Stack>
  );
}

function MessagesPage({ notify }: { notify: (message: string) => void }) {
  const [messages, setMessages] = useState([
    { mine: false, text: "はじめまして。ポチちゃんの散歩代行、喜んで対応します。" },
    { mine: true, text: "初回なのでMeet & Greetからお願いできますか？" },
    { mine: false, text: "もちろんです。公園で30分ほど、性格や散歩ルートを確認しましょう。" },
  ]);
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    setMessages([...messages, { mine: true, text }]);
    setText("");
    notify("メッセージを送信しました");
  }

  return (
    <Stack title="メッセージ" subtitle="予約確定後の詳細調整、面談日程、鍵の受け渡し方法を安全に残せます。">
      <div className="message-layout">
        <aside>
          <button className="message-person active" type="button">さとう まりな<span>Meet & Greet調整中</span></button>
          <button className="message-person" type="button">きむら あいこ<span>宿泊ケア相談</span></button>
        </aside>
        <section>
          <div className="chat-stream">
            {messages.map((message, index) => (
              <div className={cx("bubble", message.mine && "mine")} key={index}>{message.text}</div>
            ))}
          </div>
          <div className="chat-input">
            <input value={text} onChange={(event) => setText(event.target.value)} placeholder="メッセージを入力..." />
            <button className="btn primary small" type="button" onClick={send}>送信</button>
          </div>
        </section>
      </div>
    </Stack>
  );
}

function CarerProfilePage({ notify }: { notify: (message: string) => void }) {
  return (
    <main className="standalone-page">
      <Stack title="ケアラー登録" subtitle="参加条件は行政確認中です。初期は第一種動物取扱業の登録状況を確認します。">
        <div className="notice-card">
          <strong>登録要件</strong>
          <p>登録証と本人確認書類の提出をお願いする想定です。審査目安と表示ルールは行政確認後に確定します。</p>
        </div>
        <div className="card form-card">
          <TextField label="表示名" placeholder="さとう まりな" />
          <label className="field">
            <span>自己紹介</span>
            <textarea placeholder="経験、得意なケア、ペットへの想いを書いてください" />
          </label>
          <label className="field">
            <span>活動エリア</span>
            <select>{areas.map((area) => <option key={area}>{area}</option>)}</select>
          </label>
          <div className="notice-card notice-muted">
            <strong>表示について</strong>
            <p>登録番号・登録種別は行政確認後にプロフィールへ掲載します。確認前は「確認中」と表示されます。</p>
          </div>
          <TextField label="第一種動物取扱業 登録番号" placeholder="例：神奈川県 第12-0000号" />
          <label className="field">
            <span>登録種別</span>
            <select>
              <option>保管</option>
              <option>訓練</option>
              <option>保管・訓練</option>
              <option>確認中</option>
            </select>
          </label>
          <TextField label="登録証の有効期限" type="date" />
          <div className="checkbox-grid">
            {services.map((service) => (
              <label key={service.id}><input type="checkbox" /> {service.title}</label>
            ))}
          </div>
          <div className="form-row">
            <TextField label="時給（円）" type="number" placeholder="3000" />
            <TextField label="宿泊料金（円）" type="number" placeholder="20000" />
          </div>
          <label className="field">
            <span>経験・資格</span>
            <textarea placeholder="ペットシッター経験、飼育経験、保有資格など" />
          </label>
          <button className="btn primary full" type="button" onClick={() => notify("審査申請を受け付けました")}>
            審査を申請する
          </button>
        </div>
      </Stack>
      <Footer goTo={() => undefined} />
    </main>
  );
}

type AdminTabId = "overview" | "review" | "carers-admin" | "bookings-admin" | "incidents" | "payments";

const adminTabs: Array<{ id: AdminTabId; label: string; count?: string }> = [
  { id: "overview", label: "概要" },
  { id: "review", label: "審査", count: "3" },
  { id: "carers-admin", label: "ケアラー" },
  { id: "bookings-admin", label: "予約", count: "2" },
  { id: "incidents", label: "事故・問い合わせ", count: "3" },
  { id: "payments", label: "決済", count: "2" },
];

function AdminPage({ notify }: { notify: (message: string) => void }) {
  const [activeTab, setActiveTab] = useState<AdminTabId>("overview");
  const [query, setQuery] = useState("");
  const filteredApplicants = useMemo(
    () =>
      adminApplicants.filter((applicant) =>
        `${applicant.name} ${applicant.area} ${applicant.services} ${applicant.license} ${applicant.cert}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-hero">
          <div>
            <p className="admin-kicker">Operation cockpit</p>
            <h1>管理パネル</h1>
            <p>
              審査、予約例外、問い合わせ、決済を一画面で拾い上げる運営用ダッシュボードです。
              PawMateの信頼を守るための未対応タスクを先頭に集約します。
            </p>
          </div>
          <div className="admin-today">
            <span>今日の運営判断</span>
            <strong>審査1件は承認可能、宿泊1件は保管業確認待ち</strong>
            <button className="btn ghost small" type="button" onClick={() => notify("本日の対応ログを作成しました")}>
              対応ログを作成
            </button>
          </div>
        </div>

        <div className="admin-metrics-grid">
          {adminMetrics.map((metric) => <AdminMetricCard key={metric.label} metric={metric} />)}
        </div>

        <div className="admin-tabs" role="tablist" aria-label="管理メニュー">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              className={cx(activeTab === tab.id && "active")}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.count && <b>{tab.count}</b>}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <AdminOverviewPanel notify={notify} setActiveTab={setActiveTab} />}
        {activeTab === "review" && (
          <AdminReviewPanel applicants={filteredApplicants} query={query} setQuery={setQuery} notify={notify} />
        )}
        {activeTab === "carers-admin" && <AdminCarersPanel notify={notify} />}
        {activeTab === "bookings-admin" && <AdminBookingsPanel notify={notify} />}
        {activeTab === "incidents" && <AdminIncidentsPanel notify={notify} />}
        {activeTab === "payments" && <AdminPaymentsPanel notify={notify} />}
      </section>
    </main>
  );
}

function AdminMetricCard({ metric }: { metric: (typeof adminMetrics)[number] }) {
  return (
    <article className={cx("admin-metric-card", `tone-${metric.tone}`)}>
      <span className="admin-metric-icon" aria-hidden="true" />
      <strong>{metric.value}</strong>
      <p>{metric.label}</p>
      <small>{metric.helper}</small>
    </article>
  );
}

function AdminOverviewPanel({
  notify,
  setActiveTab,
}: {
  notify: (message: string) => void;
  setActiveTab: (tab: AdminTabId) => void;
}) {
  return (
    <div className="admin-overview-grid">
      <section className="admin-block">
        <AdminSectionHeader title="優先キュー" caption="人が判断すべきものだけを上に出します。" />
        <div className="admin-task-list">
          {adminTasks.map((task) => (
            <div className="admin-task-row" key={task.title}>
              <span className={cx("admin-severity", task.severity === "高" && "high", task.severity === "中" && "medium")}>
                {task.severity}
              </span>
              <div>
                <strong>{task.title}</strong>
                <p>{task.owner} · {task.due}</p>
              </div>
              <button className="admin-icon-button" type="button" aria-label={`${task.title}を開く`} onClick={() => notify(`${task.title}を開きました`)}>
                →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-block">
        <AdminSectionHeader title="運営ヘルス" caption="供給、予約、信頼品質の異常値を確認します。" />
        <div className="admin-health-grid">
          <div><span>リピート率</span><strong>86%</strong><small>前月 +3pt</small></div>
          <div><span>予約成約率</span><strong>42%</strong><small>面談後が強い</small></div>
          <div><span>平均返信</span><strong>21分</strong><small>目標30分以内</small></div>
          <div><span>事故率</span><strong>0.4%</strong><small>重大事故 0件</small></div>
        </div>
      </section>

      <section className="admin-block wide">
        <AdminSectionHeader title="次に見るべき画面" caption="Base44案の分かりやすさを残しつつ、例外処理まで広げています。" />
        <div className="admin-next-actions">
          <button type="button" onClick={() => setActiveTab("review")}>
            <strong>審査を片付ける</strong>
            <span>登録証、本人確認、保管業有無をチェック</span>
          </button>
          <button type="button" onClick={() => setActiveTab("bookings-admin")}>
            <strong>予約例外を見る</strong>
            <span>支払い待ち、面談調整、キャンセルを確認</span>
          </button>
          <button type="button" onClick={() => setActiveTab("payments")}>
            <strong>決済を締める</strong>
            <span>返金、振込、手数料、再認証を処理</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function AdminReviewPanel({
  applicants,
  query,
  setQuery,
  notify,
}: {
  applicants: typeof adminApplicants;
  query: string;
  setQuery: (query: string) => void;
  notify: (message: string) => void;
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <AdminSectionHeader title="ケアラー審査" caption="承認前に、資格・登録種別・本人確認・公開文面を確認します。" />
        <label className="admin-search">
          <span>検索</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="名前、エリア、資格で検索" />
        </label>
      </div>

      <div className="admin-review-list">
        {applicants.map((applicant) => (
          <article className={cx("admin-review-card", applicant.risk === "中" && "needs-check")} key={applicant.name}>
            <div className="admin-applicant-main">
              <span className="admin-avatar">{applicant.name.slice(0, 1)}</span>
              <div>
                <div className="admin-applicant-title">
                  <h2>{applicant.name}</h2>
                  <AdminStatusPill tone={applicant.risk === "低" ? "green" : "amber"}>{applicant.status}</AdminStatusPill>
                </div>
                <p>{applicant.area} · 申請日 {applicant.date}</p>
                <div className="admin-chip-row">
                  {applicant.services.split(" / ").map((service) => <span key={service}>{service}</span>)}
                </div>
              </div>
            </div>

            <div className="admin-applicant-detail">
              <div>
                <span>登録番号</span>
                <strong>{applicant.license}</strong>
                <small>種別: {applicant.licenseType} / 有効期限: {applicant.licenseExpiry}</small>
              </div>
              <div>
                <span>資格</span>
                <strong>{applicant.cert}</strong>
                <small>{applicant.identity}</small>
              </div>
              <div>
                <span>審査スコア</span>
                <strong>{applicant.score}/100</strong>
                <small>リスク: {applicant.risk}</small>
              </div>
            </div>

            <p className="admin-memo">{applicant.memo}</p>

            <div className="admin-card-actions">
              <button className="btn primary small" type="button" onClick={() => notify(`${applicant.name}を承認しました`)}>
                承認
              </button>
              <button className="btn ghost small" type="button" onClick={() => notify(`${applicant.name}に差し戻し依頼を送りました`)}>
                差し戻し
              </button>
              <button className="admin-text-button" type="button" onClick={() => notify(`${applicant.name}の審査メモを保存しました`)}>
                メモ保存
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminCarersPanel({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="admin-panel">
      <AdminSectionHeader title="ケアラー品質管理" caption="公開中ケアラーの品質指標と供給状態を確認します。" />
      <div className="admin-table-shell">
        <table>
          <thead>
            <tr>
              <th>ケアラー</th>
              <th>エリア</th>
              <th>評価</th>
              <th>リピート</th>
              <th>登録情報</th>
              <th>品質シグナル</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {carers.slice(0, 5).map((carer, index) => {
              const quality = adminQualityRows[index % adminQualityRows.length];
              return (
                <tr key={carer.id}>
                  <td><strong>{carer.name}</strong><small>{carer.services.join(" / ")}</small></td>
                  <td>{carer.area}</td>
                  <td>{carer.rating}<small>{carer.reviews}件</small></td>
                  <td>{carer.repeatRate}<small>キャンセル {quality.cancelRate}</small></td>
                  <td>{carer.license.num}<small>{carer.license.type}</small></td>
                  <td><AdminStatusPill tone={quality.signal === "確認" ? "amber" : "green"}>{quality.signal}</AdminStatusPill></td>
                  <td>
                    <button className="btn ghost small" type="button" onClick={() => notify(`${carer.name}の公開プロフィールを確認しました`)}>
                      確認
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminBookingsPanel({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="admin-panel">
      <AdminSectionHeader title="予約管理" caption="予約、Meet & Greet、支払い、日程再調整を運営側で追跡します。" />
      <div className="admin-booking-list">
        {adminBookingRows.map((booking) => (
          <article className={cx("admin-booking-row", booking.risk === "要介入" && "attention")} key={booking.id}>
            <div>
              <span className="admin-record-id">{booking.id}</span>
              <h2>{booking.service} · {booking.pet}</h2>
              <p>{booking.owner} → {booking.carer}</p>
            </div>
            <div>
              <span>日時</span>
              <strong>{booking.schedule}</strong>
            </div>
            <div>
              <span>決済</span>
              <strong>{booking.amount}</strong>
              <small>{booking.payment}</small>
            </div>
            <div>
              <AdminStatusPill tone={booking.risk === "要介入" ? "coral" : "green"}>{booking.status}</AdminStatusPill>
              <button className="btn ghost small" type="button" onClick={() => notify(`${booking.id}の予約詳細を開きました`)}>
                詳細
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminIncidentsPanel({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="admin-panel">
      <AdminSectionHeader title="事故・問い合わせ" caption="問い合わせ、品質確認、レビュー監視を対応履歴として残します。" />
      <div className="admin-table-shell">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>内容</th>
              <th>種別</th>
              <th>関係者</th>
              <th>重要度</th>
              <th>更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {adminIncidentRows.map((incident) => (
              <tr key={incident.id}>
                <td>{incident.id}</td>
                <td><strong>{incident.title}</strong><small>{incident.status}</small></td>
                <td>{incident.type}</td>
                <td>{incident.owner}<small>{incident.carer}</small></td>
                <td><AdminStatusPill tone={incident.severity === "中" ? "amber" : "blue"}>{incident.severity}</AdminStatusPill></td>
                <td>{incident.updated}</td>
                <td>
                  <button className="btn ghost small" type="button" onClick={() => notify(`${incident.id}の対応履歴を開きました`)}>
                    開く
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminPaymentsPanel({ notify }: { notify: (message: string) => void }) {
  return (
    <section className="admin-panel">
      <AdminSectionHeader title="決済・返金・振込" caption="Stripe Connect連携を想定した、保留・返金・振込予定の確認画面です。" />
      <div className="admin-payment-grid">
        {adminPaymentRows.map((payment) => (
          <article className="admin-payment-card" key={payment.id}>
            <span className="admin-record-id">{payment.id}</span>
            <h2>{payment.title}</h2>
            <p>{payment.user}</p>
            <div className="admin-money-row">
              <div><span>金額</span><strong>{payment.amount}</strong></div>
              <div><span>手数料</span><strong>{payment.fee}</strong></div>
            </div>
            <AdminStatusPill tone={payment.status === "要対応" ? "coral" : payment.status === "処理済み" ? "green" : "blue"}>
              {payment.status}
            </AdminStatusPill>
            <p className="admin-memo">{payment.detail}</p>
            <button className="btn ghost small full" type="button" onClick={() => notify(`${payment.id}の決済ログを開きました`)}>
              決済ログを見る
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminSectionHeader({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="admin-section-header">
      <h2>{title}</h2>
      <p>{caption}</p>
    </div>
  );
}

function AdminStatusPill({ tone, children }: { tone: "green" | "amber" | "blue" | "coral"; children: ReactNode }) {
  return <span className={cx("admin-status", `tone-${tone}`)}>{children}</span>;
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">PawMate</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

function Stack({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="page-stack">
      <div className="page-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="section-header">
      <p>{label}</p>
      <h2>{title}</h2>
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <div className="booking-row">
      <span className="avatar small-avatar">{booking.carer.slice(0, 1)}</span>
      <div>
        <strong>{booking.carer}</strong>
        <p>
          {booking.service} · {booking.date} · {booking.pet}
          {booking.petCount >= 2 && <span className="multi-pet-badge">{booking.petCount}頭</span>}
        </p>
      </div>
      <div>
        <span className="pill success">{booking.status}</span>
        <strong>{booking.price}</strong>
        {booking.multiPetDiscount > 0 && (
          <span className="discount-badge">複数頭-¥{booking.multiPetDiscount.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
}

const REPEAT_RATE_MIN_BASE = 5;

function RepeatRateBadge({
  repeatRate,
  repeatRateBase,
  compact = false,
}: {
  repeatRate: string;
  repeatRateBase: number | null;
  compact?: boolean;
}) {
  const hasEnoughData = repeatRateBase !== null && repeatRateBase >= REPEAT_RATE_MIN_BASE;
  const pct = hasEnoughData ? parseInt(repeatRate, 10) : 0;

  if (compact) {
    return (
      <div className="repeat-rate-compact">
        {hasEnoughData ? (
          <>
            <span className="repeat-rate-label">リピート率</span>
            <span className="repeat-rate-value">{repeatRate}</span>
            <div className="repeat-rate-bar-wrap">
              <div className="repeat-rate-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </>
        ) : (
          <span className="repeat-rate-pending">
            リピート率 — データ蓄積中
            {repeatRateBase !== null && ` (${repeatRateBase}件)`}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="repeat-rate-block">
      <div className="repeat-rate-block-head">
        <span className="repeat-rate-block-label">リピート率</span>
        {hasEnoughData
          ? <span className="repeat-rate-block-value">{repeatRate}</span>
          : <span className="repeat-rate-block-pending">データ蓄積中</span>}
      </div>
      {hasEnoughData ? (
        <>
          <div className="repeat-rate-bar-wrap full">
            <div className="repeat-rate-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="repeat-rate-hint">
            {repeatRateBase?.toLocaleString()}件の完了ケアをもとに算出。
            同じケアラーに2回以上予約した割合です。
          </p>
        </>
      ) : (
        <p className="repeat-rate-hint pending">
          {repeatRateBase !== null && repeatRateBase > 0
            ? `まだ${repeatRateBase}件のケア実績です。5件以上になると表示されます。`
            : "まだケア実績がないため、スコアを表示していません。"}
        </p>
      )}
    </div>
  );
}

function InfoList({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="info-list">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TextField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={(event) => onChange?.(event.target.value)} />
    </label>
  );
}

function Footer({ goTo }: { goTo: (page: PageId) => void }) {
  return (
    <footer className="footer">
      <div>
        <strong>PawMate</strong>
        <p>湘南エリア発、有資格プロと飼い主をつなぐ信頼可視化型ペットケアプラットフォーム。</p>
      </div>
      <div>
        <h4>サービス</h4>
        <button type="button" onClick={() => goTo("carers")}>ケアラーを探す</button>
        <button type="button" onClick={() => goTo("requests")}>依頼を探す</button>
        <button type="button" onClick={() => goTo("carer-profile")}>プロとして参加</button>
      </div>
      <div>
        <h4>サポート</h4>
        <span>よくある質問</span>
        <span>お問い合わせ</span>
        <span>プライバシーポリシー</span>
      </div>
    </footer>
  );
}

function PaymentsPage({ notify }: { notify: (message: string) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "connect" | "history">("overview");

  const totalGross = paymentRecords.reduce((s, r) => s + r.grossAmount, 0);
  const totalFees = paymentRecords.reduce((s, r) => s + r.platformFee, 0);
  const totalPayout = paymentRecords.reduce((s, r) => s + r.carerPayout, 0);
  const activeAccounts = connectAccounts.filter((a) => a.status === "active").length;

  return (
    <Stack title="決済・Stripe Connect" subtitle="飼い主の支払い、ケアラーへの分配、返金フローを管理します。">
      <div className="notice-card notice-muted">
        <strong>本番接続待ち（P0-006 保険目処が立ち次第）</strong>
        <p>
          現在はプロトタイプとして設計確認モードです。手数料設計: 飼い主側7%、プラットフォーム手数料25%（売上ベース）、ケアラー取り分75%。
          Stripe Connect Express を想定。本番接続は保険スキーム確定後。
        </p>
      </div>

      <div className="stats-grid">
        <Stat value={`¥${totalGross.toLocaleString()}`} label="合計売上（グロス）" />
        <Stat value={`¥${totalFees.toLocaleString()}`} label="プラットフォーム手数料" />
        <Stat value={`¥${totalPayout.toLocaleString()}`} label="ケアラー振込合計" />
        <Stat value={String(activeAccounts)} label="Connect済みケアラー" />
      </div>

      <div className="tabs">
        {([["overview", "概要"], ["connect", "Connect アカウント"], ["history", "決済履歴"]] as const).map(([id, label]) => (
          <button key={id} className={cx(activeTab === id && "active")} type="button" onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="payments-overview">
          <Card title="手数料設計">
            <dl className="info-list">
              <div><dt>飼い主側手数料（サービスフィー）</dt><dd>{(stripeConfig.ownerServiceFee * 100).toFixed(0)}%</dd></div>
              <div><dt>プラットフォーム手数料（売上ベース）</dt><dd>{(stripeConfig.platformFeeRate * 100).toFixed(0)}%</dd></div>
              <div><dt>ケアラー取り分</dt><dd>{(stripeConfig.carerNetRate * 100).toFixed(0)}%</dd></div>
              <div><dt>振込タイミング</dt><dd>ケア完了後{stripeConfig.holdDays}営業日</dd></div>
              <div><dt>Connect 方式</dt><dd>Stripe Connect Express（ケアラーが自分でダッシュボード管理）</dd></div>
              <div><dt>エスクロー相当</dt><dd>Stripe の Separate Charges + Transfers で代替。手動 capture を使いケア完了後に確定</dd></div>
            </dl>
          </Card>
          <Card title="返金ポリシー">
            <dl className="info-list">
              <div><dt>48時間前キャンセル</dt><dd>全額返金</dd></div>
              <div><dt>24時間前キャンセル</dt><dd>50% 返金</dd></div>
              <div><dt>当日キャンセル</dt><dd>返金なし（ケアラーに30%補償）</dd></div>
              <div><dt>ケアラー都合キャンセル</dt><dd>飼い主に全額返金、ペナルティログを記録</dd></div>
            </dl>
          </Card>
        </div>
      )}

      {activeTab === "connect" && (
        <div className="connect-list">
          {connectAccounts.map((account) => (
            <article className="connect-card" key={account.carerName}>
              <div className="connect-card-left">
                <span className="avatar">{account.carerAvatar}</span>
                <div>
                  <strong>{account.carerName}</strong>
                  <p>{account.email}</p>
                </div>
              </div>
              <div className="connect-card-status">
                <span className={cx("connect-badge", account.status === "active" ? "active" : account.status === "pending" ? "pending" : "inactive")}>
                  {account.status === "active" ? "接続済み" : account.status === "pending" ? "審査中" : "未接続"}
                </span>
                <small>支払い: {account.chargesEnabled ? "有効" : "無効"} / 振込: {account.payoutsEnabled ? "有効" : "無効"}</small>
                {account.onboardedAt && <small>接続日: {account.onboardedAt}</small>}
              </div>
              <div className="connect-card-actions">
                {account.status === "active"
                  ? <button className="btn ghost small" type="button" onClick={() => notify(`${account.carerName}の Connect ダッシュボードを開きました`)}>ダッシュボード</button>
                  : <button className="btn primary small" type="button" onClick={() => notify(`${account.carerName}にオンボーディングリンクを送信しました`)}>招待を送る</button>
                }
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="admin-table-shell">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>サービス</th>
                <th>グロス</th>
                <th>手数料</th>
                <th>ケアラー</th>
                <th>決済</th>
                <th>振込</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {paymentRecords.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.id}</td>
                  <td>
                    <strong>{rec.service}</strong>
                    <small>{rec.ownerName} → {rec.carerName}</small>
                  </td>
                  <td>¥{rec.grossAmount.toLocaleString()}</td>
                  <td>¥{rec.platformFee.toLocaleString()}</td>
                  <td>¥{rec.carerPayout.toLocaleString()}</td>
                  <td>
                    <AdminStatusPill tone={rec.status === "captured" ? "green" : rec.status === "pending" ? "amber" : rec.status === "refunded" ? "blue" : "coral"}>
                      {rec.status === "captured" ? "決済済み" : rec.status === "pending" ? "保留" : rec.status === "refunded" ? "返金済み" : "失敗"}
                    </AdminStatusPill>
                  </td>
                  <td>
                    <AdminStatusPill tone={rec.transferStatus === "transferred" ? "green" : rec.transferStatus === "scheduled" ? "blue" : "amber"}>
                      {rec.transferStatus === "transferred" ? "振込済み" : rec.transferStatus === "scheduled" ? `${rec.transferAt}振込` : "保留"}
                    </AdminStatusPill>
                  </td>
                  <td>
                    <button className="btn ghost small" type="button" onClick={() => notify(`${rec.id}の決済詳細を開きました`)}>詳細</button>
                    {rec.status !== "refunded" && (
                      <button className="btn ghost small" type="button" onClick={() => notify(`${rec.id}の返金処理を開始しました`)}>返金</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Stack>
  );
}

function ReportCardRow({ report, onClick }: { report: ReportCard; onClick: () => void }) {
  const moodColor: Record<ReportCard["mood"], "green" | "amber" | "coral" | "blue"> = {
    元気: "green",
    普通: "blue",
    "少し不安": "amber",
    要注意: "coral",
  };
  return (
    <button className="report-card-row" type="button" onClick={onClick}>
      <div className="report-card-row-left">
        <span className="avatar small-avatar">{report.carerAvatar}</span>
        <div>
          <strong>{report.carerName} → {report.petName}</strong>
          <p>{report.service} · {report.date}</p>
        </div>
      </div>
      <div className="report-card-row-right">
        <AdminStatusPill tone={moodColor[report.mood]}>{report.mood}</AdminStatusPill>
        <span className="report-card-status">{report.status === "sent" ? "未読" : report.status === "read" ? "既読" : "下書き"}</span>
      </div>
    </button>
  );
}

function ReportCardViewPage({ report, goTo }: { report: ReportCard; goTo: (page: PageId) => void }) {
  const [carerMode, setCarerMode] = useState(false);
  const moodColorMap: Record<ReportCard["mood"], string> = {
    元気: "var(--shonan-green)",
    普通: "var(--deep-ocean)",
    "少し不安": "#d97706",
    要注意: "var(--coral)",
  };

  if (carerMode) {
    return <ReportCardSubmitPage report={report} goTo={goTo} onBack={() => setCarerMode(false)} />;
  }

  return (
    <Stack title="報告カード" subtitle={`${report.service} · ${report.date} · ${report.startTime}〜${report.endTime}`}>
      <button className="btn ghost small back-button" type="button" onClick={() => goTo("my-bookings")}>
        予約管理に戻る
      </button>
      <button className="btn ghost small back-button" style={{ marginLeft: "8px" }} type="button" onClick={() => setCarerMode(true)}>
        ケアラー入力画面（デモ）
      </button>

      <div className="report-view-grid">
        <div className="report-main">
          <section className="report-section">
            <h2 className="report-section-title">ケア概要</h2>
            <div className="report-summary-row">
              <div className="report-summary-item">
                <span>気分・状態</span>
                <strong style={{ color: moodColorMap[report.mood] }}>{report.mood}</strong>
              </div>
              <div className="report-summary-item">
                <span>食事</span>
                <strong>{report.meal}</strong>
              </div>
              <div className="report-summary-item">
                <span>排泄</span>
                <strong>{report.toilet || "記録なし"}</strong>
              </div>
            </div>
            {report.notes && (
              <div className="report-notes">
                <p className="report-notes-label">ケアラーより</p>
                <p>{report.notes}</p>
              </div>
            )}
            {report.alerts && (
              <div className="report-alert-box">
                <strong>注意事項</strong>
                <p>{report.alerts}</p>
              </div>
            )}
          </section>

          {report.photos.length > 0 && (
            <section className="report-section">
              <h2 className="report-section-title">写真（{report.photos.length}枚）</h2>
              <div className="report-photo-grid">
                {report.photos.map((photo, index) => (
                  <figure className="report-photo" key={index}>
                    <img src={photo.url} alt={photo.caption} />
                    <figcaption>{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="report-sidebar">
          {report.gps && (
            <section className="report-section">
              <h2 className="report-section-title">散歩ルート（GPS）</h2>
              <div className="report-map-placeholder">
                <div className="report-map-icon">📍</div>
                <strong>{report.gps.routeLabel}</strong>
                <p className="report-map-coords">
                  {report.gps.lat.toFixed(4)}, {report.gps.lng.toFixed(4)} 付近
                </p>
                <p className="report-map-note">本番では Google Maps / Mapbox に切り替えます</p>
              </div>
            </section>
          )}

          <section className="report-section">
            <h2 className="report-section-title">詳細情報</h2>
            <dl className="info-list">
              <div><dt>担当ケアラー</dt><dd>{report.carerName}</dd></div>
              <div><dt>ペット</dt><dd>{report.petName}</dd></div>
              <div><dt>サービス</dt><dd>{report.service}</dd></div>
              <div><dt>日時</dt><dd>{report.date} {report.startTime}〜{report.endTime}</dd></div>
              <div><dt>予約ID</dt><dd>{report.bookingId}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </Stack>
  );
}

function ReportCardSubmitPage({
  report,
  goTo,
  onBack,
}: {
  report: ReportCard;
  goTo: (page: PageId) => void;
  onBack: () => void;
}) {
  const [mood, setMood] = useState<ReportCard["mood"]>(report.mood);
  const [meal, setMeal] = useState<ReportCard["meal"]>(report.meal);
  const [toilet, setToilet] = useState(report.toilet);
  const [notes, setNotes] = useState(report.notes);
  const [alerts, setAlerts] = useState(report.alerts);
  const [gpsRecorded, setGpsRecorded] = useState(!!report.gps);
  const [photoCount, setPhotoCount] = useState(report.photos.length);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Stack title="報告カード送信完了" subtitle="飼い主に通知を送りました。">
        <div className="report-submitted">
          <div className="report-submitted-icon">✓</div>
          <h2>送信しました</h2>
          <p>
            {report.petName}ちゃんの報告カードを飼い主に送りました。<br />
            GPS、写真、ケアメモが含まれています。
          </p>
          <div className="report-submitted-summary">
            <div><span>気分・状態</span><strong>{mood}</strong></div>
            <div><span>GPS記録</span><strong>{gpsRecorded ? "あり" : "なし"}</strong></div>
            <div><span>写真</span><strong>{photoCount}枚</strong></div>
          </div>
          <button className="btn primary" type="button" onClick={onBack}>
            報告カードを確認する
          </button>
        </div>
      </Stack>
    );
  }

  return (
    <Stack title="報告カードを送る" subtitle={`${report.petName} · ${report.service} · ${report.date}`}>
      <button className="btn ghost small back-button" type="button" onClick={onBack}>
        飼い主ビューに戻る
      </button>

      <div className="card form-card">
        <div className="report-form-section">
          <p className="report-form-label">今日の気分・状態</p>
          <div className="report-mood-grid">
            {(["元気", "普通", "少し不安", "要注意"] as ReportCard["mood"][]).map((m) => (
              <button
                key={m}
                className={cx("report-mood-btn", mood === m && "selected")}
                type="button"
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="report-form-row">
          <label className="field">
            <span>食事</span>
            <select value={meal} onChange={(e) => setMeal(e.target.value as ReportCard["meal"])}>
              <option>完食</option>
              <option>半分</option>
              <option>食べず</option>
              <option>なし</option>
            </select>
          </label>
          <label className="field">
            <span>排泄の記録</span>
            <input
              type="text"
              value={toilet}
              onChange={(e) => setToilet(e.target.value)}
              placeholder="例：散歩中に1回（固形・正常）"
            />
          </label>
        </div>

        <label className="field">
          <span>ケアメモ（飼い主に伝えること）</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="今日の様子・気になったこと・良かった点など" />
        </label>

        <label className="field">
          <span>注意事項（要対応がある場合のみ）</span>
          <textarea value={alerts} onChange={(e) => setAlerts(e.target.value)} placeholder="例：左後脚を少しかばっている様子がありました" />
        </label>

        <div className="report-attach-row">
          <button
            className={cx("report-attach-btn", gpsRecorded && "attached")}
            type="button"
            onClick={() => setGpsRecorded(!gpsRecorded)}
          >
            <span className="report-attach-icon">📍</span>
            <div>
              <strong>{gpsRecorded ? "GPS記録済み" : "GPSを記録"}</strong>
              <p>{gpsRecorded ? "散歩ルートを添付します" : "現在地情報を自動取得"}</p>
            </div>
            {gpsRecorded && <span className="report-attach-check">✓</span>}
          </button>

          <button
            className={cx("report-attach-btn", photoCount > 0 && "attached")}
            type="button"
            onClick={() => setPhotoCount(photoCount > 0 ? 0 : report.photos.length)}
          >
            <span className="report-attach-icon">📷</span>
            <div>
              <strong>{photoCount > 0 ? `写真 ${photoCount}枚` : "写真を添付"}</strong>
              <p>{photoCount > 0 ? "タップして追加・削除" : "ケアの様子を送ります"}</p>
            </div>
            {photoCount > 0 && <span className="report-attach-check">✓</span>}
          </button>
        </div>

        <button className="btn primary full" type="button" onClick={() => setSubmitted(true)}>
          報告カードを送信する
        </button>
      </div>
    </Stack>
  );
}

/* ── Meet & Greet予約フロー (PM-RM-P1-010) ── */

type MGStep = "request" | "carer-review" | "scheduled" | "done";

const mgStepOrder: MGStep[] = ["request", "carer-review", "scheduled", "done"];

const mgStepLabels: Record<MGStep, string> = {
  request: "① リクエスト",
  "carer-review": "② ケアラー確認",
  scheduled: "③ 日程確定",
  done: "④ 完了",
};

function MeetAndGreetPage({
  carer,
  goTo,
  notify,
}: {
  carer: Carer;
  goTo: (page: PageId) => void;
  notify: (message: string) => void;
}) {
  const [step, setStep] = useState<MGStep>("request");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [petInfo, setPetInfo] = useState("ポチ（柴犬・3歳）");
  const [petCount, setPetCount] = useState(1);
  const [intro, setIntro] = useState("");
  const [confirmedDate, setConfirmedDate] = useState("");

  function advance(next: MGStep) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmitRequest() {
    if (!date1 && !date2 && !date3) {
      notify("希望日時を1つ以上入力してください");
      return;
    }
    advance("carer-review");
  }

  function handleCarerApprove() {
    setConfirmedDate(date1 || date2 || date3 || "未定");
    advance("scheduled");
  }

  function formatDatetime(dt: string) {
    if (!dt) return "—";
    try {
      return new Date(dt).toLocaleString("ja-JP", {
        month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit",
      });
    } catch {
      return dt;
    }
  }

  return (
    <Stack
      title="Meet & Greetリクエスト"
      subtitle={`${carer.name}さんへ初回面談をリクエストします`}
    >
      <button className="btn ghost small back-button" type="button" onClick={() => goTo("carer-detail")}>
        プロフィールに戻る
      </button>

      <div className="mg-step-bar">
        {mgStepOrder.map((s) => {
          const idx = mgStepOrder.indexOf(s);
          const currentIdx = mgStepOrder.indexOf(step);
          return (
            <div
              key={s}
              className={cx("mg-step", step === s && "active", currentIdx > idx && "passed")}
            >
              <span>{mgStepLabels[s]}</span>
            </div>
          );
        })}
      </div>

      {step === "request" && (
        <div className="card form-card">
          <p className="form-section-label">希望日時（3候補まで入力してください）</p>
          <div className="mg-date-grid">
            <label className="field">
              <span>第1希望</span>
              <input type="datetime-local" value={date1} onChange={(e) => setDate1(e.target.value)} />
            </label>
            <label className="field">
              <span>第2希望（任意）</span>
              <input type="datetime-local" value={date2} onChange={(e) => setDate2(e.target.value)} />
            </label>
            <label className="field">
              <span>第3希望（任意）</span>
              <input type="datetime-local" value={date3} onChange={(e) => setDate3(e.target.value)} />
            </label>
          </div>
          <p className="form-section-label">ペット情報</p>
          <label className="field">
            <span>ペット名・種別・年齢</span>
            <input
              type="text"
              value={petInfo}
              onChange={(e) => setPetInfo(e.target.value)}
              placeholder="例：ポチ（柴犬・3歳）"
            />
          </label>
          <label className="field">
            <span>頭数</span>
            <select value={petCount} onChange={(e) => setPetCount(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}頭{n >= 2 ? "（2頭目以降10%オフ）" : ""}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>自己紹介・確認事項メモ</span>
            <textarea
              rows={4}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="ペットの性格・持病・アレルギー・鍵の受け渡し方法など、事前に確認したいことを書いてください"
            />
          </label>
          <div className="notice-card notice-muted">
            <strong>Meet &amp; Greetについて</strong>
            <p>
              初回ケアの前に必ず30〜60分の顔合わせを行います。
              ペットの性格・生活動線・緊急連絡先・鍵の受け渡し方法を確認します。
              Meet &amp; Greet完了後に初回予約へ進めます。
            </p>
          </div>
          <button className="btn primary full" type="button" onClick={handleSubmitRequest}>
            リクエストを送る
          </button>
        </div>
      )}

      {step === "carer-review" && (
        <div>
          <div className="notice-card" style={{ marginBottom: "16px" }}>
            <strong>ケアラー確認画面（デモ）</strong>
            <p>
              実際はケアラーへ通知が届き、ケアラー側のアプリで承認/辞退を操作します。
              プロトタイプでは下のボタンで操作をシミュレートできます。
            </p>
          </div>
          <div className="card form-card">
            <h2 className="mg-review-title">リクエスト内容の確認</h2>
            <dl className="info-list">
              <div><dt>飼い主</dt><dd>田中 美咲</dd></div>
              <div><dt>ペット</dt><dd>{petInfo}</dd></div>
              <div><dt>頭数</dt><dd>{petCount}頭</dd></div>
              <div><dt>第1希望</dt><dd>{formatDatetime(date1)}</dd></div>
              {date2 && <div><dt>第2希望</dt><dd>{formatDatetime(date2)}</dd></div>}
              {date3 && <div><dt>第3希望</dt><dd>{formatDatetime(date3)}</dd></div>}
              <div><dt>メモ</dt><dd>{intro || "—"}</dd></div>
            </dl>
            <div className="mg-action-row">
              <button className="btn primary" type="button" onClick={handleCarerApprove}>
                承認する
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => { notify("辞退しました（デモ）"); goTo("carers"); }}
              >
                辞退する
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "scheduled" && (
        <div className="card form-card">
          <div className="mg-confirmed-icon">✓</div>
          <h2 className="mg-review-title" style={{ textAlign: "center" }}>日程が確定しました</h2>
          <p style={{ color: "var(--muted)", marginBottom: "16px", textAlign: "center" }}>
            {carer.name}さんがリクエストを承認しました。
          </p>
          <div className="mg-confirmed-date">
            <span>確定日時</span>
            <strong>{formatDatetime(confirmedDate)}</strong>
          </div>
          <dl className="info-list">
            <div><dt>場所</dt><dd>茅ヶ崎エリア（メッセージで詳細を調整してください）</dd></div>
            <div><dt>所要時間</dt><dd>30〜60分</dd></div>
            <div><dt>確認事項</dt><dd>ペットの性格・生活動線・鍵の受け渡し・緊急連絡先</dd></div>
          </dl>
          <div className="notice-card notice-muted">
            <strong>面談当日の確認事項テンプレート</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: "20px", color: "var(--muted)", lineHeight: 1.8 }}>
              <li>ペットの性格・苦手なもの・吠え癖など</li>
              <li>持病・アレルギー・投薬情報（薬の保管場所）</li>
              <li>鍵の受け渡し方法（スペアキー / スマートロック）</li>
              <li>緊急連絡先（飼い主・かかりつけ獣医）</li>
              <li>散歩ルート・禁止エリア・立ち入り禁止場所</li>
              <li>ケア中の連絡頻度の希望</li>
            </ul>
          </div>
          <button className="btn primary full" type="button" onClick={() => advance("done")}>
            Meet &amp; Greet完了を確認する（デモ）
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="card form-card mg-done-card">
          <div className="mg-confirmed-icon success">✓</div>
          <h2>Meet &amp; Greet完了</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.8 }}>
            {carer.name}さんとの顔合わせが完了しました。<br />
            初回予約へ進んで、最初のケアを予約できます。
          </p>
          <div className="mg-done-actions">
            <button className="btn primary" type="button" onClick={() => goTo("booking-estimate")}>
              初回予約へ進む（見積もり確認）
            </button>
            <button className="btn ghost" type="button" onClick={() => goTo("messages")}>
              メッセージで詳細を確認する
            </button>
            <button className="btn ghost" type="button" onClick={() => goTo("carers")}>
              他のケアラーを探す
            </button>
          </div>
        </div>
      )}
    </Stack>
  );
}

/* ── 紹介コード (PM-RM-P2-006) ── */

function ReferralPage({ notify }: { notify: (message: string) => void }) {
  const myCode = referralCodes[0];
  const discountAmount = 500;

  return (
    <Stack title="紹介コード" subtitle="友人を招待して、あなたと友人に次回500円割引を付与できます">
      <div className="notice-card notice-muted">
        <strong>プロトタイプ段階</strong>
        <p>
          割引の実際の適用は本番Stripe連携時に接続します（Stripe Coupon API で Customer に付与）。
          現在は画面表示・UXの確認のみです。
        </p>
      </div>

      <div className="referral-code-card">
        <p className="referral-code-label">あなたの紹介コード</p>
        <div className="referral-code-display">
          <strong>{myCode.code}</strong>
          <button
            className="btn ghost small"
            type="button"
            onClick={() => notify(`コード「${myCode.code}」をコピーしました`)}
          >
            コピー
          </button>
        </div>
        <p className="referral-code-note">
          このコードを友人に共有してください。友人が新規登録時に使うと、双方に次回{discountAmount}円割引が付与されます。
        </p>
        <div className="referral-share-row">
          <button className="btn primary small" type="button" onClick={() => notify("LINEで共有しました（デモ）")}>
            LINEで共有
          </button>
          <button className="btn ghost small" type="button" onClick={() => notify("Xで共有しました（デモ）")}>
            Xで共有
          </button>
          <button
            className="btn ghost small"
            type="button"
            onClick={() => notify(`URL「https://pawmate.jp/ref/${myCode.code}」をコピーしました`)}
          >
            URLをコピー
          </button>
        </div>
      </div>

      <Card title="紹介履歴">
        {myCode.usedBy.length === 0 ? (
          <p style={{ color: "var(--muted)", padding: "16px 0" }}>
            まだ紹介実績はありません。コードをシェアしてみましょう。
          </p>
        ) : (
          <div className="referral-history-list">
            {myCode.usedBy.map((entry, i) => (
              <div className="referral-history-row" key={i}>
                <div>
                  <strong>{entry.name}</strong>
                  <p>{entry.date}に登録</p>
                </div>
                <div>
                  {/* 本番Stripe連携時: entry.discountApplied は初回予約完了Webhookで true に更新 */}
                  {entry.discountApplied ? (
                    <span className="verified-badge">割引適用済み</span>
                  ) : (
                    <span className="pending-badge">初回予約待ち（割引未適用）</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="割引シミュレーション">
        <dl className="info-list">
          <div><dt>紹介者（あなた）への割引</dt><dd>次回予約{discountAmount}円引き</dd></div>
          <div><dt>被紹介者（友人）への割引</dt><dd>初回予約{discountAmount}円引き</dd></div>
          <div><dt>割引の有効期限</dt><dd>紹介者: 友人の初回予約完了後60日間</dd></div>
          <div><dt>Stripe連携状態</dt><dd>⚠ プロトタイプ段階（本番Stripe連携時に接続）</dd></div>
          <div><dt>不正利用防止</dt><dd>自己紹介禁止・1コード上限5回・同一デバイス複数登録検知</dd></div>
        </dl>
      </Card>
    </Stack>
  );
}

/* ── 複数頭割引・見積もり (PM-RM-P2-008) ── */

function BookingEstimatePage({
  carer,
  goTo,
  notify,
}: {
  carer: Carer;
  goTo: (page: PageId) => void;
  notify: (message: string) => void;
}) {
  const [selectedService, setSelectedService] = useState(carer.services[0] || "散歩代行");
  const [petCount, setPetCount] = useState(1);

  const serviceEntry = services.find((s) => s.title === selectedService);
  const basePrice = serviceEntry ? parsePriceVal(serviceEntry.price) : 3000;

  const firstPetPrice = basePrice;
  const additionalCount = Math.max(0, petCount - 1);
  const additionalPrice = additionalCount * Math.round(basePrice * 0.9);
  const multiPetDiscount = additionalCount * Math.round(basePrice * 0.1);
  const subtotal = firstPetPrice + additionalPrice;
  const ownerServiceFee = Math.round(subtotal * stripeConfig.ownerServiceFee);
  const totalAmount = subtotal + ownerServiceFee;
  const platformFee = Math.round(subtotal * stripeConfig.platformFeeRate);
  const carerPayout = subtotal - platformFee;

  return (
    <Stack
      title="予約見積もり"
      subtitle={`${carer.name}さんへの予約金額を確認します`}
    >
      <button className="btn ghost small back-button" type="button" onClick={() => goTo("carer-detail")}>
        プロフィールに戻る
      </button>

      <div className="notice-card notice-muted">
        <strong>プロトタイプ段階</strong>
        <p>
          実際の決済はStripe本番連携後に接続します（PM-RM-P1-011）。
          現在は料金計算・表示の確認のみです。
          {/* 本番Stripe Connect連携時: payment_intent を作成し ownerServiceFee を飼い主に課金、grossAmount の platformFeeRate をPF収益として Separate Charges + Transfer に反映 */}
        </p>
      </div>

      <div className="grid-2">
        <div className="card form-card">
          <p className="form-section-label">予約設定</p>
          <label className="field">
            <span>サービス</span>
            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
              {carer.services.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="field">
            <span>ペット頭数</span>
            <select value={petCount} onChange={(e) => setPetCount(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}頭{n >= 2 ? "（2頭目以降10%オフ）" : ""}</option>
              ))}
            </select>
          </label>
          {petCount >= 2 && (
            <div className="notice-card" style={{ padding: "12px 16px" }}>
              <strong>複数頭割引適用中</strong>
              <p>2頭目以降は基本料金から10%オフになります。割引額: ¥{multiPetDiscount.toLocaleString()}</p>
            </div>
          )}
          <TextField label="希望日" type="date" />
        </div>

        <div className="card estimate-card">
          <p className="form-section-label">料金内訳</p>
          <dl className="estimate-breakdown">
            <div>
              <dt>基本料金（1頭目）</dt>
              <dd>¥{firstPetPrice.toLocaleString()}</dd>
            </div>
            {additionalCount > 0 && (
              <>
                <div>
                  <dt>{additionalCount}頭分（10%オフ後 × {additionalCount}）</dt>
                  <dd>¥{additionalPrice.toLocaleString()}</dd>
                </div>
                <div className="estimate-discount-row">
                  <dt>複数頭割引（{additionalCount}頭 × 10%）</dt>
                  <dd className="discount-text">-¥{multiPetDiscount.toLocaleString()}</dd>
                </div>
              </>
            )}
            <div className="estimate-subtotal">
              <dt>ケアラー請求額（小計）</dt>
              <dd>¥{subtotal.toLocaleString()}</dd>
            </div>
            <div>
              <dt>飼い主側手数料（{(stripeConfig.ownerServiceFee * 100).toFixed(0)}%）</dt>
              <dd>¥{ownerServiceFee.toLocaleString()}</dd>
            </div>
            <div className="estimate-total-row">
              <dt>お支払い合計</dt>
              <dd>¥{totalAmount.toLocaleString()}</dd>
            </div>
          </dl>

          <div className="estimate-carer-section">
            <p className="estimate-carer-label">ケアラー報酬内訳</p>
            <dl className="estimate-breakdown">
              <div>
                <dt>ケアラー売上</dt>
                <dd>¥{subtotal.toLocaleString()}</dd>
              </div>
              <div className="estimate-discount-row">
                <dt>プラットフォーム手数料（{(stripeConfig.platformFeeRate * 100).toFixed(0)}%）</dt>
                <dd className="discount-text">-¥{platformFee.toLocaleString()}</dd>
              </div>
              <div className="estimate-total-row">
                <dt>ケアラー手取り</dt>
                <dd>¥{carerPayout.toLocaleString()}</dd>
              </div>
            </dl>
          </div>

          <button
            className="btn primary full"
            type="button"
            onClick={() => { notify("予約リクエストを送りました。確認できるまでしばらくお待ちください。"); goTo("my-bookings"); }}
          >
            この内容で予約をリクエストする
          </button>
        </div>
      </div>
    </Stack>
  );
}

function Toast({ message }: { message: string }) {
  return <div className={cx("toast", message && "show")}>{message}</div>;
}
