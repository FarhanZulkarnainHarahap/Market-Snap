import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminCategoryPage() {
  return <DashboardFeaturePage active="admin" description="Manajemen kategori produk dengan validasi nama kategori unik." eyebrow="Super admin" resource="categories" role="admin" title="Category Management" />;
}
