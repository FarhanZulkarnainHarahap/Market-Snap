import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminCategoryPage() {
  return <DashboardFeaturePage active="adminStore" description="Store admin melihat kategori produk cabang secara read only." eyebrow="Store admin" resource="categories" role="adminStore" title="Category" />;
}
