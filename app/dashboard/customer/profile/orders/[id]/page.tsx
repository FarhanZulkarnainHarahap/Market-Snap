import { AccountLayout, OrderDetailAccountContent } from "@/components/snap/AccountPages";

type Props = { params: Promise<{ id: string }> };

export default async function CustomerProfileOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <AccountLayout
      active="orders"
      description="Detail pesanan, status pembayaran, pengiriman, dan invoice."
      title="Detail pesanan."
    >
      <OrderDetailAccountContent orderId={id} />
    </AccountLayout>
  );
}
