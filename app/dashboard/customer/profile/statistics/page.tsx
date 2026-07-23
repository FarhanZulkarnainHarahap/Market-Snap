import { AccountLayout, StatisticsAccountContent } from "@/components/snap/AccountPages";

export default function CustomerStatisticsPage() {
  return (
    <AccountLayout
      active="statistics"
      description="Pantau pengeluaran, frekuensi order, status pesanan, dan kategori produk dari data belanja Market Snap."
      title="Statistik belanja."
    >
      <StatisticsAccountContent />
    </AccountLayout>
  );
}
