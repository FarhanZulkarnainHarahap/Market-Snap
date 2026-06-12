import { SnapCatalogPage } from "@/components/snap/SnapCatalogPage";

type CatalogPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function CustomerCatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  return <SnapCatalogPage initialSearch={params.search ?? ""} />;
}
