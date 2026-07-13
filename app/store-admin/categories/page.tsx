import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminCategoriesPage() {
  return <DashboardFeaturePage active="adminStore" description="Kategori produk global untuk store ini. Store Admin memiliki akses read-only." eyebrow="Store Admin" resource="categories" role="adminStore" title="Categories Read Only" />;
}
