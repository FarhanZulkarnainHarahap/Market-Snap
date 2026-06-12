import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminProductPage() {
  return <DashboardFeaturePage active="adminStore" description="Store admin melihat product catalog cabang dan stok yang tersedia." eyebrow="Store admin" resource="products" role="adminStore" title="Product" />;
}
