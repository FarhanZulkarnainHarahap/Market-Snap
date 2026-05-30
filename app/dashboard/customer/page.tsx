import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function CustomerDashboardPage() {
  return (
    <DashboardFeaturePage
      active="customer"
      description="Ringkasan belanja customer, produk terdekat, order aktif, dan alamat pengiriman."
      eyebrow="Customer dashboard"
      resource="products"
      role="customer"
      title="Market Snap Customer"
      actions={[
        { label: "Catalog", href: "/dashboard/customer/catalog" },
        { label: "My Orders", href: "/dashboard/customer/my-orders" },
        { label: "Address", href: "/dashboard/customer/profile/address" }
      ]}
    />
  );
}
