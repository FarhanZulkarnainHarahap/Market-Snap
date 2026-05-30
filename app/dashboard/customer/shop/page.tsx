import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function CustomerShopPage() {
  return <DashboardFeaturePage active="customer" description="Halaman belanja utama untuk melihat produk, promo, kategori, dan stok cabang." eyebrow="Customer shop" resource="products" role="customer" title="Shop" />;
}
