import Link from "next/link";

type Props = { params: Promise<{ orderId: string }> };

export default async function CustomerCheckoutSuccessPage({ params }: Props) {
  const { orderId } = await params;
  return (
    <main className="oauth-callback-page">
      <section>
        <h1>Checkout berhasil</h1>
        <p>Pesanan {orderId} sudah dibuat. Kamu bisa memantau statusnya dari profil.</p>
        <Link className="primary-snap wide" href="/dashboard/customer/profile/orders">Lihat pesanan</Link>
      </section>
    </main>
  );
}
