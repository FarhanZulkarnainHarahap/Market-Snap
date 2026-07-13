import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminSettingsPage() {
  return <DashboardFeaturePage active="admin" description="Konfigurasi sistem, auto-confirm, payment, dan operational rule." eyebrow="Super Admin" resource="reports" role="admin" title="Settings" />;
}
