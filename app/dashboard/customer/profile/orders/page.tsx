import { AccountLayout, OrdersAccountContent } from "@/components/snap/AccountPages";

export default function CustomerProfileOrdersPage() {
  return (
    <AccountLayout
      active="orders"
      description="Pantau status pesanan, pembayaran, pengiriman, dan riwayat belanja dari satu halaman."
      title="Pesanan saya."
    >
      <OrdersAccountContent />
    </AccountLayout>
  );
}
