import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminUserStorePage() {
  return (
    <DashboardFeaturePage
      active="admin"
      actions={[{ label: "Create Store Admin", href: "/dashboard/admin/user-store/create" }]}
      description="Super admin membuat dan mengatur akun store admin."
      eyebrow="Super admin"
      resource="users"
      role="admin"
      title="Store Admin Users"
    />
  );
}
