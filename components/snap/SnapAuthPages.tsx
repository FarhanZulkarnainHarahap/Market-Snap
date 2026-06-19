"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiEyeOff, FiLock, FiLogIn, FiMail, FiShoppingBag, FiTag, FiTruck, FiUser, FiUserPlus, FiX } from "react-icons/fi";
import { loginUser, registerUser, webRole } from "@/lib/api";
import { BenefitStrip, GroceryVisual, SnapFooter, SnapHeader } from "./SnapCommon";

type AuthModal = {
  variant: "success" | "error";
  title: string;
  message: string;
  redirectTo?: string;
};

export function SnapLoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<AuthModal | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const payload = await loginUser(String(form.get("email")), String(form.get("password")));
      const role = webRole(payload.user.role);
      const redirectTo = role === "admin" ? "/admin" : role === "adminStore" ? "/admin-store" : "/";
      setModal({
        variant: "success",
        title: "Login berhasil",
        message: "Akun kamu sudah masuk. Lanjut ke halaman utama Market Snap.",
        redirectTo
      });
    } catch (error) {
      setModal({
        variant: "error",
        title: "Login gagal",
        message: error instanceof Error ? error.message : "Email atau password belum sesuai."
      });
    } finally {
      setBusy(false);
    }
  }

  function closeModal() {
    const redirectTo = modal?.redirectTo;
    setModal(null);
    if (redirectTo) router.push(redirectTo);
  }

  return (
    <>
      <main className="auth-capture login-capture">
        <section className="auth-left">
          <Link className="auth-brand" href="/">MARKET SNAP</Link>
          <h1>Masuk ke Market Snap</h1>
          <p>Masuk untuk melanjutkan belanja kebutuhan harian atau mengelola tokomu dengan mudah.</p>
          <form className="capture-form" onSubmit={submit}>
            <label>Email <span><FiMail /><input name="email" placeholder="customer@marketsnap.id" required type="email" /></span></label>
            <label>Password <span><FiLock /><input name="password" placeholder="password123" required type="password" /><FiEyeOff /></span></label>
            <div className="form-between"><label><input defaultChecked type="checkbox" /> Ingat saya</label><Link href="/auth/login">Lupa password?</Link></div>
            <button aria-busy={busy} className="primary-snap wide" disabled={busy} type="submit"><FiLogIn /> Masuk</button>
            <em>atau</em>
            <Link className="secondary-snap wide" href="/auth/register"><FiUser /> Belum punya akun? Daftar sekarang</Link>
          </form>
          <div className="login-benefits">
            <AuthMini icon={<FiShoppingBag />} title="Belanja mudah & cepat" text="Temukan kebutuhan harian dari cabang terdekat." />
            <AuthMini icon={<FiTruck />} title="Kelola tokomu praktis" text="Pantau stok, pesanan, dan promo dalam satu dashboard." />
            <AuthMini icon={<FiTag />} title="Promo terbaik setiap hari" text="Dapatkan penawaran spesial untuk belanja lebih hemat." />
          </div>
        </section>
        <section className="auth-image-panel"><GroceryVisual variant="storefront" /></section>
      </main>
      {modal && <AuthStatusModal modal={modal} onClose={closeModal} />}
    </>
  );
}

export function SnapRegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Daftar gratis dan mulai belanja kebutuhan harian dengan mudah.");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirmPassword"));
    if (password !== confirm) {
      setMessage("Konfirmasi password tidak sama.");
      return;
    }
    setBusy(true);
    try {
      await registerUser({
        name: String(form.get("name")),
        email: String(form.get("email")),
        password,
        referralCode: String(form.get("referralCode") || "")
      });
      setMessage("Registrasi berhasil. Silakan login.");
      router.push("/auth/login");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registrasi gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SnapHeader simple={false} active="home" />
      <main className="auth-capture register-capture">
        <section className="register-card">
          <FiUserPlus className="auth-big-icon" />
          <h1>Buat akun Market Snap</h1>
          <p>{message}</p>
          <form className="capture-form compact" onSubmit={submit}>
            <label>Nama lengkap<input name="name" placeholder="Masukkan nama lengkap Anda" required /></label>
            <label>Email<input name="email" placeholder="Masukkan email Anda" required type="email" /></label>
            <label>Nomor HP<input name="phone" placeholder="Contoh: 0812-3456-7890" /></label>
            <label>Password<input name="password" placeholder="Buat password" required type="password" /></label>
            <label>Konfirmasi Password<input name="confirmPassword" placeholder="Ulangi password" required type="password" /></label>
            <label>Kode referral (opsional)<input name="referralCode" placeholder="Masukkan kode referral" /></label>
            <label className="agree-line"><input required type="checkbox" /> Saya setuju dengan Syarat & Ketentuan dan Kebijakan Privasi</label>
            <button className="primary-snap wide" disabled={busy} type="submit">{busy ? "Mendaftarkan..." : "Daftar"}</button>
            <p className="center-copy">Sudah punya akun? <Link href="/auth/login">Masuk di sini</Link></p>
          </form>
        </section>
        <section className="register-info">
          <h2>Belanja mudah, segar setiap hari.</h2>
          <p>Bergabung dengan Market Snap dan nikmati pengalaman belanja online yang praktis, aman, dan terpercaya.</p>
          <AuthMini icon={<FiTag />} title="Promo pengguna baru" text="Dapatkan penawaran spesial dan diskon menarik setiap hari." />
          <AuthMini icon={<FiShoppingBag />} title="Checkout lebih cepat" text="Proses belanja praktis dengan pembayaran aman." />
          <AuthMini icon={<FiTruck />} title="Lacak pesanan" text="Pantau pesanan Anda secara real-time hingga sampai ke rumah." />
          <GroceryVisual compact variant="promo" />
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

function AuthStatusModal({ modal, onClose }: { modal: AuthModal; onClose: () => void }) {
  const Icon = modal.variant === "success" ? FiCheckCircle : FiAlertCircle;
  return (
    <div className="auth-modal-backdrop" role="presentation">
      <section aria-labelledby="auth-modal-title" aria-modal="true" className={`auth-modal ${modal.variant}`} role="dialog">
        <button aria-label="Tutup" className="auth-modal-close" onClick={onClose} type="button"><FiX /></button>
        <span className="auth-modal-icon"><Icon /></span>
        <h2 id="auth-modal-title">{modal.title}</h2>
        <p>{modal.message}</p>
        <button className="primary-snap wide" onClick={onClose} type="button">
          {modal.redirectTo ? "Lanjutkan" : "Coba lagi"}
        </button>
      </section>
    </div>
  );
}
