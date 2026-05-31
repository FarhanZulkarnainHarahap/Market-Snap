import { PublicCatalog } from "../../components/PublicCatalog";

type CatalogPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  return <PublicCatalog initialSearch={params.search ?? ""} />;
}
