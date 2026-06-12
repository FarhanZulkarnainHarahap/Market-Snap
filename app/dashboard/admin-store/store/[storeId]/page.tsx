import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

type Props = { params: Promise<{ storeId: string }> };

export default async function StoreAdminStoreDetailPage({ params }: Props) {
  const { storeId } = await params;
  return <DashboardFeaturePage active="adminStore" description="Detail cabang untuk monitoring operasional store admin." detailId={storeId} eyebrow="Store admin" resource="stores" role="adminStore" title="Store Detail" />;
}
