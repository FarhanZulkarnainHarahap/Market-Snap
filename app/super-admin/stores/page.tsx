import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminStoresPage() {
  return <DashboardFeaturePage active="admin" actions={[{ label: "Create Store", href: "/super-admin/stores/new" }]} description="Kelola cabang, koordinat, radius layanan, status aktif, dan store utama." eyebrow="Super Admin" resource="stores" role="admin" title="Store Management" />;
}
