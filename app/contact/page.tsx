import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

export default function ContactPage() {
  return (
    <>
      <Header active="contact" />
      <main>
        <section className="public-page-heading">
          <span className="mini-label">Contact</span>
          <h1>Kami siap membantu kebutuhan belanjamu.</h1>
          <p>Hubungi tim Market Snap untuk pertanyaan produk, pesanan, pengiriman, atau informasi cabang.</p>
        </section>
        <section className="contact-layout">
          <div className="public-info-card">
            <h2>Customer Care</h2>
            <p>Email: support@marketsnap.id</p>
            <p>WhatsApp: +62 812 3456 7890</p>
            <p>Jam layanan: 08.00 - 20.00 WIB</p>
          </div>
          <form className="form-card">
            <h2>Kirim pesan</h2>
            <label>Nama<input name="name" placeholder="Nama lengkap" required /></label>
            <label>Email<input name="email" placeholder="nama@email.com" required type="email" /></label>
            <label>Pesan<textarea name="message" placeholder="Apa yang bisa kami bantu?" required rows={5} /></label>
            <button className="primary-button" type="submit">Kirim pesan</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
