"use client";

export default function CustomerError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="oauth-callback-page">
      <section>
        <h1>Halaman customer belum dapat dimuat</h1>
        <p>Coba muat ulang halaman untuk mengambil data terbaru.</p>
        <button className="primary-snap wide" onClick={reset} type="button">Muat ulang</button>
      </section>
    </main>
  );
}
