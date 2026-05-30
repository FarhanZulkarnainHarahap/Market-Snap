import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

type Props = { params: Promise<{ productId: string }> };

export default async function CustomerProductDetailPage({ params }: Props) {
  const { productId } = await params;
  return <DashboardFeaturePage active="customer" description="Detail produk, harga, promo, dan stok pada toko terdekat." detailId={productId} eyebrow="Customer product" resource="products" role="customer" title="Product Detail" />;
}
