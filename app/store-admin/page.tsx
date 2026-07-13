import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminPage() {
  return <DashboardFeaturePage active="adminStore" description="Dashboard store yang ditugaskan, berisi order, inventory, promo, dan laporan cabang." eyebrow="Store Admin" resource="orders" role="adminStore" title="Store Dashboard" />;
}
