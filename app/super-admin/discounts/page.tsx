import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function SuperAdminDiscountsPage() {
  return <DashboardFeaturePage active="admin" actions={[{ label: "Create Discount", href: "/super-admin/discounts/new" }]} description="Kelola discount, voucher, quota, periode aktif, dan rule promo lintas store." eyebrow="Super Admin" resource="discounts" role="admin" title="Discount Management" />;
}
