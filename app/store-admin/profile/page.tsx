import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminProfilePage() {
  return <DashboardFeaturePage active="adminStore" description="Profil Store Admin, keamanan akun, dan informasi assignment store." eyebrow="Store Admin" resource="users" role="adminStore" title="Profile" />;
}
