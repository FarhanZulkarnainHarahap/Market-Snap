import Link from "next/link";

type Props = { params: Promise<{ orderId: string }> };

export default async function CustomerPaymentPage({ params }: Props) {
  const { orderId } = await params;
  return (
    <main className="oauth-callback-page">
      <section>
        <h1>Pembayaran pesanan</h1>
        <p>Pesanan {orderId} sedang disiapkan untuk pembayaran.</p>
        <Link className="primary-snap wide" href="/dashboard/customer/profile/orders">Lihat pesanan</Link>
      </section>
    </main>
  );
}
