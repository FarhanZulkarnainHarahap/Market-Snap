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
        { label: "Inventory", href: "/dashboard/adminStore/inventory-management" },
        { label: "Manage Order", href: "/dashboard/adminStore/manage-order" },
        { label: "Discount", href: "/dashboard/adminStore/discount" }
      ]}
    />
  );
}
