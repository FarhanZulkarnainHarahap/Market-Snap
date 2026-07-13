import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminDiscountsPage() {
  return <DashboardFeaturePage active="adminStore" actions={[{ label: "Create Discount", href: "/store-admin/discounts/new" }]} description="Kelola discount dan promo khusus store yang ditugaskan." eyebrow="Store Admin" resource="discounts" role="adminStore" title="Discounts" />;
}
