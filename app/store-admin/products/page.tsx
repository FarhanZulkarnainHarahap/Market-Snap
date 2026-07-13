import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminProductsPage() {
  return <DashboardFeaturePage active="adminStore" description="Katalog produk global untuk store ini. Store Admin memiliki akses read-only." eyebrow="Store Admin" resource="products" role="adminStore" title="Products Read Only" />;
}
