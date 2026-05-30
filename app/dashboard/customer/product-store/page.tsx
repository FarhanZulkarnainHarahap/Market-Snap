import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function CustomerProductStorePage() {
  return <DashboardFeaturePage active="customer" description="Daftar toko cabang dan produk yang dilayani berdasarkan lokasi customer." eyebrow="Customer store" resource="stores" role="customer" title="Product Store" />;
}
