"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="system-state-page"><section><h1>Terjadi kendala</h1><p>Halaman belum dapat dimuat. Tidak ada transaksi yang dianggap berhasil dari tampilan ini.</p><button className="primary-snap" onClick={retry} type="button">Coba lagi</button></section></main>;
}
