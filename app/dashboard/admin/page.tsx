import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function AdminPage() {
  return (
    <DashboardFeaturePage
      active="admin"
      description="Super admin mengelola toko, produk, kategori, user, inventory, dan laporan lintas cabang."
      eyebrow="Super admin dashboard"
      resource="stores"
      role="admin"
      title="Kelola Market Snap"
      actions={[
        { label: "Store", href: "/dashboard/admin/store" },
        { label: "Product", href: "/dashboard/admin/product" },
        { label: "User Store", href: "/dashboard/admin/user-store" }
      ]}
    />
  );
}
