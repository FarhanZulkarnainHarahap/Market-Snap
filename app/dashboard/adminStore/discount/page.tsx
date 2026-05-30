import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminDiscountPage() {
  return (
    <DashboardFeaturePage
      active="adminStore"
      actions={[{ label: "Create Discount", href: "/dashboard/adminStore/discount/create" }]}
      description="Kelola promo cabang seperti diskon produk, minimal belanja, voucher, dan BOGO."
      eyebrow="Store admin"
      resource="discounts"
      role="adminStore"
      title="Discount Management"
    />
  );
}
