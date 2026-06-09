import { FiCheckCircle, FiClock, FiHeadphones, FiMail, FiMapPin, FiMessageCircle, FiPhone, FiSend, FiShield, FiShoppingBag, FiStar, FiUsers } from "react-icons/fi";
import { BenefitStrip, GroceryVisual, SnapFooter, SnapHeader } from "./SnapCommon";

export function SnapAboutPage() {
  return (
    <>
      <SnapHeader active="about" />
      <main>
        <section className="info-hero">
          <div>
            <span className="eyebrow">About Market Snap</span>
            <h1>Belanja segar dari cabang yang paling dekat.</h1>
            <p>Market Snap menghubungkan Anda dengan inventori aktual dari cabang terdekat. Produk segar, siap diambil atau dikirim cepat langsung dari toko kami.</p>
            <div className="feature-row"><span>Segar setiap hari</span><span>Dari cabang terdekat</span><span>Cepat & terpercaya</span></div>
          </div>
          <GroceryVisual compact />
        </section>
        <section className="about-cards-grid">
          {[
            ["Nearest Store", "Kami menemukan cabang Market Snap paling dekat dari lokasi Anda secara otomatis."],
            ["Branch Inventory", "Semua produk ditampilkan berdasarkan stok aktual dari cabang terpilih."],
            ["Smart Checkout", "Checkout cepat & aman dengan pilihan ambil di toko atau kirim ke rumah."]
          ].map(([title, text]) => <article key={title}><FiShoppingBag /><h3>{title}</h3><p>{text}</p><ul><li>Stok real-time</li><li>Informasi transparan</li><li>Selalu up-to-date</li></ul></article>)}
        </section>
        <section className="mission-row">
          <article><span className="eyebrow">Our Mission</span><h2>Membuat belanja harian lebih mudah, segar, dan dekat dengan Anda.</h2><p>Kami membangun sistem yang menghubungkan pelanggan dengan cabang terdekat dan inventori nyata di toko.</p></article>
          <div className="stats-card"><Stat icon={<FiMapPin />} value="25+" label="Cabang Aktif" /><Stat icon={<FiUsers />} value="50K+" label="Pelanggan" /><Stat icon={<FiShoppingBag />} value="2K+" label="Produk Segar" /><Stat icon={<FiStar />} value="4.9" label="Rating" /></div>
        </section>
        <section className="flow-card"><h2>Bagaimana Market Snap Bekerja</h2><div>{["Pilih Lokasi", "Temukan Cabang", "Lihat Stok", "Checkout", "Terima Pesanan"].map((step, index) => <span key={step}><b>{index + 1}</b>{step}</span>)}</div></section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

export function SnapContactPage() {
  const contacts = [
    { icon: FiHeadphones, title: "Customer Care", text: "0812-3456-7890" },
    { icon: FiMail, title: "Email", text: "hello@marketsnap.id" },
    { icon: FiPhone, title: "WhatsApp", text: "0812-3456-7890" },
    { icon: FiClock, title: "Jam Layanan", text: "06:00 - 22:00 WIB" },
    { icon: FiMapPin, title: "Alamat Cabang Kemang", text: "Jl. Kemang Raya No. 72, Jakarta Selatan" }
  ];

  return (
    <>
      <SnapHeader active="contact" />
      <main>
        <section className="info-hero">
          <div><h1>Kami siap membantu kebutuhan belanjamu.</h1><p>Punya pertanyaan, butuh bantuan, atau ingin bekerja sama? Tim Market Snap selalu siap membantu dengan cepat dan ramah.</p></div>
          <GroceryVisual compact />
        </section>
        <section className="contact-capture-grid">
          <aside className="contact-list-panel">
            {contacts.map(({ icon: Icon, title, text }) => <article key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div></article>)}
            <div className="whatsapp-box"><FiMessageCircle /><div><h3>Butuh bantuan lebih cepat?</h3><p>Hubungi kami via WhatsApp sekarang.</p><button type="button">Chat via WhatsApp</button></div></div>
          </aside>
          <form className="message-form">
            <h2>Kirim pesan untuk kami</h2>
            <p>Isi formulir di bawah ini dan tim kami akan segera merespons.</p>
            <label>Nama<input placeholder="Masukkan nama lengkap" /></label>
            <label>Email<input placeholder="Masukkan email aktif" /></label>
            <label>Subjek<select><option>Pilih subjek pesan</option></select></label>
            <label>Pesan<textarea placeholder="Tulis pesanmu di sini..." rows={7} /></label>
            <p><FiShield /> Kami menjaga kerahasiaan data dan tidak akan membagikannya kepada pihak lain.</p>
            <button className="primary-snap wide" type="button">Kirim pesan <FiSend /></button>
          </form>
        </section>
        <section className="faq-row">{["Bagaimana cara melacak pesanan saya?", "Apa saja metode pembayaran?", "Apakah saya bisa membatalkan pesanan?", "Bagaimana jika pesanan tidak lengkap?"].map((faq) => <button key={faq} type="button"><FiCheckCircle /> {faq} +</button>)}</section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div>{icon}<strong>{value}</strong><span>{label}</span></div>;
}
