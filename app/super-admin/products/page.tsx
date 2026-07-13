import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminProductsPage() {
  return <DashboardFeaturePage active="admin" actions={[{ label: "Create Product", href: "/super-admin/products/new" }]} description="Kelola katalog produk global yang digunakan seluruh store." eyebrow="Super Admin" resource="products" role="admin" title="Product Management" />;
}
