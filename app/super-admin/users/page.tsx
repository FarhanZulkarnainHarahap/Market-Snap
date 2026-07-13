import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminUsersPage() {
  return <DashboardFeaturePage active="admin" description="Pantau customer, status verifikasi, dan aktivitas akun." eyebrow="Super Admin" resource="users" role="admin" title="Customer Management" />;
}
