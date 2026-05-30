import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function CustomerProductPage() {
  return <DashboardFeaturePage active="customer" description="Produk grocery lengkap yang dapat ditambahkan ke cart setelah login dan terverifikasi." eyebrow="Customer product" resource="products" role="customer" title="Products" />;
}
