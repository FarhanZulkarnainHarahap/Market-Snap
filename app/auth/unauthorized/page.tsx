import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="oauth-callback-page">
      <section>
        <h1>Akses tidak diizinkan</h1>
        <p>Akun kamu tidak memiliki akses ke halaman ini.</p>
        <Link className="primary-snap wide" href="/auth/login">Login ulang</Link>
      </section>
    </main>
  );
}
