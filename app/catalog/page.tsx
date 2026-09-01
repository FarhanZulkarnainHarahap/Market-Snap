import { SnapCatalogPage } from "@/components/snap/SnapCatalogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Grocery",
  description: "Temukan produk grocery aktif dan stok dari cabang Market Snap terdekat.",
  alternates: { canonical: "/catalog" }
};

type CatalogPageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  return <SnapCatalogPage initialSearch={params.search ?? ""} />;
}
