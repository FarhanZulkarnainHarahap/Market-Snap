import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminReportsPage() {
  return <DashboardFeaturePage active="admin" description="Laporan penjualan dan stok seluruh store dengan filter lintas cabang." eyebrow="Super Admin" resource="reports" role="admin" title="Reports" />;
}
