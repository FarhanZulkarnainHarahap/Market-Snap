import type { Metadata } from "next";
import { MarketHome } from "@/components/MarketHome";

export const metadata: Metadata = {
  title: "Market Snap | Grocery dari cabang terdekat",
  description: "Belanja grocery segar, cek stok cabang terdekat, dan lihat promo Market Snap tanpa login."
};

export default function HomePage() {
  return <MarketHome />;
}
