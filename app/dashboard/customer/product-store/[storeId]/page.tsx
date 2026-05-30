import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

type Props = { params: Promise<{ storeId: string }> };

export default async function CustomerProductStoreDetailPage({ params }: Props) {
  const { storeId } = await params;
  return <DashboardFeaturePage active="customer" description="Produk dan jangkauan layanan dari toko cabang yang dipilih." detailId={storeId} eyebrow="Customer store" resource="stores" role="customer" title="Store Detail" />;
}
