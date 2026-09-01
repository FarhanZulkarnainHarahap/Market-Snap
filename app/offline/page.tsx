import Link from "next/link";

export default function OfflinePage() {
  return <main className="system-state-page"><section><h1>Anda sedang offline</h1><p>Hubungkan perangkat ke internet untuk memuat katalog terbaru, akun, checkout, dan status pembayaran.</p><Link className="primary-snap" href="/">Coba lagi</Link></section></main>;
}
