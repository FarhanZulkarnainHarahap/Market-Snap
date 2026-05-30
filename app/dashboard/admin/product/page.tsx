import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminProductPage() {
  return (
    <DashboardFeaturePage
      active="admin"
      actions={[{ label: "Create Product", href: "/dashboard/admin/product/create" }]}
      description="Super admin membuat, mengubah, menghapus, dan memonitor produk semua cabang."
      eyebrow="Super admin"
      resource="products"
      role="admin"
      title="Product Management"
    />
  );
}
