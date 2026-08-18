export type PageId =
  | "landing"
  | "login"
  | "register"
  | "dashboard"
  | "carers"
  | "carer-detail"
  | "requests"
  | "my-pets"
  | "my-bookings"
  | "messages"
  | "carer-profile"
  | "report-card"
  | "payments"
  | "meet-and-greet"
  | "referral"
  | "booking-estimate"
  | "admin";

export type Role = "owner" | "carer";

export type Carer = {
  id: number;
  name: string;
  area: string;
  exp: string;
  rating: number;
  reviews: number;
  repeatRate: string;
  /** リピート率の計算根拠となる完了予約数。5件未満は非表示 */
  repeatRateBase: number | null;
  services: string[];
  pets: string[];
  price: string;
  unit: string;
  avatar: string;
  image: string;
  bio: string;
  reportStyle: string;
  meetAndGreet: string;
  availability: boolean[];
  license: {
    num: string;
    type: string;
    verified: boolean;
  };
  certs: string[];
};

export type Request = {
  id: number;
  owner: string;
  pet: string;
  service: string;
  date: string;
  time: string;
  area: string;
  price: string;
  note: string;
  applies: number;
};

export const areas = ["茅ヶ崎", "藤沢", "鎌倉", "平塚", "辻堂"];

export const services = [
  {
    id: "walk",
    title: "散歩代行",
    icon: "walk",
    price: "¥3,000〜",
    unit: "30分",
    text: "30分・60分の代行散歩。飼い主宅への訪問または待ち合わせに対応します。",
  },
  {
    id: "visit",
    title: "訪問ケア",
    icon: "home",
    price: "¥4,500〜",
    unit: "60分",
    text: "食事・トイレ・遊び・投薬などを、ペットが慣れた自宅でケアします。",
  },
  {
    id: "stay",
    title: "宿泊お預かり",
    icon: "moon",
    price: "¥20,000〜",
    unit: "1泊",
    text: "旅行・出張中の宿泊ケア。ケアラー宅または飼い主宅での泊まり込みに対応します。",
  },
];

export const trustItems = [
  {
    title: "登録情報を確認して表示",
    text: "登録番号、登録種別、資格情報をプロフィールで確認できるようにします。表示ルールは行政確認結果に合わせて調整します。",
  },
  {
    title: "Meet & Greet 必須",
    text: "初回は必ず顔合わせ。性格・持病・鍵の受け渡し・緊急連絡先を書面で確認します。",
  },
  {
    title: "リピート率を公開",
    text: "また頼んだ飼い主の割合をプロフィールに表示し、継続信頼を可視化します。",
  },
  {
    title: "活動レポート",
    text: "GPS・写真・排泄記録・気づいた変化をケア終了時にまとめて送ります。",
  },
  {
    title: "保険スキームを確認中",
    text: "事故時の連絡、記録、証跡を残す運用を先に整え、補償範囲は保険会社への相談結果に合わせて決めます。",
  },
  {
    title: "決済・分配フローを設計中",
    text: "予約、支払い、返金、ケアラー入金の流れを検証し、利用前に条件が分かる状態を目指します。",
  },
];

export const carers: Carer[] = [
  {
    id: 1,
    name: "さとう まりな",
    area: "茅ヶ崎",
    exp: "3年",
    rating: 4.97,
    reviews: 128,
    repeatRate: "86%",
    repeatRateBase: 128,
    services: ["散歩代行", "訪問ケア"],
    pets: ["犬", "猫"],
    price: "¥3,000〜",
    unit: "30分",
    avatar: "SM",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80",
    bio: "茅ヶ崎在住。柴犬と暮らしながら、散歩代行と訪問ケアを中心に活動しています。写真付きの活動レポートを丁寧にお送りします。",
    reportStyle: "散歩ルート、排泄、食欲、写真3枚を毎回共有",
    meetAndGreet: "公園またはご自宅前で30分の事前面談に対応",
    availability: [true, true, false, true, true, false, true],
    license: {
      num: "神奈川県 第12-0847号",
      type: "第一種動物取扱業（保管）",
      verified: true,
    },
    certs: ["JKC公認訓練士", "ペット救急救命士"],
  },
  {
    id: 2,
    name: "きむら あいこ",
    area: "藤沢",
    exp: "5年",
    rating: 4.92,
    reviews: 203,
    repeatRate: "91%",
    repeatRateBase: 203,
    services: ["訪問ケア", "宿泊お預かり"],
    pets: ["犬", "猫", "シニア犬"],
    price: "¥4,500〜",
    unit: "60分",
    avatar: "KA",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=80",
    bio: "動物看護の経験を活かし、シニア犬・投薬が必要な子のケアを得意としています。藤沢・辻堂を中心に対応します。",
    reportStyle: "食事量、投薬、体調変化、写真レポートを共有",
    meetAndGreet: "初回はご自宅で生活導線とケア手順を確認",
    availability: [true, false, true, false, true, true, true],
    license: {
      num: "神奈川県 第12-1203号",
      type: "第一種動物取扱業（保管）",
      verified: true,
    },
    certs: ["愛玩動物飼養管理士 1級", "認定動物看護師"],
  },
  {
    id: 3,
    name: "おかだ こうじ",
    area: "鎌倉",
    exp: "2年",
    rating: 4.85,
    reviews: 56,
    repeatRate: "78%",
    repeatRateBase: 56,
    services: ["散歩代行"],
    pets: ["犬", "大型犬"],
    price: "¥3,000〜",
    unit: "30分",
    avatar: "OK",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
    bio: "元トリマー。鎌倉周辺の散歩ルートに詳しく、引っ張り癖のある子や大型犬にも落ち着いて対応します。",
    reportStyle: "散歩距離、ルート、排泄、表情の写真を共有",
    meetAndGreet: "海沿い・公園での散歩同伴面談に対応",
    availability: [true, true, true, false, false, true, true],
    license: {
      num: "神奈川県 第12-2091号",
      type: "第一種動物取扱業（訓練）",
      verified: true,
    },
    certs: ["日本警察犬協会 公認訓練士", "JKC公認トリマー"],
  },
  {
    id: 4,
    name: "やまだ ゆうこ",
    area: "平塚",
    exp: "4年",
    rating: 4.78,
    reviews: 91,
    repeatRate: "82%",
    repeatRateBase: 3,
    services: ["訪問ケア", "宿泊お預かり"],
    pets: ["犬", "猫", "シニア"],
    price: "¥20,000〜",
    unit: "1泊",
    avatar: "YY",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80",
    bio: "シニア犬・猫の在宅ケアを中心に活動。いつもの環境を変えずに、旅行や出張中の不安を軽くします。",
    reportStyle: "夜間の様子、食事、排泄、写真付き日報を共有",
    meetAndGreet: "ご自宅での泊まり込み導線確認を重視",
    availability: [false, true, true, true, false, true, false],
    license: {
      num: "神奈川県 第12-0634号",
      type: "第一種動物取扱業（保管）",
      verified: true,
    },
    certs: ["認定動物看護師", "ペット終活ケアアドバイザー"],
  },
  {
    id: 5,
    name: "すずき はるか",
    area: "辻堂",
    exp: "6年",
    rating: 4.99,
    reviews: 312,
    repeatRate: "94%",
    repeatRateBase: 312,
    services: ["散歩代行", "訪問ケア", "宿泊お預かり"],
    pets: ["犬", "猫", "小動物"],
    price: "¥4,500〜",
    unit: "60分",
    avatar: "SH",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80",
    bio: "専業ケアラーとして6年。多頭飼い・猫の留守番・急な出張時の訪問ケアまで幅広く対応します。",
    reportStyle: "写真、短い動画、GPS、排泄記録をまとめて共有",
    meetAndGreet: "オンライン事前確認後、ご自宅で最終確認",
    availability: [true, true, true, true, true, true, true],
    license: {
      num: "神奈川県 第12-0188号",
      type: "第一種動物取扱業（保管・訓練）",
      verified: true,
    },
    certs: ["JKC公認訓練士", "愛玩動物飼養管理士 1級", "ペット救急救命士"],
  },
];

export const requests: Request[] = [
  {
    id: 1,
    owner: "山口 健太",
    pet: "ムギ（猫・2歳）",
    service: "訪問ケア",
    date: "6月5日（木）",
    time: "9:00〜18:00",
    area: "鎌倉",
    price: "¥4,500",
    note: "人慣れしている猫です。ご飯は朝夕2回、トイレ掃除と30分ほどの遊びをお願いします。",
    applies: 3,
  },
  {
    id: 2,
    owner: "田中 美咲",
    pet: "ポチ（柴犬・3歳）",
    service: "散歩代行",
    date: "6月8日（日）",
    time: "10:00〜11:00",
    area: "茅ヶ崎",
    price: "¥3,000",
    note: "散歩中は少し引っ張ります。初回なのでMeet & Greetからお願いしたいです。",
    applies: 7,
  },
  {
    id: 3,
    owner: "佐々木 みゆき",
    pet: "ルル（トイプードル・5歳）",
    service: "宿泊お預かり",
    date: "6月20〜22日",
    time: "2泊",
    area: "藤沢",
    price: "¥40,000",
    note: "シニア期に入り投薬があります。手順は面談時に実演します。",
    applies: 2,
  },
  {
    id: 4,
    owner: "加藤 りょうた",
    pet: "クロ（ラブラドール・2歳）",
    service: "散歩代行",
    date: "毎週月・水・金",
    time: "8:00〜9:00",
    area: "平塚",
    price: "¥36,000/月",
    note: "大型犬に慣れている方を希望します。継続依頼の前提で探しています。",
    applies: 5,
  },
];

export type Booking = {
  carer: string;
  service: string;
  date: string;
  pet: string;
  status: string;
  price: string;
  /** 予約対象のペット頭数 */
  petCount: number;
  /** 複数頭割引額（円）。2頭目以降10%オフ */
  multiPetDiscount: number;
  /** Meet & Greet完了フラグ。false の場合は初回予約をブロック */
  meetAndGreetCompleted: boolean;
};

export const bookings: Booking[] = [
  {
    carer: "さとう まりな",
    service: "散歩代行",
    date: "6月3日（火）10:00〜11:00",
    pet: "ポチ",
    status: "確定済み",
    price: "¥3,000",
    petCount: 1,
    multiPetDiscount: 0,
    meetAndGreetCompleted: true,
  },
  {
    carer: "きむら あいこ",
    service: "宿泊お預かり",
    date: "6月10〜12日",
    pet: "ポチ・モモ",
    status: "支払い待ち",
    price: "¥36,000",
    petCount: 2,
    multiPetDiscount: 4000,
    meetAndGreetCompleted: true,
  },
  {
    carer: "さとう まりな",
    service: "散歩代行",
    date: "5月20日",
    pet: "ポチ",
    status: "完了",
    price: "¥3,000",
    petCount: 1,
    multiPetDiscount: 0,
    meetAndGreetCompleted: true,
  },
];

export const adminApplicants = [
  {
    name: "田村 ゆかり",
    area: "茅ヶ崎・藤沢",
    services: "散歩代行 / 訪問ケア",
    license: "神奈川県 第12-4421号",
    licenseType: "保管",
    licenseExpiry: "2028/03/31",
    cert: "愛玩動物飼養管理士 2級",
    document: "確認済み",
    identity: "本人確認済み",
    status: "承認準備OK",
    score: "92",
    risk: "低",
    memo: "顔写真、料金、自己紹介文は公開基準内。初回案件候補を2件提案可能。",
    date: "2026/05/28",
  },
  {
    name: "中村 しんじ",
    area: "鎌倉・逗子",
    services: "散歩代行 / 宿泊",
    license: "神奈川県 第12-5102号",
    licenseType: "訓練",
    licenseExpiry: "2027/09/30",
    cert: "日本警察犬協会 公認訓練士",
    document: "書類確認中",
    identity: "本人確認済み",
    status: "要確認",
    score: "71",
    risk: "中",
    memo: "宿泊を出す場合は保管業の登録有無を確認。まず散歩代行のみ承認が現実的。",
    date: "2026/05/27",
  },
  {
    name: "林 えみこ",
    area: "平塚・茅ヶ崎",
    services: "散歩代行 / 訪問 / 宿泊",
    license: "神奈川県 第12-0931号",
    licenseType: "保管・訓練",
    licenseExpiry: "確認待ち",
    cert: "認定動物看護師",
    document: "差し戻し",
    identity: "住所確認待ち",
    status: "差し戻し中",
    score: "58",
    risk: "中",
    memo: "登録証の有効期限画像が不鮮明。再提出後にプロフィール文の投薬表現も確認。",
    date: "2026/05/25",
  },
];

export const adminMetrics = [
  {
    label: "今日の未対応",
    value: "7",
    helper: "審査3件 / 決済2件 / CS2件",
    tone: "amber",
  },
  {
    label: "承認済みケアラー",
    value: "48",
    helper: "湘南5エリアをカバー",
    tone: "green",
  },
  {
    label: "今月GMV",
    value: "¥1.28M",
    helper: "目標比 84%",
    tone: "blue",
  },
  {
    label: "要介入予約",
    value: "2",
    helper: "支払い失敗と日程再調整",
    tone: "coral",
  },
];

export const adminTasks = [
  {
    title: "中村しんじさんの保管業登録を確認",
    owner: "Trust",
    due: "今日 15:00",
    severity: "高",
  },
  {
    title: "宿泊予約の支払い失敗をフォロー",
    owner: "Finance",
    due: "今日中",
    severity: "高",
  },
  {
    title: "藤沢エリアの週末供給不足を補う",
    owner: "Ops",
    due: "明日",
    severity: "中",
  },
  {
    title: "面談後48時間未確定の飼い主へリマインド",
    owner: "CS",
    due: "自動送信待ち",
    severity: "低",
  },
];

export const adminBookingRows = [
  {
    id: "BK-0603-001",
    owner: "田中 美咲",
    carer: "さとう まりな",
    pet: "ポチ",
    service: "散歩代行",
    schedule: "6月3日（火）10:00",
    status: "確定済み",
    payment: "決済済み",
    risk: "通常",
    amount: "¥3,000",
  },
  {
    id: "BK-0610-002",
    owner: "田中 美咲",
    carer: "きむら あいこ",
    pet: "ポチ",
    service: "宿泊お預かり",
    schedule: "6月10〜12日",
    status: "支払い待ち",
    payment: "カード再認証",
    risk: "要介入",
    amount: "¥40,000",
  },
  {
    id: "MG-0605-003",
    owner: "山口 健太",
    carer: "すずき はるか",
    pet: "ムギ",
    service: "Meet & Greet",
    schedule: "6月5日（木）18:30",
    status: "面談調整中",
    payment: "未発生",
    risk: "通常",
    amount: "¥0",
  },
];

export const adminQualityRows = [
  {
    name: "すずき はるか",
    area: "辻堂",
    repeatRate: "94%",
    cancelRate: "0.8%",
    response: "12分",
    nextReview: "2026/06/15",
    signal: "優良",
  },
  {
    name: "きむら あいこ",
    area: "藤沢",
    repeatRate: "91%",
    cancelRate: "1.4%",
    response: "24分",
    nextReview: "2026/06/18",
    signal: "通常",
  },
  {
    name: "おかだ こうじ",
    area: "鎌倉",
    repeatRate: "78%",
    cancelRate: "4.6%",
    response: "1時間20分",
    nextReview: "2026/06/07",
    signal: "確認",
  },
];

export const adminIncidentRows = [
  {
    id: "CS-0601-014",
    title: "鍵の受け渡し方法の確認",
    type: "問い合わせ",
    owner: "佐々木 みゆき",
    carer: "きむら あいこ",
    status: "返信待ち",
    severity: "低",
    updated: "12分前",
  },
  {
    id: "CS-0601-009",
    title: "散歩ルートGPSの記録が途中で停止",
    type: "品質確認",
    owner: "田中 美咲",
    carer: "さとう まりな",
    status: "調査中",
    severity: "中",
    updated: "1時間前",
  },
  {
    id: "CS-0531-021",
    title: "レビュー文面の公開可否チェック",
    type: "モデレーション",
    owner: "加藤 りょうた",
    carer: "おかだ こうじ",
    status: "公開保留",
    severity: "低",
    updated: "昨日",
  },
];

/* ── Stripe Connect ── */
export type PaymentStatus = "pending" | "captured" | "refunded" | "failed";
export type TransferStatus = "scheduled" | "transferred" | "on-hold";

export const stripeConfig = {
  platformFeeRate: 0.25,
  carerNetRate: 0.75,
  ownerServiceFee: 0.07,
  holdDays: 2,
  currency: "jpy",
  connectType: "express" as const,
} as const;

export type PaymentRecord = {
  id: string;
  bookingId: string;
  ownerName: string;
  carerName: string;
  service: string;
  grossAmount: number;
  platformFee: number;
  carerPayout: number;
  ownerServiceFee: number;
  status: PaymentStatus;
  transferStatus: TransferStatus;
  createdAt: string;
  transferAt: string;
};

export const paymentRecords: PaymentRecord[] = [
  {
    id: "CH-001",
    bookingId: "BK-0603-001",
    ownerName: "田中 美咲",
    carerName: "さとう まりな",
    service: "散歩代行",
    grossAmount: 3000,
    platformFee: 750,
    carerPayout: 2250,
    ownerServiceFee: 210,
    status: "captured",
    transferStatus: "scheduled",
    createdAt: "2026/06/03 10:00",
    transferAt: "2026/06/05 15:00",
  },
  {
    id: "CH-002",
    bookingId: "BK-0610-002",
    ownerName: "田中 美咲",
    carerName: "きむら あいこ",
    service: "宿泊お預かり",
    grossAmount: 40000,
    platformFee: 10000,
    carerPayout: 30000,
    ownerServiceFee: 2800,
    status: "pending",
    transferStatus: "on-hold",
    createdAt: "2026/06/08 12:00",
    transferAt: "2026/06/12 15:00",
  },
  {
    id: "RF-001",
    bookingId: "BK-0531-003",
    ownerName: "山口 健太",
    carerName: "すずき はるか",
    service: "訪問ケア（当日キャンセル）",
    grossAmount: 4500,
    platformFee: 338,
    carerPayout: 1013,
    ownerServiceFee: 0,
    status: "refunded",
    transferStatus: "on-hold",
    createdAt: "2026/05/31 09:00",
    transferAt: "—",
  },
];

export type ConnectAccountStatus = "not-started" | "pending" | "active" | "restricted";

export type ConnectAccount = {
  carerName: string;
  carerAvatar: string;
  status: ConnectAccountStatus;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  email: string;
  onboardedAt: string | null;
};

export const connectAccounts: ConnectAccount[] = [
  {
    carerName: "さとう まりな",
    carerAvatar: "SM",
    status: "active",
    payoutsEnabled: true,
    chargesEnabled: true,
    email: "marina@example.com",
    onboardedAt: "2026/05/20",
  },
  {
    carerName: "きむら あいこ",
    carerAvatar: "KA",
    status: "active",
    payoutsEnabled: true,
    chargesEnabled: true,
    email: "aiko@example.com",
    onboardedAt: "2026/05/22",
  },
  {
    carerName: "おかだ こうじ",
    carerAvatar: "OK",
    status: "pending",
    payoutsEnabled: false,
    chargesEnabled: false,
    email: "koji@example.com",
    onboardedAt: null,
  },
];

export type ReportCardStatus = "draft" | "sent" | "read";

export type ReportCard = {
  id: string;
  bookingId: string;
  carerName: string;
  carerAvatar: string;
  petName: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReportCardStatus;
  gps: { lat: number; lng: number; routeLabel: string } | null;
  photos: Array<{ url: string; caption: string }>;
  meal: "完食" | "半分" | "食べず" | "なし";
  toilet: string;
  mood: "元気" | "普通" | "少し不安" | "要注意";
  notes: string;
  alerts: string;
};

export const reportCards: ReportCard[] = [
  {
    id: "RC-0603-001",
    bookingId: "BK-0603-001",
    carerName: "さとう まりな",
    carerAvatar: "SM",
    petName: "ポチ",
    service: "散歩代行",
    date: "2026年6月3日（火）",
    startTime: "10:00",
    endTime: "11:00",
    status: "sent",
    gps: { lat: 35.3408, lng: 139.4275, routeLabel: "茅ヶ崎海岸沿い〜南浜公園 約2.4km" },
    photos: [
      {
        url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
        caption: "海沿いを元気に歩いていました",
      },
      {
        url: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&q=80",
        caption: "公園で少し休憩。砂浜が好きみたいです",
      },
    ],
    meal: "なし",
    toilet: "散歩中に1回（固形・正常）",
    mood: "元気",
    notes: "終始元気でした。砂浜エリアを特に喜んでいました。リードの引っ張りは少し強めです。",
    alerts: "",
  },
];

/* ── Meet & Greet ── */

export type MeetAndGreetStatus = "pending" | "approved" | "declined" | "scheduled" | "completed";

export type MeetAndGreetRequest = {
  id: string;
  ownerName: string;
  carerName: string;
  petName: string;
  petCount: number;
  candidateDates: string[];
  confirmedDate: string | null;
  intro: string;
  status: MeetAndGreetStatus;
  createdAt: string;
};

export const meetAndGreetRequests: MeetAndGreetRequest[] = [
  {
    id: "MG-001",
    ownerName: "田中 美咲",
    carerName: "さとう まりな",
    petName: "ポチ",
    petCount: 1,
    candidateDates: ["2026-06-07T10:00", "2026-06-08T14:00", "2026-06-10T18:00"],
    confirmedDate: "2026-06-07T10:00",
    intro: "初めてお願いします。ポチは少し人見知りがありますが、慣れると甘えん坊です。鍵の受け渡し方法も確認したいです。",
    status: "completed",
    createdAt: "2026/06/01",
  },
];

/* ── Referral Code ── */

export type ReferralCode = {
  code: string;
  ownerName: string;
  createdAt: string;
  /** 紹介履歴。discountApplied: 割引適用済み（本番Stripe連携時に true に更新） */
  usedBy: Array<{ name: string; date: string; discountApplied: boolean }>;
};

export const referralCodes: ReferralCode[] = [
  {
    code: "TANAKA2026",
    ownerName: "田中 美咲",
    createdAt: "2026/06/01",
    usedBy: [
      { name: "鈴木 花子", date: "2026/06/02", discountApplied: false },
    ],
  },
];

export const adminPaymentRows = [
  {
    id: "PAY-0601-001",
    title: "宿泊お預かり 決済再認証",
    user: "田中 美咲",
    amount: "¥40,000",
    fee: "¥10,000",
    status: "要対応",
    detail: "3Dセキュア再認証リンクを送信済み",
  },
  {
    id: "TR-0601-002",
    title: "ケアラー振込予定",
    user: "さとう まりな",
    amount: "¥2,460",
    fee: "¥540",
    status: "明日振込",
    detail: "散歩代行完了から48時間経過待ち",
  },
  {
    id: "RF-0531-003",
    title: "当日キャンセル料精算",
    user: "山口 健太",
    amount: "¥1,350",
    fee: "¥338",
    status: "処理済み",
    detail: "キャンセル料30%を適用",
  },
];
