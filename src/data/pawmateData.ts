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

export type PetSpecies = "dog" | "cat" | "small_animal";

export const speciesMeta: Record<PetSpecies, { label: string; emoji: string }> = {
  dog: { label: "犬", emoji: "🐕" },
  cat: { label: "猫", emoji: "🐈" },
  small_animal: { label: "小動物", emoji: "🐹" },
};

export const speciesList: PetSpecies[] = ["dog", "cat", "small_animal"];

export type PetSex = "オス" | "メス" | "不明";

export type Pet = {
  id: number;
  name: string;
  species: PetSpecies;
  breed: string;
  sex: PetSex;
  age: string;
  notes: string;
};

export type Service = {
  id: string;
  title: string;
  icon: "walk" | "home" | "cat" | "moon";
  price: string;
  unit: string;
  text: string;
  species: PetSpecies[];
};

export type Carer = {
  id: number;
  name: string;
  area: string;
  exp: string;
  rating: number;
  reviews: number;
  repeatRate: string;
  services: string[];
  species: PetSpecies[];
  petTags: string[];
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
  species: PetSpecies;
  service: string;
  date: string;
  time: string;
  area: string;
  price: string;
  note: string;
  applies: number;
};

export type BookingStatus = "確定済み" | "支払い待ち" | "完了";

export type Booking = {
  id: number;
  carer: string;
  service: string;
  date: string;
  petId: number;
  status: BookingStatus;
  price: string;
};

export const areas = ["茅ヶ崎", "藤沢", "鎌倉", "平塚", "辻堂"];

export const initialPets: Pet[] = [
  {
    id: 1,
    name: "ポチ",
    species: "dog",
    breed: "柴犬",
    sex: "オス",
    age: "3歳",
    notes: "アレルギーなし。散歩中は引っ張り癖あり。",
  },
  {
    id: 2,
    name: "ムギ",
    species: "cat",
    breed: "キジトラ",
    sex: "メス",
    age: "2歳",
    notes: "人慣れした甘えん坊。留守番は得意だが爪切りが苦手。隠れ場所は寝室のベッド下。",
  },
];

export const services: Service[] = [
  {
    id: "walk",
    title: "散歩代行",
    icon: "walk",
    price: "¥3,000〜",
    unit: "30分",
    species: ["dog"],
    text: "30分・60分の代行散歩。飼い主宅への訪問または待ち合わせに対応します。",
  },
  {
    id: "visit",
    title: "訪問ケア",
    icon: "home",
    price: "¥4,500〜",
    unit: "60分",
    species: ["dog", "small_animal"],
    text: "食事・トイレ・遊び・投薬などを、ペットが慣れた自宅でケアします。",
  },
  {
    id: "cat-sitting",
    title: "キャットシッター",
    icon: "cat",
    price: "¥4,000〜",
    unit: "60分",
    species: ["cat"],
    text: "猫専門の訪問ケア。食事・トイレ掃除・遊び・投薬に対応し、距離感を大切に、隠れ場所や食欲の変化まで確認します。2頭まで同額。",
  },
  {
    id: "stay",
    title: "宿泊お預かり",
    icon: "moon",
    price: "¥20,000〜",
    unit: "1泊",
    species: ["dog", "cat", "small_animal"],
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
    text: "初回は必ず顔合わせ。猫はご自宅で実施します。性格・持病・鍵の受け渡し・緊急連絡先を書面で確認します。",
  },
  {
    title: "リピート率を公開",
    text: "また頼んだ飼い主の割合をプロフィールに表示し、継続信頼を可視化します。",
  },
  {
    title: "活動レポート",
    text: "犬は散歩ルートと写真、猫は食事量・飲水・トイレ・隠れ場所の記録と写真。気づいた変化をケア終了時にまとめて送ります。",
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
    services: ["散歩代行", "訪問ケア", "キャットシッター"],
    species: ["dog", "cat"],
    petTags: [],
    price: "¥3,000〜",
    unit: "30分",
    avatar: "SM",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
    bio: "茅ヶ崎在住。柴犬と保護猫1匹と暮らしながら、散歩代行と訪問ケアを中心に活動しています。写真付きの活動レポートを丁寧にお送りします。",
    reportStyle: "散歩ルート、排泄、食欲、写真3枚を毎回共有",
    meetAndGreet: "犬は公園またはご自宅前、猫はご自宅で30分の事前面談に対応",
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
    services: ["訪問ケア", "キャットシッター", "宿泊お預かり"],
    species: ["dog", "cat"],
    petTags: ["シニア対応", "投薬対応"],
    price: "¥4,500〜",
    unit: "60分",
    avatar: "KA",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
    bio: "動物看護の経験を活かし、シニア犬・シニア猫・投薬が必要な子のケアを得意としています。藤沢・辻堂を中心に対応します。",
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
    species: ["dog"],
    petTags: ["大型犬対応"],
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
    services: ["訪問ケア", "キャットシッター", "宿泊お預かり"],
    species: ["dog", "cat"],
    petTags: ["シニア対応"],
    price: "¥20,000〜",
    unit: "1泊",
    avatar: "YY",
    image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=900&q=80",
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
    services: ["散歩代行", "訪問ケア", "キャットシッター", "宿泊お預かり"],
    species: ["dog", "cat", "small_animal"],
    petTags: ["多頭飼い対応"],
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
  {
    id: 6,
    name: "ほしの みお",
    area: "藤沢",
    exp: "5年",
    rating: 4.96,
    reviews: 174,
    repeatRate: "92%",
    services: ["キャットシッター"],
    species: ["cat"],
    petTags: ["多頭飼い対応", "シニア猫対応"],
    price: "¥4,000〜",
    unit: "60分",
    avatar: "HM",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&q=80",
    bio: "保護猫2匹と暮らす猫専門シッター。警戒心の強い子には無理に近づかず、その子のペースに合わせたケアを徹底します。",
    reportStyle: "食事量、飲水、トイレ状態、隠れ場所、写真3枚を毎回共有",
    meetAndGreet: "初回は必ずご自宅で。猫の性格・隠れ場所・鍵の受け渡し方法を確認",
    availability: [true, true, false, true, true, true, false],
    license: {
      num: "神奈川県 第12-3306号",
      type: "第一種動物取扱業（保管）",
      verified: true,
    },
    certs: ["キャットシッター検定 上級", "愛玩動物飼養管理士 2級"],
  },
];

export const requests: Request[] = [
  {
    id: 1,
    owner: "山口 健太",
    pet: "ムギ（猫・2歳）",
    species: "cat",
    service: "キャットシッター",
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
    species: "dog",
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
    species: "dog",
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
    species: "dog",
    service: "散歩代行",
    date: "毎週月・水・金",
    time: "8:00〜9:00",
    area: "平塚",
    price: "¥36,000/月",
    note: "大型犬に慣れている方を希望します。継続依頼の前提で探しています。",
    applies: 5,
  },
  {
    id: 5,
    owner: "石井 さやか",
    pet: "ソラ（アメリカンショートヘア・4歳）ほか1頭",
    species: "cat",
    service: "キャットシッター",
    date: "6月14〜16日",
    time: "1日1回 60分",
    area: "辻堂",
    price: "¥12,000",
    note: "帰省中の3日間、朝の訪問をお願いします。2頭います（2頭まで同額と伺いました）。1頭は人見知りですが、ご飯とトイレ掃除だけでも大丈夫です。隠れ場所は面談時にお伝えします。",
    applies: 4,
  },
];

export const bookings: Booking[] = [
  {
    id: 1,
    carer: "さとう まりな",
    service: "散歩代行",
    date: "6月3日（火）10:00〜11:00",
    petId: 1,
    status: "確定済み",
    price: "¥3,000",
  },
  {
    id: 2,
    carer: "ほしの みお",
    service: "キャットシッター",
    date: "6月10〜12日（1日1回 60分）",
    petId: 2,
    status: "支払い待ち",
    price: "¥12,000",
  },
  {
    id: 3,
    carer: "さとう まりな",
    service: "散歩代行",
    date: "5月20日",
    petId: 1,
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
    name: "小林 なつみ",
    area: "藤沢・辻堂",
    services: "キャットシッター / 宿泊",
    license: "神奈川県 第12-5540号",
    cert: "キャットシッター検定 上級",
    document: "確認済み",
    date: "2026/05/29",
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
