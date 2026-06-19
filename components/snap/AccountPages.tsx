"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiBell,
  FiChevronRight,
  FiCreditCard,
  FiHeadphones,
  FiHome,
  FiLock,
  FiMapPin,
  FiPackage,
  FiShield,
  FiTag,
  FiUser
} from "react-icons/fi";
import { SnapHeader } from "@/components/snap/SnapCommon";
import { fetchVouchers } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { Voucher } from "@/lib/types";

type AccountSection = "profile" | "address" | "orders" | "notifications" | "vouchers" | "payment" | "security" | "help";

const accountMenus: Array<{ key: AccountSection; href: string; label: string; text: string; icon: typeof FiUser }> = [
  { key: "profile", href: "/profile", label: "Profile", text: "Data personal", icon: FiUser },
  { key: "address", href: "/profile/address", label: "Address", text: "Alamat pengiriman", icon: FiMapPin },
  { key: "orders", href: "/my-orders", label: "My Orders", text: "Riwayat belanja", icon: FiPackage },
  { key: "notifications", href: "/profile/notifications", label: "Notifications", text: "Update pesanan", icon: FiBell },
  { key: "vouchers", href: "/profile/vouchers", label: "Vouchers", text: "Promo tersimpan", icon: FiTag },
  { key: "payment", href: "/profile/payment", label: "Payment", text: "Metode pembayaran", icon: FiCreditCard },
  { key: "security", href: "/profile/security", label: "Security", text: "Password & akses", icon: FiLock },
  { key: "help", href: "/profile/help-center", label: "Help Center", text: "Bantuan pelanggan", icon: FiHeadphones }
];

export function AccountLayout({ active, children, title, description }: { active: AccountSection; children: React.ReactNode; title: string; description: string }) {
  return (
    <>
      <SnapHeader active="home" />
      <main className="account-page">
        <section className="account-hero">
          <div>
            <span className="eyebrow">My Account</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="account-summary">
            <span><FiShield /> Akun aktif</span>
            <strong>Andi Pratama</strong>
            <small>Customer Market Snap</small>
          </div>
        </section>

        <section className="account-layout">
          <aside className="account-sidebar" aria-label="Menu akun">
            <div className="account-user-card">
              <span><FiUser /></span>
              <div>
                <strong>Andi Pratama</strong>
                <small>andi@marketsnap.id</small>
              </div>
            </div>
            <nav>
              {accountMenus.map(({ key, href, label, text, icon: Icon }) => (
                <Link className={active === key ? "active" : ""} href={href} key={key}>
                  <Icon />
                  <span><strong>{label}</strong><small>{text}</small></span>
                  <FiChevronRight />
                </Link>
              ))}
            </nav>
          </aside>

          <div className="account-content">{children}</div>
        </section>
      </main>
    </>
  );
}

export function ProfileAccountContent() {
  return (
    <>
      <section className="account-panel profile-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Profile</span>
            <h2>Data personal</h2>
          </div>
          <button type="button">Edit profil</button>
        </div>
        <div className="profile-overview">
          <div className="profile-avatar">A</div>
          <div>
            <h3>Andi Pratama</h3>
            <p>andi@marketsnap.id</p>
            <span>Member sejak Mei 2025</span>
          </div>
        </div>
        <form className="account-form">
          <label>Nama lengkap<input defaultValue="Andi Pratama" /></label>
          <label>Email<input defaultValue="andi@marketsnap.id" type="email" /></label>
          <label>Nomor HP<input defaultValue="0812-3456-7890" /></label>
          <label>Tanggal lahir<input type="date" /></label>
          <button className="primary-snap" type="submit">Simpan perubahan</button>
        </form>
      </section>

      <section className="account-grid">
        <QuickPanel title="Alamat utama" action="Tambah">
          <SavedAddress />
        </QuickPanel>
        <QuickPanel title="Pesanan terakhir" action="Lihat semua">
          <div className="account-list">
            <p><span>#MS-250526-001</span><strong>Dikirim</strong></p>
            <p><span>#MS-250526-002</span><strong>Selesai</strong></p>
            <p><span>#MS-250526-003</span><strong>Diproses</strong></p>
          </div>
        </QuickPanel>
      </section>
    </>
  );
}

export function AddressAccountContent() {
  return (
    <>
      <section className="account-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Address</span>
            <h2>Alamat pengiriman</h2>
          </div>
          <button type="button">Tambah alamat</button>
        </div>
        <div className="account-grid">
          <SavedAddress />
          <div className="saved-address">
            <FiHome />
            <div>
              <strong>Kantor</strong>
              <p>Jl. Gatot Subroto, Medan Petisah, Kota Medan</p>
              <small>Dipakai untuk pengiriman jam kerja.</small>
            </div>
          </div>
        </div>
      </section>
      <QuickPanel title="Form alamat baru">
        <form className="account-form">
          <label>Label alamat<input placeholder="Rumah / Kantor" /></label>
          <label>Nomor penerima<input placeholder="0812-3456-7890" /></label>
          <label>Detail alamat<input placeholder="Nama jalan, nomor rumah, patokan" /></label>
          <label>Kota<input defaultValue="Medan" /></label>
          <button className="primary-snap" type="submit">Simpan alamat</button>
        </form>
      </QuickPanel>
    </>
  );
}

export function OrdersAccountContent() {
  return (
    <section className="account-panel">
      <div className="account-section-title">
        <div>
          <span className="eyebrow">My Orders</span>
          <h2>Riwayat belanja</h2>
        </div>
        <button type="button">Filter</button>
      </div>
      <div className="account-list rich-list">
        {[
          ["#MS-250526-001", "Dikirim", "Apel Fuji, Telur Ayam, Bayam Segar", "Rp 87.500"],
          ["#MS-250526-002", "Selesai", "Jeruk Medan, Susu UHT, Roti Tawar", "Rp 132.900"],
          ["#MS-250526-003", "Diproses", "Alpukat, Beras Premium, Minyak Goreng", "Rp 218.400"]
        ].map(([id, status, products, total]) => (
          <p key={id}><span><b>{id}</b><small>{products}</small></span><strong>{status}</strong><em>{total}</em></p>
        ))}
      </div>
    </section>
  );
}

export function NotificationsAccountContent() {
  return (
    <>
      <QuickPanel title="Preferensi notifikasi">
        <div className="toggle-list">
          <label><span>Update status pesanan</span><input defaultChecked type="checkbox" /></label>
          <label><span>Promo dan voucher</span><input defaultChecked type="checkbox" /></label>
          <label><span>Rekomendasi produk</span><input type="checkbox" /></label>
          <label><span>Reminder checkout cart</span><input defaultChecked type="checkbox" /></label>
        </div>
      </QuickPanel>
      <section className="account-panel">
        <div className="account-section-title compact">
          <h2>Notifikasi terbaru</h2>
        </div>
        <div className="account-list rich-list">
          <p><span><b>Pesanan sedang dikemas</b><small>#MS-250526-003 diproses cabang Kemang.</small></span><strong>Baru</strong></p>
          <p><span><b>Voucher SNAPWELCOME aktif</b><small>Gunakan untuk diskon belanja berikutnya.</small></span><strong>Promo</strong></p>
          <p><span><b>Stok buah segar tersedia</b><small>Cabang terdekat baru restock pagi ini.</small></span><strong>Info</strong></p>
        </div>
      </section>
    </>
  );
}

export function VouchersAccountContent() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchVouchers()
      .then((items) => {
        setVouchers(items);
        setMessage(items.length ? "" : "Belum ada voucher aktif saat ini.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Voucher belum dapat dimuat."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="account-grid voucher-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="account-panel voucher-card voucher-skeleton" aria-hidden="true" key={index}>
            <span className="skeleton-icon" />
            <span className="skeleton-line short" />
            <span className="skeleton-line wide" />
            <span className="skeleton-line medium" />
            <span className="skeleton-button" />
          </article>
        ))}
      </section>
    );
  }

  if (!vouchers.length) {
    return <section className="account-panel empty-account-state"><FiTag /><h2>Voucher belum tersedia</h2><p>{message}</p></section>;
  }

  return (
    <section className="account-grid voucher-grid">
      {vouchers.map((voucher) => (
        <article className="account-panel voucher-card" key={voucher.id}>
          <FiTag />
          <span>{voucher.code}</span>
          <h2>{voucher.title}</h2>
          <p>{voucherSummary(voucher)}</p>
          <small>{voucherMeta(voucher)}</small>
          <button type="button">Pakai voucher</button>
        </article>
      ))}
    </section>
  );
}

function voucherSummary(voucher: Voucher) {
  const value = voucher.type === "percentage" ? `${voucher.value}%` : rupiah(voucher.value);
  const scope = voucher.scope === "shipping" ? "ongkir" : voucher.scope === "product" ? "produk pilihan" : "total belanja";
  return `Potongan ${value} untuk ${scope}.`;
}

function voucherMeta(voucher: Voucher) {
  const minSpend = voucher.minSpend ? `Minimal belanja ${rupiah(voucher.minSpend)}` : "Tanpa minimal belanja";
  const maxDiscount = voucher.maxDiscount ? `maks. ${rupiah(voucher.maxDiscount)}` : "tanpa batas maksimum";
  return `${minSpend}, ${maxDiscount}. Berlaku hingga ${new Date(voucher.expiresAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`;
}

export function PaymentAccountContent() {
  return (
    <>
      <section className="account-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Payment</span>
            <h2>Metode pembayaran</h2>
          </div>
          <button type="button">Tambah</button>
        </div>
        <div className="account-grid">
          <PaymentCard title="BCA Virtual Account" text="Nomor VA dibuat otomatis saat checkout" active />
          <PaymentCard title="E-Wallet" text="OVO, DANA, LinkAja, dan ShopeePay" />
          <PaymentCard title="QRIS" text="Scan QR untuk pembayaran cepat" />
          <PaymentCard title="Kartu Kredit / Debit" text="Visa, Mastercard, dan debit online" />
        </div>
      </section>
      <QuickPanel title="Keamanan pembayaran">
        <div className="security-panel">
          <p><FiShield /> Semua transaksi diproses melalui payment gateway terenkripsi.</p>
          <p><FiLock /> Detail pembayaran tidak disimpan di perangkat ini.</p>
        </div>
      </QuickPanel>
    </>
  );
}

export function SecurityAccountContent() {
  return (
    <>
      <section className="account-panel security-panel">
        <div className="account-section-title">
          <div>
            <span className="eyebrow">Security</span>
            <h2>Password & akses</h2>
          </div>
          <button type="button">Ubah password</button>
        </div>
        <p><FiLock /> Password terakhir diperbarui 12 hari lalu.</p>
        <p><FiShield /> Sesi login aktif di perangkat ini.</p>
        <p><FiBell /> Notifikasi login baru dikirim melalui email.</p>
      </section>
      <QuickPanel title="Perangkat aktif">
        <div className="account-list">
          <p><span>Chrome - Medan</span><strong>Aktif</strong></p>
          <p><span>Android App</span><strong>7 hari lalu</strong></p>
        </div>
      </QuickPanel>
    </>
  );
}

export function HelpAccountContent() {
  return (
    <>
      <section className="account-grid">
        <HelpCard title="Lacak pesanan" text="Pantau posisi kurir dan status belanja secara real-time." />
        <HelpCard title="Pembayaran" text="Bantuan VA, e-wallet, QRIS, kartu, dan refund." />
        <HelpCard title="Pengiriman" text="Atur alamat, jadwal, ongkir, dan cabang terdekat." />
        <HelpCard title="Produk & voucher" text="Tanya stok, promo aktif, dan kualitas produk." />
      </section>
      <section className="account-panel contact-help">
        <FiHeadphones />
        <div>
          <span className="eyebrow">Customer Care</span>
          <h2>Butuh bantuan lebih cepat?</h2>
          <p>Tim Market Snap siap membantu pesanan, pembayaran, dan pengirimanmu setiap hari.</p>
        </div>
        <Link className="primary-snap" href="/contact-us">Hubungi kami</Link>
      </section>
    </>
  );
}

function QuickPanel({ action, children, title }: { action?: string; children: React.ReactNode; title: string }) {
  return (
    <article className="account-panel">
      <div className="account-section-title compact">
        <h2>{title}</h2>
        {action && <button type="button">{action}</button>}
      </div>
      {children}
    </article>
  );
}

function SavedAddress() {
  return (
    <div className="saved-address">
      <FiHome />
      <div>
        <strong>Rumah <span>Utama</span></strong>
        <p>Jl. Setiabudi, Medan Selayang, Kota Medan</p>
        <small>Dipakai untuk estimasi cabang terdekat dan ongkir.</small>
      </div>
    </div>
  );
}

function PaymentCard({ active = false, text, title }: { active?: boolean; text: string; title: string }) {
  return (
    <article className={active ? "payment-card active" : "payment-card"}>
      <FiCreditCard />
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      {active && <span>Utama</span>}
    </article>
  );
}

function HelpCard({ text, title }: { text: string; title: string }) {
  return (
    <article className="account-panel help-card">
      <FiHeadphones />
      <h2>{title}</h2>
      <p>{text}</p>
      <button type="button">Lihat bantuan</button>
    </article>
  );
}
