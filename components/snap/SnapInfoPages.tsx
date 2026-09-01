"use client";

import { useState } from "react";
import { FiCheckCircle, FiClock, FiHeadphones, FiMail, FiMapPin, FiMessageCircle, FiPhone, FiSend, FiShield, FiShoppingBag, FiStar, FiUsers } from "react-icons/fi";
import { BenefitStrip, GroceryVisual, SnapFooter, SnapHeader } from "./SnapCommon";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { submitContactMessage } from "@/lib/api";

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
          <GroceryVisual compact variant="storefront" />
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
          <div className="stats-card"><Stat icon={<FiMapPin />} value="Data aktual" label="Cabang dari API" /><Stat icon={<FiUsers />} value="Privasi" label="Tanpa klaim pelanggan" /><Stat icon={<FiShoppingBag />} value="Stok cabang" label="Produk aktif" /><Stat icon={<FiStar />} value={siteConfig.demoMode ? "Demo" : "Terukur"} label="Statistik terverifikasi" /></div>
        </section>
        <section className="flow-card"><h2>Bagaimana Market Snap Bekerja</h2><div>{["Pilih Lokasi", "Temukan Cabang", "Lihat Stok", "Checkout", "Terima Pesanan"].map((step, index) => <span key={step}><b>{index + 1}</b>{step}</span>)}</div></section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

export function SnapContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const contacts = [
    { icon: FiHeadphones, title: "Customer Care", text: siteConfig.phone },
    { icon: FiMail, title: "Email", text: siteConfig.supportEmail },
    { icon: FiPhone, title: "WhatsApp", text: siteConfig.whatsapp ? siteConfig.phone : "Belum dikonfigurasi" },
    { icon: FiClock, title: "Jam Layanan", text: "06:00 - 22:00 WIB" },
    { icon: FiMapPin, title: "Alamat Bisnis", text: siteConfig.address }
  ];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      const result = await submitContactMessage(form);
      setStatus(result.message);
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Pesan belum dapat dikirim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SnapHeader active="contact" />
      <main>
        <section className="info-hero">
          <div><h1>Kami siap membantu kebutuhan belanjamu.</h1><p>Punya pertanyaan, butuh bantuan, atau ingin bekerja sama? Tim Market Snap selalu siap membantu dengan cepat dan ramah.</p></div>
          <GroceryVisual compact variant="storefront" />
        </section>
        <section className="contact-capture-grid">
          <aside className="contact-list-panel">
            {contacts.map(({ icon: Icon, title, text }) => <article key={title}><Icon /><div><h3>{title}</h3><p>{text}</p></div></article>)}
            <div className="whatsapp-box"><FiMessageCircle /><div><h3>Butuh bantuan lebih cepat?</h3><p>Hubungi kami via WhatsApp sekarang.</p>{whatsappUrl() ? <a href={whatsappUrl()} rel="noreferrer" target="_blank">Chat via WhatsApp</a> : <span>WhatsApp belum dikonfigurasi</span>}</div></div>
          </aside>
          <form className="message-form" onSubmit={submit}>
            <h2>Kirim pesan untuk kami</h2>
            <p>Isi formulir di bawah ini dan tim kami akan segera merespons.</p>
            <label>Nama<input autoComplete="name" name="name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Masukkan nama lengkap" required value={form.name} /></label>
            <label>Email<input autoComplete="email" name="email" onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Masukkan email aktif" required type="email" value={form.email} /></label>
            <label>Subjek<select name="subject" onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} required value={form.subject}><option disabled value="">Pilih subjek pesan</option><option value="ORDER">Pesanan</option><option value="PAYMENT">Pembayaran</option><option value="PRODUCT">Produk</option><option value="PARTNERSHIP">Kerja sama</option><option value="OTHER">Lainnya</option></select></label>
            <label>Pesan<textarea name="message" onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Tulis pesanmu di sini..." required rows={7} value={form.message} /></label>
            <label className="contact-honeypot" aria-hidden="true">Website<input autoComplete="off" name="website" onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} tabIndex={-1} value={form.website} /></label>
            <p><FiShield /> Jangan kirim password, OTP, token, atau data kartu melalui formulir ini.</p>
            {status && <p aria-live="polite" role="status">{status}</p>}
            <button className="primary-snap wide" disabled={submitting} type="submit">{submitting ? "Menyimpan..." : "Kirim pesan"} <FiSend /></button>
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
