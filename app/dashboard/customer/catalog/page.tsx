import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function CustomerCatalogPage() {
  return <DashboardFeaturePage active="customer" description="Catalog produk dari API berdasarkan stok cabang terdekat." eyebrow="Customer catalog" resource="products" role="customer" title="Product Catalog" />;
}
