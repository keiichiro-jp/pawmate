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
    title: "第一種動物取扱業者のみ登録可",
    text: "登録番号と登録証を審査・公開。素人とは一線を画す、プロだけが活動できる場所です。",
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
    title: "保険でカバー",
    text: "受託者賠償・第三者賠償・脱走初動費用をプラットフォームで整備します。",
  },
  {
    title: "エスクロー決済",
    text: "サービス完了まで代金を保護。金銭トラブルをPawMateが防ぎます。",
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
    services: ["散歩代行", "訪問ケア"],
    pets: ["犬", "猫"],
    price: "¥3,000〜",
    unit: "30分",
    avatar: "SM",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
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
    services: ["訪問ケア", "宿泊お預かり"],
    pets: ["犬", "猫", "シニア犬"],
    price: "¥4,500〜",
    unit: "60分",
    avatar: "KA",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
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
    services: ["散歩代行"],
    pets: ["犬", "大型犬"],
    price: "¥3,000〜",
    unit: "30分",
    avatar: "OK",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80",
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
    services: ["訪問ケア", "宿泊お預かり"],
    pets: ["犬", "猫", "シニア"],
    price: "¥20,000〜",
    unit: "1泊",
    avatar: "YY",
    image: "https://images.unsplash.com/photo-1601758174493-1fe38e518cc5?w=900&q=80",
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
    services: ["散歩代行", "訪問ケア", "宿泊お預かり"],
    pets: ["犬", "猫", "小動物"],
    price: "¥4,500〜",
    unit: "60分",
    avatar: "SH",
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&q=80",
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

export const bookings = [
  {
    carer: "さとう まりな",
    service: "散歩代行",
    date: "6月3日（火）10:00〜11:00",
    pet: "ポチ",
    status: "確定済み",
    price: "¥3,000",
  },
  {
    carer: "きむら あいこ",
    service: "宿泊お預かり",
    date: "6月10〜12日",
    pet: "ポチ",
    status: "支払い待ち",
    price: "¥40,000",
  },
  {
    carer: "さとう まりな",
    service: "散歩代行",
    date: "5月20日",
    pet: "ポチ",
    status: "完了",
    price: "¥3,000",
  },
];

export const adminApplicants = [
  {
    name: "田村 ゆかり",
    area: "茅ヶ崎・藤沢",
    services: "散歩代行 / 訪問ケア",
    license: "神奈川県 第12-4421号",
    cert: "愛玩動物飼養管理士 2級",
    document: "確認済み",
    date: "2026/05/28",
  },
  {
    name: "中村 しんじ",
    area: "鎌倉・逗子",
    services: "散歩代行 / 宿泊",
    license: "神奈川県 第12-5102号",
    cert: "日本警察犬協会 公認訓練士",
    document: "書類確認中",
    date: "2026/05/27",
  },
  {
    name: "林 えみこ",
    area: "平塚・茅ヶ崎",
    services: "散歩代行 / 訪問 / 宿泊",
    license: "神奈川県 第12-0931号",
    cert: "認定動物看護師",
    document: "差し戻し",
    date: "2026/05/25",
  },
];
