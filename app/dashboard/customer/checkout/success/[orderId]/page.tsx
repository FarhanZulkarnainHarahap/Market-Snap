import { redirect } from "next/navigation";

type Props = { params: Promise<{ orderId: string }> };

export default async function CustomerCheckoutSuccessPage({ params }: Props) {
  const { orderId } = await params;
  redirect(`/payment/finish?order_id=${encodeURIComponent(orderId)}`);
}
