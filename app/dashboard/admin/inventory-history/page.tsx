import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminInventoryHistoryPage() {
  return <DashboardFeaturePage active="admin" description="Laporan mutasi stok lintas cabang untuk audit barang masuk dan keluar." eyebrow="Super admin" resource="reports" role="admin" title="Inventory History" />;
}
