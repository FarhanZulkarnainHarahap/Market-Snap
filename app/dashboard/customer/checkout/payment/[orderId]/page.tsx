import { redirect } from "next/navigation";

type Props = { params: Promise<{ orderId: string }> };

export default async function CustomerPaymentPage({ params }: Props) {
  const { orderId } = await params;
  redirect(`/payment/pending?order_id=${encodeURIComponent(orderId)}`);
}
