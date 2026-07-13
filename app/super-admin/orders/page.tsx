import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminOrdersPage() {
  return <DashboardFeaturePage active="admin" description="Pantau order seluruh store dengan filter store, status, tanggal, dan pembayaran." eyebrow="Super Admin" resource="orders" role="admin" title="Order Management" />;
}
