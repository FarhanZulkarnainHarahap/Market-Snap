import { SnapProductPage } from "@/components/snap/SnapProductPage";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <SnapProductPage productId={slug} />;
}
