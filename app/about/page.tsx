import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export default function AboutPage() {
  return (
    <>
      <Header active="about" />
      <main>
        <section className="public-page-heading">
          <span className="mini-label">About Market Snap</span>
          <h1>Belanja segar dari cabang yang paling dekat.</h1>
          <p>Market Snap menghubungkan customer dengan stok grocery cabang terdekat agar pengalaman belanja lebih cepat dan relevan.</p>
        </section>
        <section className="public-info-grid">
          <Info title="Nearest Store" text="Lokasi customer dipakai untuk merekomendasikan cabang dalam radius layanan." />
          <Info title="Branch Inventory" text="Stok yang tampil mengikuti ketersediaan produk pada cabang terpilih." />
          <Info title="Smart Checkout" text="Checkout mendukung kalkulasi ongkir dan invoice pembayaran online." />
        </section>
      </main>
      <Footer />
    </>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return <article className="public-info-card"><h2>{title}</h2><p>{text}</p></article>;
}
