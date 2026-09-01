import Link from "next/link";
import { SnapFooter, SnapHeader } from "@/components/snap/SnapCommon";

export default function NotFound() {
  return <><SnapHeader simple /><main className="system-state-page"><section><span>404</span><h1>Halaman tidak ditemukan</h1><p>Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.</p><Link className="primary-snap" href="/">Kembali ke beranda</Link></section></main><SnapFooter /></>;
}
