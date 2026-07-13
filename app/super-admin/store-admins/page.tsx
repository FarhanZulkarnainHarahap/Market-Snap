import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminStoreAdminsPage() {
  return <DashboardFeaturePage active="admin" actions={[{ label: "Create Store Admin", href: "/super-admin/store-admins/new" }]} description="Kelola Store Admin dan assignment store yang tervalidasi server." eyebrow="Super Admin" resource="users" role="admin" title="Store Admin Management" />;
}
