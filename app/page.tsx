import type { Metadata } from "next";
import { CustomerHomePage } from "@/components/snap/CustomerHomePage";

export const metadata: Metadata = {
  title: "Market Snap | Grocery dari cabang terdekat",
  description: "Belanja grocery segar, cek stok cabang terdekat, dan lihat promo Market Snap tanpa login."
};

export default function HomePage() {
  return <CustomerHomePage />;
}
