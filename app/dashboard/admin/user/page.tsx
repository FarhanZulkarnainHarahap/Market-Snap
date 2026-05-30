import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminUserPage() {
  return <DashboardFeaturePage active="admin" description="Daftar semua user teregistrasi, customer, super admin, dan store admin." eyebrow="Super admin" resource="users" role="admin" title="User Management" />;
}
