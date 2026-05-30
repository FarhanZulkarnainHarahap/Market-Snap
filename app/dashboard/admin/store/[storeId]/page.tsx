import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

type Props = { params: Promise<{ storeId: string }> };

export default async function AdminStoreDetailPage({ params }: Props) {
  const { storeId } = await params;
  return <DashboardFeaturePage active="admin" description="Detail cabang, admin toko, dan batas radius layanan." detailId={storeId} eyebrow="Super admin" resource="stores" role="admin" title="Store Detail" />;
}
