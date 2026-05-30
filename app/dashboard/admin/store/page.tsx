import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminStorePage() {
  return (
    <DashboardFeaturePage
      active="admin"
      actions={[{ label: "Create Store", href: "/dashboard/admin/store/create" }]}
      description="Super admin mengelola cabang, radius layanan, dan koordinat toko."
      eyebrow="Super admin"
      resource="stores"
      role="admin"
      title="Store Management"
    />
  );
}
