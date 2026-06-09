import Link from "next/link";
import { FiEyeOff, FiLock, FiLogIn, FiMail, FiShoppingBag, FiTag, FiTruck, FiUser, FiUserPlus } from "react-icons/fi";
import { BenefitStrip, GroceryVisual, SnapFooter, SnapHeader } from "./SnapCommon";

export function SnapLoginPage() {
  return (
    <>
      <SnapHeader simple />
      <main className="auth-capture login-capture">
        <section className="auth-left">
          <h1>Masuk ke Market Snap</h1>
          <p>Masuk untuk melanjutkan belanja kebutuhan harian atau kelola tokomu dengan mudah dan praktis.</p>
          <form className="capture-form">
            <label>Email <span><FiMail /><input placeholder="Masukkan email Anda" type="email" /></span></label>
            <label>Password <span><FiLock /><input placeholder="Masukkan password Anda" type="password" /><FiEyeOff /></span></label>
            <div className="form-between"><label><input defaultChecked type="checkbox" /> Ingat saya</label><Link href="/login">Lupa password?</Link></div>
            <button className="primary-snap wide" type="button"><FiLogIn /> Masuk</button>
            <em>atau</em>
            <Link className="secondary-snap wide" href="/register"><FiUser /> Belum punya akun? Daftar sekarang</Link>
          </form>
          <div className="login-benefits">
            <AuthMini icon={<FiShoppingBag />} title="Belanja mudah & cepat" text="Temukan kebutuhan harian dari cabang terdekat." />
            <AuthMini icon={<FiTruck />} title="Kelola tokomu praktis" text="Pantau stok, pesanan, dan promo dalam satu dashboard." />
            <AuthMini icon={<FiTag />} title="Promo terbaik setiap hari" text="Dapatkan penawaran spesial untuk belanja lebih hemat." />
          </div>
        </section>
        <section className="auth-image-panel"><GroceryVisual /></section>
      </main>
    </>
  );
}

export function SnapRegisterPage() {
  return (
    <>
      <SnapHeader simple={false} active="home" />
      <main className="auth-capture register-capture">
        <section className="register-card">
          <FiUserPlus className="auth-big-icon" />
          <h1>Buat akun Market Snap</h1>
          <p>Daftar gratis dan mulai belanja kebutuhan harian dengan mudah.</p>
          <form className="capture-form compact">
            {["Nama lengkap", "Email", "Nomor HP", "Password", "Konfirmasi Password", "Kode referral (opsional)"].map((label) => (
              <label key={label}>{label}<input placeholder={label === "Nomor HP" ? "Contoh: 0812-3456-7890" : `Masukkan ${label.toLowerCase()}`} type={label.includes("Password") ? "password" : "text"} /></label>
            ))}
            <label className="agree-line"><input type="checkbox" /> Saya setuju dengan Syarat & Ketentuan dan Kebijakan Privasi</label>
            <button className="primary-snap wide" type="button">Daftar</button>
            <p className="center-copy">Sudah punya akun? <Link href="/login">Masuk di sini</Link></p>
          </form>
        </section>
        <section className="register-info">
          <h2>Belanja mudah, segar setiap hari.</h2>
          <p>Bergabung dengan Market Snap dan nikmati pengalaman belanja online yang praktis, aman, dan terpercaya.</p>
          <AuthMini icon={<FiTag />} title="Promo pengguna baru" text="Dapatkan penawaran spesial dan diskon menarik setiap hari." />
          <AuthMini icon={<FiShoppingBag />} title="Checkout lebih cepat" text="Proses belanja praktis dengan pembayaran aman." />
          <AuthMini icon={<FiTruck />} title="Lacak pesanan" text="Pantau pesanan Anda secara real-time hingga sampai ke rumah." />
          <GroceryVisual compact />
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

function AuthMini({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="auth-mini"><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>;
}
