import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminInventoryPage() {
  return <DashboardFeaturePage active="adminStore" description="Store admin mencatat jurnal stok masuk dan keluar pada cabang yang ditugaskan." eyebrow="Store admin" resource="products" role="adminStore" title="Inventory Management" />;
}
