import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const folders = [
  "brand",
  "banners",
  "categories",
  "products",
  "illustrations",
  "icons",
  "badges",
  "payment-methods",
  "shipping",
  "stores",
  "testimonials",
  "placeholders"
];

const categories = [
  "Sayur", "Buah", "Daging", "Ayam", "Seafood", "Susu dan Dairy", "Roti", "Telur", "Frozen Food", "Minuman",
  "Snack", "Bumbu Dapur", "Beras dan Bahan Pokok", "Makanan Instan", "Produk Organik", "Kebutuhan Bayi",
  "Personal Care", "Home Care", "Pet Supplies", "Promo Hari Ini"
];

const products = [
  "Apel Fuji Premium", "Pisang Cavendish", "Jeruk Manis Lokal", "Anggur Red Globe", "Alpukat Mentega", "Strawberry Fresh Pack", "Lemon California", "Nanas Madu", "Mangga Harum Manis", "Semangka Merah Potong",
  "Bayam Hijau Segar", "Wortel Berastagi", "Brokoli Hijau", "Tomat Merah", "Kentang Dieng", "Selada Romaine", "Timun Jepang", "Paprika Mix", "Kangkung Hidroponik", "Pakcoy Organik",
  "Daging Sapi Slice", "Daging Sapi Giling", "Rendang Beef Cubes", "Sosis Sapi Premium", "Ayam Broiler Utuh", "Dada Ayam Fillet", "Paha Ayam Boneless", "Sayap Ayam Marinasi", "Udang Vaname Kupas", "Ikan Salmon Fillet",
  "Cumi Ring Frozen", "Ikan Dori Fillet", "Susu UHT Full Cream", "Greek Yogurt Plain", "Keju Cheddar Slice", "Mentega Tawar", "Roti Tawar Gandum", "Croissant Butter", "Donat Gula Halus", "Bagel Wijen",
  "Telur Ayam Negeri", "Telur Omega", "Telur Bebek", "Telur Puyuh", "Nugget Ayam", "Kentang Goreng Shoestring", "Dimsum Ayam Frozen", "Bakso Sapi Frozen", "Air Mineral Botol", "Jus Jeruk Fresh",
  "Teh Hijau Botol", "Kopi Susu Dingin", "Keripik Kentang Original", "Granola Bar Madu", "Kacang Almond Panggang", "Biskuit Gandum", "Bawang Merah Kupas", "Bawang Putih Kating", "Cabai Rawit Merah", "Jahe Merah",
  "Beras Pulen Premium", "Minyak Goreng Sunflower", "Gula Pasir Kristal", "Tepung Terigu Serbaguna", "Mie Instan Goreng", "Bubur Instan Ayam", "Sup Krim Jagung Instan", "Pasta Saus Bolognese", "Beras Merah Organik", "Madu Hutan Organik",
  "Tofu Sutra Organik", "Puree Bayi Wortel", "Biskuit Bayi Beras", "Popok Bayi M", "Sabun Mandi Cair", "Sampo Aloe Vera", "Pasta Gigi Herbal", "Tisu Dapur Roll", "Sabun Cuci Piring Lemon", "Deterjen Cair",
  "Pembersih Lantai", "Makanan Kucing Tuna", "Pasir Kucing Wangi", "Snack Anjing Dental", "Paket Hemat Sayur Sop", "Paket Sarapan Keluarga", "Bundle Buah Bekal Anak"
];

const banners = [
  "Belanja Bulanan", "Fresh Morning Sale", "Weekend Grocery", "Gratis Ongkir", "Diskon Buah Sayur", "Paket Keluarga",
  "Healthy Living", "Sarapan Hemat", "Promo Pengguna Baru", "Flash Sale", "Produk Lokal", "Kebutuhan Rumah"
];

for (const folder of folders) {
  await mkdir(path.join(root, "public", folder), { recursive: true });
}

await Promise.all([
  ...products.map((name, index) => writeAsset("products", `${slugify(name)}.svg`, productSvg(name, index))),
  ...categories.map((name, index) => writeAsset("categories", `${slugify(name)}.svg`, iconSvg(name, index))),
  ...banners.map((name, index) => writeAsset("banners", `${slugify(name)}.svg`, bannerSvg(name, index))),
  ...["logo-horizontal", "logo-vertical", "logo-icon", "logo-mono-light", "logo-mono-dark", "og-image", "apple-touch-icon", "pwa-192", "pwa-512"].map((name, index) => writeAsset("brand", `${name}.svg`, brandSvg(name, index))),
  ...["cart-empty", "search-empty", "payment-empty", "address-empty", "error-network", "error-payment", "loading-products", "loading-dashboard"].map((name, index) => writeAsset("placeholders", `${name}.svg`, placeholderSvg(name, index))),
  ...["delivery-bike", "delivery-van", "store-front", "payment-xendit", "voucher-card", "fresh-badge", "low-stock", "organic-choice"].map((name, index) => writeAsset("illustrations", `${name}.svg`, illustrationSvg(name, index)))
]);

console.log(`Generated ${products.length} product assets and ${categories.length} category assets.`);

function writeAsset(folder, filename, content) {
  return writeFile(path.join(root, "public", folder, filename), content, "utf8");
}

function productSvg(name, index) {
  const [a, b] = palette(index);
  return baseSvg(name, a, b, `
    <rect x="62" y="70" width="276" height="210" rx="32" fill="white" opacity=".88"/>
    <circle cx="150" cy="170" r="58" fill="${b}" opacity=".9"/>
    <circle cx="220" cy="160" r="44" fill="${a}" opacity=".8"/>
    <path d="M128 125c30-40 90-40 122 0-34-13-72-13-122 0Z" fill="#168A4A"/>
    <path d="M101 245c58 30 151 30 208 0" fill="none" stroke="#0B5D35" stroke-width="10" stroke-linecap="round"/>
  `);
}

function iconSvg(name, index) {
  const [a, b] = palette(index);
  return baseSvg(name, a, b, `
    <rect x="85" y="70" width="230" height="230" rx="52" fill="white" opacity=".9"/>
    <path d="M126 220c62-98 128-96 154-18 8 25-9 55-37 64-48 15-113-4-117-46Z" fill="${a}"/>
    <path d="M154 147c36-35 79-38 112-14-43 3-78 18-112 14Z" fill="${b}"/>
  `);
}

function bannerSvg(name, index) {
  const [a, b] = palette(index);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="420" viewBox="0 0 1200 420" role="img" aria-label="${escapeXml(name)}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="1200" height="420" rx="32" fill="url(#g)"/>
    <circle cx="980" cy="96" r="160" fill="#fff" opacity=".24"/><circle cx="1040" cy="310" r="130" fill="#0B5D35" opacity=".16"/>
    <text x="74" y="160" fill="#17211B" font-family="Arial, sans-serif" font-size="56" font-weight="900">${escapeXml(name)}</text>
    <text x="78" y="220" fill="#17211B" font-family="Arial, sans-serif" font-size="28" font-weight="700">Fresh deals from your nearest branch</text>
    <rect x="78" y="270" width="220" height="58" rx="18" fill="#17211B"/><text x="110" y="308" fill="#fff" font-family="Arial, sans-serif" font-size="24" font-weight="800">Shop now</text>
  </svg>`;
}

function brandSvg(name, index) {
  const [a, b] = palette(index);
  return baseSvg("Market Snap", a, b, `
    <rect x="76" y="104" width="248" height="164" rx="42" fill="#fff" opacity=".92"/>
    <path d="M135 198h132l-18 48H153l-18-48Z" fill="#168A4A"/>
    <path d="M155 196c0-44 88-44 88 0" fill="none" stroke="#0B5D35" stroke-width="14" stroke-linecap="round"/>
    <text x="200" y="318" text-anchor="middle" fill="#17211B" font-family="Arial, sans-serif" font-size="31" font-weight="900">${escapeXml(name.includes("icon") ? "MS" : "MARKET SNAP")}</text>
  `);
}

function placeholderSvg(name, index) {
  const [a, b] = palette(index);
  return baseSvg(name, a, b, `
    <rect x="84" y="102" width="232" height="150" rx="28" fill="#fff" opacity=".88"/>
    <path d="M120 210h160" stroke="#0B5D35" stroke-width="12" stroke-linecap="round" opacity=".65"/>
    <path d="M120 170h110" stroke="${a}" stroke-width="12" stroke-linecap="round"/>
  `);
}

function illustrationSvg(name, index) {
  const [a, b] = palette(index);
  return baseSvg(name, a, b, `
    <circle cx="200" cy="174" r="92" fill="#fff" opacity=".86"/>
    <path d="M134 210h132l28-72H166l-32 72Z" fill="${a}"/>
    <circle cx="168" cy="250" r="18" fill="#0B5D35"/><circle cx="268" cy="250" r="18" fill="#0B5D35"/>
    <path d="M174 136c32-40 78-39 104 0" fill="none" stroke="${b}" stroke-width="14" stroke-linecap="round"/>
  `);
}

function baseSvg(title, a, b, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="${escapeXml(title)}">
    <defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="400" height="400" rx="48" fill="#FFFDF5"/>
    <circle cx="326" cy="78" r="74" fill="${b}" opacity=".28"/><circle cx="74" cy="324" r="88" fill="${a}" opacity=".2"/>
    ${body}
  </svg>`;
}

function palette(index) {
  const palettes = [
    ["#B7E34A", "#FFD96A"], ["#168A4A", "#B7E34A"], ["#FF8A3D", "#FFD96A"], ["#8FD7FF", "#B7E34A"], ["#F7A7B8", "#FFD96A"], ["#7CD9A5", "#FFFDF5"]
  ];
  return palettes[index % palettes.length];
}

function slugify(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" })[char]);
}
