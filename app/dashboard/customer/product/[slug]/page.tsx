import { SnapProductPage } from "@/components/snap/SnapProductPage";

type Props = { params: Promise<{ slug: string }> };

export default async function CustomerProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return <SnapProductPage productId={slug} />;
}
