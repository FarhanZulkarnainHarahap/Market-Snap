export type SnapProduct = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  promo?: boolean;
};

export const branches = [
  {
    id: "kemang",
    name: "Market Snap Kemang",
    area: "Jakarta Selatan",
    address: "Jl. Kemang Raya No. 72, Bangka, Mampang Prapatan, Jakarta Selatan",
    distance: "1.2 km",
    radius: "3 km",
    hours: "06:00 - 22:00"
  },
  {
    id: "bangka",
    name: "Market Snap Bangka",
    area: "Jakarta Selatan",
    address: "Jl. Bangka Raya No. 18, Jakarta Selatan",
    distance: "2.4 km",
    radius: "4 km",
    hours: "06:00 - 22:00"
  }
];

export const products: SnapProduct[] = [
  {
    id: "apel-fuji-premium",
    name: "Apel Fuji Premium",
    category: "Buah",
    unit: "1 kg",
    price: 38900,
    image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=700&q=80",
    stock: 24,
    rating: 4.8,
    reviews: 128,
    promo: true
  },
  {
    id: "jeruk-manis-lokal",
    name: "Jeruk Manis Lokal",
    category: "Buah",
    unit: "1 kg",
    price: 19900,
    image: "https://images.unsplash.com/photo-1587213811864-46e59f6873b1?auto=format&fit=crop&w=700&q=80",
    stock: 39,
    rating: 4.7,
    reviews: 98
  },
  {
    id: "anggur-red-globe",
    name: "Anggur Red Globe",
    category: "Buah",
    unit: "500 g",
    price: 32500,
    image: "https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=700&q=80",
    stock: 18,
    rating: 4.9,
    reviews: 75
  },
  {
    id: "alpukat-mentega",
    name: "Alpukat Mentega",
    category: "Buah",
    unit: "1 buah",
    price: 6900,
    image: "https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=700&q=80",
    stock: 42,
    rating: 4.8,
    reviews: 64
  },
  {
    id: "bayam-segar",
    name: "Bayam Segar",
    category: "Sayur",
    unit: "250 g",
    price: 6900,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80",
    stock: 52,
    rating: 4.7,
    reviews: 88
  },
  {
    id: "wortel-berastagi",
    name: "Wortel Berastagi",
    category: "Sayur",
    unit: "500 g",
    price: 7900,
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=80",
    stock: 33,
    rating: 4.6,
    reviews: 56
  },
  {
    id: "brokoli-segar",
    name: "Brokoli Segar",
    category: "Sayur",
    unit: "250 g",
    price: 9900,
    image: "https://images.unsplash.com/photo-1584559582128-b8be739912e1?auto=format&fit=crop&w=700&q=80",
    stock: 28,
    rating: 4.8,
    reviews: 71
  },
  {
    id: "telur-ayam-negeri",
    name: "Telur Ayam Negeri",
    category: "Dairy & Telur",
    unit: "10 pcs",
    price: 25900,
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=80",
    stock: 40,
    rating: 4.9,
    reviews: 112
  },
  {
    id: "susu-uht-full-cream",
    name: "Susu UHT Full Cream",
    category: "Dairy & Telur",
    unit: "1 L",
    price: 18900,
    image: "/juice.png",
    stock: 36,
    rating: 4.8,
    reviews: 93
  },
  {
    id: "roti-tawar-premium",
    name: "Roti Tawar Premium",
    category: "Roti & Bakery",
    unit: "1 pack",
    price: 15900,
    image: "/bread.png",
    stock: 28,
    rating: 4.7,
    reviews: 67
  },
  {
    id: "minyak-goreng-sunco",
    name: "Minyak Goreng SunCo",
    category: "Sembako",
    unit: "2 L",
    price: 34900,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80",
    stock: 21,
    rating: 4.8,
    reviews: 102,
    promo: true
  },
  {
    id: "beras-premium",
    name: "Beras Premium",
    category: "Sembako",
    unit: "5 kg",
    price: 64900,
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=700&q=80",
    stock: 15,
    rating: 4.9,
    reviews: 89
  }
];

export const cartItems = [
  { product: products[0], quantity: 1 },
  { product: products[4], quantity: 2 },
  { product: products[7], quantity: 1 },
  { product: products[8], quantity: 1 }
];

export function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value).replace("IDR", "Rp");
}
