import type { OrderStatus, Product, Store } from "./types";

export const stores: Store[] = [
  { id: "kemang", name: "Market Snap Kemang", area: "Jakarta Selatan", lat: -6.2607, lng: 106.8106, radiusKm: 12, eta: "18-28 min" },
  { id: "bsd", name: "Market Snap BSD", area: "Tangerang Selatan", lat: -6.3025, lng: 106.6527, radiusKm: 10, eta: "20-32 min" },
  { id: "bekasi", name: "Market Snap Bekasi", area: "Bekasi", lat: -6.2383, lng: 106.9756, radiusKm: 11, eta: "22-35 min" }
];

export const categories = ["Semua", "Buah", "Sayur", "Dairy", "Protein", "Pantry"];

export const products: Product[] = [
  item("apel", "Apel Fuji Snap Pack", "Buah", 42000, "kg", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80", "10%", "Pilihan"),
  item("pisang", "Pisang Cavendish", "Buah", 28000, "sisir", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"),
  item("bayam", "Bayam Organik", "Sayur", 14000, "ikat", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80", "BOGO"),
  item("wortel", "Wortel Berastagi", "Sayur", 18000, "500g", "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=600&q=80"),
  item("susu", "Susu Fresh Low Fat", "Dairy", 24000, "1L", "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80", "8%"),
  item("yogurt", "Greek Yogurt Plain", "Dairy", 32000, "cup", "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80"),
  item("ayam", "Dada Ayam Fillet", "Protein", 52000, "500g", "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80", "15rb"),
  item("telur", "Telur Omega", "Protein", 36000, "10 pcs", "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80"),
  item("beras", "Beras Pulen Premium", "Pantry", 78000, "5kg", "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80"),
  item("minyak", "Minyak Canola", "Pantry", 46000, "1L", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80", "12%")
];

export const orderStatuses: OrderStatus[] = [
  "Menunggu Pembayaran",
  "Menunggu Konfirmasi Pembayaran",
  "Diproses",
  "Dikirim",
  "Pesanan Dikonfirmasi",
  "Dibatalkan"
];

export const vouchers = [
  { code: "SNAPWELCOME", title: "Referral Fresh Start", detail: "15% sampai Rp35.000 untuk belanja pertama." },
  { code: "SNAPSHIP", title: "Gratis Ongkir Loyal", detail: "Voucher ongkir setelah 3 transaksi selesai." },
  { code: "BOGOGREEN", title: "Beli 1 Gratis 1", detail: "Khusus produk sayur pilihan di cabang terdekat." }
];

function item(
  id: string,
  name: string,
  category: string,
  price: number,
  unit: string,
  image: string,
  discount?: string,
  badge?: string
): Product {
  return {
    id,
    name,
    category,
    price,
    unit,
    image,
    discount,
    badge,
    stockByStore: {
      kemang: stock(id, 0),
      bsd: stock(id, 1),
      bekasi: stock(id, 2)
    }
  };
}

function stock(id: string, index: number) {
  const table: Record<string, number[]> = {
    apel: [24, 12, 8],
    pisang: [30, 0, 18],
    bayam: [19, 25, 0],
    wortel: [32, 28, 14],
    susu: [14, 8, 11],
    yogurt: [18, 16, 7],
    ayam: [11, 5, 15],
    telur: [44, 35, 22],
    beras: [21, 18, 9],
    minyak: [16, 0, 10]
  };
  return table[id][index];
}
