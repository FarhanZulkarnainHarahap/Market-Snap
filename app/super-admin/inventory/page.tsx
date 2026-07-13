import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminInventoryPage() {
  return <DashboardFeaturePage active="admin" description="Pilih store dan pantau stok serta jurnal inventory lintas cabang." eyebrow="Super Admin" resource="products" role="admin" title="Inventory" />;
}
