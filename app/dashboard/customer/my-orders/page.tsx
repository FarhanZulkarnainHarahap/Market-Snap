import { AccountLayout, OrdersAccountContent } from "@/components/snap/AccountPages";

export default function CustomerOrdersPage() {
  return (
    <AccountLayout
      active="orders"
      description="Pantau status pesanan, pembayaran, pengiriman, dan riwayat belanja dari satu halaman."
      title="Riwayat pesananmu."
    >
      <OrdersAccountContent />
    </AccountLayout>
  );
}
