import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminInventoryPage() {
  return <DashboardFeaturePage active="adminStore" description="Kelola stok masuk/keluar dan jurnal inventory untuk store yang ditugaskan." eyebrow="Store Admin" resource="products" role="adminStore" title="Inventory" />;
}
