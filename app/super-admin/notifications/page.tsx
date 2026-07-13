import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminNotificationsPage() {
  return <DashboardFeaturePage active="admin" description="Kelola notifikasi sistem, broadcast, dan update operasional." eyebrow="Super Admin" resource="reports" role="admin" title="Notifications" />;
}
