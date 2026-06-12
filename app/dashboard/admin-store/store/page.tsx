import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminStorePage() {
  return <DashboardFeaturePage active="adminStore" description="Informasi toko cabang yang ditugaskan kepada store admin." eyebrow="Store admin" resource="stores" role="adminStore" title="Store" />;
}
