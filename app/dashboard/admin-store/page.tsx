import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminStorePage() {
  return (
    <DashboardFeaturePage
      active="adminStore"
      description="Store admin mengelola stok, produk cabang, promo cabang, dan order pada toko yang ditugaskan."
      eyebrow="Store admin dashboard"
      resource="orders"
      role="adminStore"
      title="Operasional Cabang Kemang"
      actions={[
        { label: "Inventory", href: "/dashboard/admin-store/inventory-management" },
        { label: "Manage Order", href: "/dashboard/admin-store/manage-order" },
        { label: "Discount", href: "/dashboard/admin-store/discount" }
      ]}
    />
  );
}
