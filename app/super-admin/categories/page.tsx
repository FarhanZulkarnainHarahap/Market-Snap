import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminCategoriesPage() {
  return <DashboardFeaturePage active="admin" description="Kelola kategori global, urutan tampil, dan status kategori." eyebrow="Super Admin" resource="categories" role="admin" title="Category Management" />;
}
