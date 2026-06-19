import { SnapHeader } from "@/components/snap/SnapCommon";
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

const accountMenus = [
  { label: "Profile", text: "Data personal", icon: FiUser, active: true },
  { label: "Address", text: "Alamat pengiriman", icon: FiMapPin },
  { label: "My Orders", text: "Riwayat belanja", icon: FiPackage },
  { label: "Notifications", text: "Update pesanan", icon: FiBell },
  { label: "Vouchers", text: "Promo tersimpan", icon: FiTag },
  { label: "Payment", text: "Metode pembayaran", icon: FiCreditCard },
  { label: "Security", text: "Password & akses", icon: FiLock },
  { label: "Help Center", text: "Bantuan pelanggan", icon: FiHeadphones }
];

export default function ProfilePage() {
  return (
    <>
      <SnapHeader active="home" />
      <main className="account-page">
        <section className="account-hero">
          <div>
            <span className="eyebrow">My Account</span>
            <h1>Kelola profil belanjamu.</h1>
            <p>Atur data personal, alamat, notifikasi, voucher, dan keamanan akun dalam satu tempat.</p>
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
              {accountMenus.map(({ label, text, icon: Icon, active }) => (
                <button className={active ? "active" : ""} key={label} type="button">
                  <Icon />
                  <span><strong>{label}</strong><small>{text}</small></span>
                  <FiChevronRight />
                </button>
              ))}
            </nav>
          </aside>

          <div className="account-content">
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
              <article className="account-panel">
                <div className="account-section-title compact">
                  <h2>Alamat utama</h2>
                  <button type="button">Tambah</button>
                </div>
                <div className="saved-address">
                  <FiHome />
                  <div>
                    <strong>Rumah <span>Utama</span></strong>
                    <p>Jl. Setiabudi, Medan Selayang, Kota Medan</p>
                    <small>Dipakai untuk estimasi cabang terdekat dan ongkir.</small>
                  </div>
                </div>
              </article>

              <article className="account-panel">
                <div className="account-section-title compact">
                  <h2>Pesanan terakhir</h2>
                  <button type="button">Lihat semua</button>
                </div>
                <div className="account-list">
                  <p><span>#MS-250526-001</span><strong>Dikirim</strong></p>
                  <p><span>#MS-250526-002</span><strong>Selesai</strong></p>
                  <p><span>#MS-250526-003</span><strong>Diproses</strong></p>
                </div>
              </article>
            </section>

            <section className="account-grid">
              <article className="account-panel">
                <div className="account-section-title compact">
                  <h2>Notifikasi</h2>
                </div>
                <div className="toggle-list">
                  <label><span>Update status pesanan</span><input defaultChecked type="checkbox" /></label>
                  <label><span>Promo dan voucher</span><input defaultChecked type="checkbox" /></label>
                  <label><span>Rekomendasi produk</span><input type="checkbox" /></label>
                </div>
              </article>

              <article className="account-panel security-panel">
                <div className="account-section-title compact">
                  <h2>Keamanan akun</h2>
                  <button type="button">Ubah</button>
                </div>
                <p><FiLock /> Password terakhir diperbarui 12 hari lalu.</p>
                <p><FiShield /> Sesi login aktif di perangkat ini.</p>
              </article>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
