import { SnapProductPage } from "@/components/snap/SnapProductPage";

type Props = { params: Promise<{ productId: string }> };

export default async function CustomerProductDetailPage({ params }: Props) {
  const { productId } = await params;
  return <SnapProductPage productId={productId} />;
}
