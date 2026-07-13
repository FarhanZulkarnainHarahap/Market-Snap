import { AccountLayout, OrdersAccountContent } from "@/components/snap/AccountPages";

export default function CustomerProfileOrderDetailPage() {
  return (
    <AccountLayout
      active="orders"
      description="Detail pesanan, status pembayaran, pengiriman, dan invoice."
      title="Detail pesanan."
    >
      <OrdersAccountContent />
    </AccountLayout>
  );
}
