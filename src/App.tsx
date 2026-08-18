import { useId, useMemo, useState, type ReactNode } from "react";
import {
  adminApplicants,
  areas,
  bookings,
  carers,
  initialPets,
  requests,
  services,
  speciesList,
  speciesMeta,
  trustItems,
  type Booking,
  type Carer,
  type PageId,
  type Pet,
  type PetSex,
  type PetSpecies,
  type Role,
  type Service,
} from "./data/pawmateData";

const appPages: PageId[] = [
  "dashboard",
  "carers",
  "requests",
  "my-pets",
  "my-bookings",
  "messages",
];

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

type OwnerSpecies = "dog" | "cat" | null;

export default function App() {
  const [page, setPage] = useState<PageId>("landing");
  const [role, setRole] = useState<Role>("owner");
  const [ownerSpecies, setOwnerSpecies] = useState<OwnerSpecies>(null);
  const [selectedCarer, setSelectedCarer] = useState<Carer>(carers[0]);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [toast, setToast] = useState("");

  const isAppPage = appPages.includes(page) || page === "carer-detail";

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function goTo(nextPage: PageId) {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCarer(carer: Carer) {
    setSelectedCarer(carer);
    goTo("carer-detail");
  }

  function addPet(pet: Omit<Pet, "id">) {
    setPets((prev) => [...prev, { ...pet, id: Math.max(0, ...prev.map((p) => p.id)) + 1 }]);
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
        return <LandingPage goTo={goTo} ownerSpecies={ownerSpecies} chooseSpecies={setOwnerSpecies} />;
      case "login":
        return <LoginPage goTo={goTo} notify={notify} />;
      case "register":
        return <RegisterPage goTo={goTo} notify={notify} role={role} setRole={setRole} ownerSpecies={ownerSpecies} />;
      case "dashboard":
        return <DashboardPage goTo={goTo} pets={pets} />;
      case "carers":
        return <CarersPage openCarer={openCarer} ownerSpecies={ownerSpecies} />;
      case "carer-detail":
        return <CarerDetailPage carer={selectedCarer} notify={notify} goTo={goTo} />;
      case "requests":
        return <RequestsPage notify={notify} />;
      case "my-pets":
        return <MyPetsPage pets={pets} addPet={addPet} notify={notify} />;
      case "my-bookings":
        return <BookingsPage goTo={goTo} notify={notify} pets={pets} />;
      case "messages":
        return <MessagesPage notify={notify} />;
      case "carer-profile":
        return <CarerProfilePage notify={notify} />;
      case "admin":
        return <AdminPage notify={notify} />;
      default:
        return <LandingPage goTo={goTo} ownerSpecies={ownerSpecies} chooseSpecies={setOwnerSpecies} />;
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
    { id: "requests", label: "依頼掲示板", badge: "5" },
    { id: "my-pets", label: "マイペット" },
    { id: "my-bookings", label: "予約管理" },
    { id: "messages", label: "メッセージ", badge: "2" },
  ];
  const activePage = page === "carer-detail" ? "carers" : page;

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

function LandingPage({
  goTo,
  ownerSpecies,
  chooseSpecies,
}: {
  goTo: (page: PageId) => void;
  ownerSpecies: "dog" | "cat" | null;
  chooseSpecies: (species: "dog" | "cat") => void;
}) {
  const dogServices = services.filter((s) => s.species.includes("dog"));
  const catServices = services.filter((s) => s.species.includes("cat"));

  function enter(species: "dog" | "cat") {
    chooseSpecies(species);
    goTo("carers");
  }

  return (
    <main>
      <section className="hero-section hero-full">
        <img
          className="hero-bg"
          src="https://images.unsplash.com/photo-1509205477838-a534e43a849f?w=1800&q=80"
          alt="並んで座る犬と猫"
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">登録情報確認型 · 湘南エリア先行</p>
            <h1>信頼できるプロが、<br />いつもの場所で、<br /><span className="klee">いつものように</span>。</h1>
            <p className="lead">
              湘南で暮らす有資格のケアラーが、その子の日常をそっと支えます。
              旅行を諦めない。出張を諦めない。留守番に不安を抱えない。
            </p>
            <div className="hero-actions">
              <button className="btn ghost" type="button" onClick={() => goTo("carer-profile")}>プロとして参加する</button>
            </div>
            <div className="area-tags">
              {areas.map((area) => <span key={area}>{area}</span>)}
            </div>
          </div>
        </div>
        <Postmark className="hero-postmark" ring="PAWMATE · SHONAN · KANAGAWA · JAPAN ·" line1="SHONAN" line2="2026. 8. 18" />
        <span className="hero-memo">a good day by the sea</span>
        <div className="floating-card top">
          <strong>Meet & Greet 必須</strong>
          <span>初回は顔合わせから（猫はご自宅で）</span>
        </div>
        <div className="floating-card bottom">
          <strong>猫の訪問ケアにも対応</strong>
          <span>いつもの部屋で、いつものごはんを</span>
        </div>
      </section>

      <section className="species-entry-section">
        <p className="entry-label">まずは、いっしょに暮らしている家族を教えてください</p>
        <div className="species-entry">
          <button className="species-entry-card" type="button" onClick={() => enter("dog")}>
            <span className="species-entry-emoji">🐕</span>
            <strong>犬とくらしています</strong>
            <span>散歩代行 · 訪問ケア · 宿泊</span>
          </button>
          <button className="species-entry-card" type="button" onClick={() => enter("cat")}>
            <span className="species-entry-emoji">🐈</span>
            <strong>猫とくらしています</strong>
            <span>キャットシッター · 宿泊</span>
          </button>
        </div>
      </section>

      {ownerSpecies !== "cat" && (
        <>
          <SectionHeader label="Services for Dogs" title="🐕 犬の飼い主の方へ" />
          <section className="section grid-3">
            {dogServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </section>
        </>
      )}
      {ownerSpecies !== "dog" && (
        <>
          <SectionHeader label="Services for Cats" title="🐈 猫の飼い主の方へ" />
          <section className="section grid-2">
            {catServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </section>
        </>
      )}
      {ownerSpecies && (
        <p className="species-switch">
          <button className="link-button" type="button" onClick={() => chooseSpecies(ownerSpecies === "dog" ? "cat" : "dog")}>
            {ownerSpecies === "dog" ? "🐈 猫の飼い主の方はこちら" : "🐕 犬の飼い主の方はこちら"}
          </button>
        </p>
      )}

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
            ドッグトレーナーも、キャットシッターも。
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
          <span>愛情だけでは足りない。技術だけでも足りない。資格を持ったプロが、ペットへの愛情を持ってケアする。猫は環境の変化が苦手。だから“いつもの自宅”への訪問型ケアを軸にします。</span>
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
  ownerSpecies,
}: {
  goTo: (page: PageId) => void;
  notify: (message: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  ownerSpecies: "dog" | "cat" | null;
}) {
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
      {role === "owner" && (
        <label className="field">
          <span>ペットの種類</span>
          <select defaultValue={ownerSpecies ? speciesMeta[ownerSpecies].label : undefined}>
            {speciesList.map((s) => <option key={s}>{speciesMeta[s].label}</option>)}
            <option>これから迎える予定</option>
          </select>
        </label>
      )}
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

function PetAvatar({ species }: { species: PetSpecies }) {
  return (
    <span className={cx("pet-avatar species", species)} role="img" aria-label={speciesMeta[species].label}>
      {speciesMeta[species].emoji}
    </span>
  );
}

function DashboardPage({ goTo, pets }: { goTo: (page: PageId) => void; pets: Pet[] }) {
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
          {bookings.slice(0, 2).map((booking) => <BookingRow key={booking.id} booking={booking} pets={pets} />)}
        </Card>
        <Card title="マイペット" action={<button className="btn ghost small" type="button" onClick={() => goTo("my-pets")}>管理する</button>}>
          {pets.map((pet) => (
            <div className="pet-card" key={pet.id}>
              <PetAvatar species={pet.species} />
              <strong>{pet.name}</strong>
              <p>{pet.breed} · {pet.sex} · {pet.age}</p>
            </div>
          ))}
          <button className="btn ghost small full" type="button" onClick={() => goTo("my-pets")}>ペットを追加</button>
        </Card>
      </div>
    </Stack>
  );
}

function CarersPage({ openCarer, ownerSpecies }: { openCarer: (carer: Carer) => void; ownerSpecies: "dog" | "cat" | null }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("すべて");
  const [species, setSpecies] = useState<PetSpecies | "all">(ownerSpecies ?? "all");
  const filtered = useMemo(
    () =>
      carers.filter((carer) => {
        const matchesArea = area === "すべて" || carer.area === area;
        const matchesSpecies = species === "all" || carer.species.includes(species);
        const matchesQuery = `${carer.name} ${carer.area} ${carer.services.join(" ")} ${carer.petTags.join(" ")}`.includes(query);
        return matchesArea && matchesSpecies && matchesQuery;
      }),
    [area, query, species],
  );

  return (
    <Stack title="ケアラーを探す" subtitle="登録情報、資格、リピート率、対応ペットで比較できます。">
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
          <span>対応ペット</span>
          <select
            value={species}
            onChange={(event) => setSpecies(event.target.value as PetSpecies | "all")}
          >
            <option value="all">すべて</option>
            {speciesList.map((s) => (
              <option key={s} value={s}>{speciesMeta[s].label}</option>
            ))}
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
          <strong>{carer.license.type}</strong>
          <span>登録番号: {carer.license.num}</span>
        </div>
        <div className="pill-row">
          {carer.species.map((s) => (
            <span key={s}>{speciesMeta[s].emoji} {speciesMeta[s].label}</span>
          ))}
          {carer.petTags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="pill-row">
          {carer.certs.map((cert) => <span key={cert}>{cert}</span>)}
        </div>
        <div className="carer-meta">
          <strong>{carer.price}<span>/{carer.unit}</span></strong>
          <span>評価 {carer.rating} · リピート {carer.repeatRate}</span>
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
  const infoRows: Array<[string, string]> = [
    ["活動レポート", carer.reportStyle],
    ["Meet & Greet", carer.meetAndGreet],
    ["対応ペット", carer.species.map((s) => speciesMeta[s].label).join(" / ")],
    ["対応サービス", carer.services.join(" / ")],
  ];
  if (carer.petTags.length > 0) {
    infoRows.push(["得意分野", carer.petTags.join(" / ")]);
  }
  return (
    <Stack title={carer.name} subtitle={`${carer.area} · 経験 ${carer.exp} · リピート率 ${carer.repeatRate}`}>
      <button className="btn ghost small back-button" type="button" onClick={() => goTo("carers")}>ケアラー一覧に戻る</button>
      <div className="profile-hero">
        <img src={carer.image} alt={`${carer.name}のプロフィール`} />
        <div>
          <div className="profile-title">
            <span className="avatar large">{carer.avatar}</span>
            <div>
              <h2>{carer.name}</h2>
              <p>評価 {carer.rating}（{carer.reviews}件） / リピート率 {carer.repeatRate}</p>
            </div>
          </div>
          <p>{carer.bio}</p>
          <div className="license-box prominent">
            <strong>{carer.license.type}</strong>
            <span>登録番号: {carer.license.num} / 確認ステータス: {carer.license.verified ? "確認済み" : "確認中"}</span>
          </div>
          <div className="pill-row">
            {carer.species.map((s) => (
              <span key={s}>{speciesMeta[s].emoji} {speciesMeta[s].label}</span>
            ))}
            {carer.certs.map((cert) => <span key={cert}>{cert}</span>)}
          </div>
        </div>
      </div>
      <div className="grid-2">
        <Card title="信頼情報">
          <InfoList rows={infoRows} />
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
            <textarea placeholder="ペットの性格や面談希望日時を書いてください（猫の場合は隠れ場所もぜひ）" />
          </label>
          <button className="btn primary full" type="button" onClick={() => notify("Meet & Greetリクエストを送りました")}>
            Meet & Greetを依頼する
          </button>
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
                <span className="pill">{speciesMeta[request.species].emoji} {speciesMeta[request.species].label}</span>
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

const emptyPetForm = {
  name: "",
  species: "cat" as PetSpecies,
  breed: "",
  sex: "不明" as PetSex,
  age: "",
  notes: "",
};

function MyPetsPage({
  pets,
  addPet,
  notify,
}: {
  pets: Pet[];
  addPet: (pet: Omit<Pet, "id">) => void;
  notify: (message: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPetForm);

  function submit() {
    if (!form.name.trim()) {
      notify("ペットの名前を入力してください");
      return;
    }
    addPet({
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || "ミックス",
      sex: form.sex,
      age: form.age.trim() || "不明",
      notes: form.notes.trim(),
    });
    notify(`${form.name.trim()}を追加しました`);
    setForm(emptyPetForm);
    setShowForm(false);
  }

  return (
    <Stack title="マイペット" subtitle="登録したペット情報は予約リクエストとMeet & Greetに自動で引き継がれます。">
      <div className="grid-3">
        {pets.map((pet) => (
          <article className="pet-card big" key={pet.id}>
            <PetAvatar species={pet.species} />
            <strong>{pet.name}</strong>
            <p>{speciesMeta[pet.species].label}（{pet.breed}） · {pet.sex} · {pet.age}</p>
            <span>{pet.notes || "メモは未登録です。"}</span>
            <button className="btn ghost small" type="button" onClick={() => notify("ペット情報を保存しました")}>編集</button>
          </article>
        ))}
        <button className="add-card" type="button" onClick={() => setShowForm((v) => !v)}>
          <strong>{showForm ? "フォームを閉じる" : "ペットを追加"}</strong>
          <span>名前、種類（犬・猫・小動物）、品種、性別、年齢、メモを登録</span>
        </button>
      </div>
      {showForm && (
        <div className="card form-card">
          <div className="form-row">
            <TextField label="名前" placeholder="例：ムギ" value={form.name} onChange={(name) => setForm({ ...form, name })} />
            <label className="field">
              <span>種類</span>
              <select
                value={form.species}
                onChange={(event) => setForm({ ...form, species: event.target.value as PetSpecies })}
              >
                {speciesList.map((s) => (
                  <option key={s} value={s}>{speciesMeta[s].label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <TextField label="品種" placeholder="例：キジトラ、柴犬" value={form.breed} onChange={(breed) => setForm({ ...form, breed })} />
            <label className="field">
              <span>性別</span>
              <select
                value={form.sex}
                onChange={(event) => setForm({ ...form, sex: event.target.value as PetSex })}
              >
                <option>オス</option>
                <option>メス</option>
                <option>不明</option>
              </select>
            </label>
          </div>
          <TextField label="年齢" placeholder="例：2歳" value={form.age} onChange={(age) => setForm({ ...form, age })} />
          <label className="field">
            <span>メモ（性格・持病・隠れ場所など）</span>
            <textarea
              placeholder="例：人見知り。隠れ場所は押し入れ。朝夕2回のごはん。"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </label>
          <button className="btn primary full" type="button" onClick={submit}>この内容で追加する</button>
        </div>
      )}
    </Stack>
  );
}

function BookingsPage({ goTo, notify, pets }: { goTo: (page: PageId) => void; notify: (message: string) => void; pets: Pet[] }) {
  return (
    <Stack title="予約管理" subtitle="Meet & Greet、予約、支払い、レビューまで一箇所で確認できます。">
      <div className="tabs"><button className="active" type="button">進行中</button><button type="button">確定済み</button><button type="button">完了済み</button></div>
      <div className="booking-list">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking.id}>
            <BookingRow booking={booking} pets={pets} />
            <div className="row-actions">
              <button className="btn primary small" type="button" onClick={() => goTo("messages")}>チャット</button>
              {booking.status === "支払い待ち" && <button className="btn ghost small" type="button" onClick={() => notify("Stripe Connect決済へ進みます")}>支払い</button>}
              {booking.status === "完了" && <button className="btn ghost small" type="button" onClick={() => notify("レビューを投稿しました")}>レビューを書く</button>}
            </div>
          </div>
        ))}
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
          <button className="message-person" type="button">ほしの みお<span>ムギのキャットシッター相談</span></button>
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
          <TextField label="第一種動物取扱業 登録番号" placeholder="例：神奈川県茅ヶ崎市 第〇〇〇号" />
          <label className="field">
            <span>登録種別</span>
            <select>
              <option>保管</option>
              <option>訓練</option>
              <option>保管・訓練</option>
              <option>確認中</option>
            </select>
          </label>
          <p className="sidebar-label">対応できる動物</p>
          <div className="checkbox-grid">
            {speciesList.map((s) => (
              <label key={s}><input type="checkbox" /> {speciesMeta[s].emoji} {speciesMeta[s].label}</label>
            ))}
          </div>
          <p className="sidebar-label">対応サービス</p>
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
            <textarea placeholder="ペットシッター経験、飼育経験、保有資格（キャットシッター検定など）" />
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

function AdminPage({ notify }: { notify: (message: string) => void }) {
  return (
    <main className="standalone-page">
      <Stack title="管理パネル" subtitle="ケアラー審査・承認を管理します。">
        <div className="stats-grid">
          <Stat value="5" label="審査待ち" />
          <Stat value="48" label="承認済みケアラー" />
          <Stat value="132" label="総ユーザー" />
          <Stat value="89" label="今月の予約" />
        </div>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>名前</th>
                <th>エリア</th>
                <th>対応サービス</th>
                <th>資格・登録番号</th>
                <th>登録証</th>
                <th>申請日</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {adminApplicants.map((applicant) => (
                <tr key={applicant.name}>
                  <td><strong>{applicant.name}</strong></td>
                  <td>{applicant.area}</td>
                  <td>{applicant.services}</td>
                  <td><span>{applicant.license}</span><small>{applicant.cert}</small></td>
                  <td>{applicant.document}</td>
                  <td>{applicant.date}</td>
                  <td>
                    <button className="btn primary small" type="button" onClick={() => notify(`${applicant.name}を承認しました`)}>承認</button>
                    <button className="btn ghost small" type="button" onClick={() => notify(`${applicant.name}を差し戻しました`)}>差し戻し</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Stack>
    </main>
  );
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

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <div className={cx("service-icon", service.icon)} />
      <h3>{service.title}</h3>
      <p>{service.text}</p>
      <div className="pill-row">
        {service.species.map((s) => (
          <span key={s}>{speciesMeta[s].emoji} {speciesMeta[s].label}</span>
        ))}
      </div>
      <strong>{service.price}<span>/{service.unit}</span></strong>
    </article>
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

function BookingRow({ booking, pets }: { booking: Booking; pets: Pet[] }) {
  const pet = pets.find((p) => p.id === booking.petId);
  return (
    <div className="booking-row">
      <span className="avatar small-avatar">{booking.carer.slice(0, 1)}</span>
      <div>
        <strong>{booking.carer}</strong>
        <p>
          {booking.service} · {booking.date}
          {pet && <> · {speciesMeta[pet.species].emoji} {pet.name}</>}
        </p>
      </div>
      <div>
        <span className="pill success">{booking.status}</span>
        <strong>{booking.price}</strong>
      </div>
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
        <p>湘南エリア発、有資格プロと犬・猫の飼い主をつなぐ信頼可視化型ペットケアプラットフォーム。</p>
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

function Toast({ message }: { message: string }) {
  return <div className={cx("toast", message && "show")}>{message}</div>;
}
