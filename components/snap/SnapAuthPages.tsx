"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEyeOff, FiLock, FiLogIn, FiMail, FiShoppingBag, FiTag, FiTruck, FiUser, FiUserPlus } from "react-icons/fi";
import { loginUser, registerUser } from "@/lib/api";
import { BenefitStrip, GroceryVisual, SnapFooter, SnapHeader } from "./SnapCommon";

export function SnapLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Masuk untuk melanjutkan belanja kebutuhan harian.");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("Memproses login...");
    try {
      const payload = await loginUser(String(form.get("email")), String(form.get("password")));
      setMessage("Login berhasil.");
      const role = payload.user.role;
      router.push(role === "super_admin" || role === "admin" ? "/dashboard/admin" : role === "store_admin" ? "/dashboard/admin-store" : "/dashboard/customer/catalog");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SnapHeader simple />
      <main className="auth-capture login-capture">
        <section className="auth-left">
          <h1>Masuk ke Market Snap</h1>
          <p>{message}</p>
          <form className="capture-form" onSubmit={submit}>
            <label>Email <span><FiMail /><input name="email" placeholder="customer@marketsnap.id" required type="email" /></span></label>
            <label>Password <span><FiLock /><input name="password" placeholder="password123" required type="password" /><FiEyeOff /></span></label>
            <div className="form-between"><label><input defaultChecked type="checkbox" /> Ingat saya</label><Link href="/auth/login">Lupa password?</Link></div>
            <button className="primary-snap wide" disabled={busy} type="submit"><FiLogIn /> {busy ? "Masuk..." : "Masuk"}</button>
            <em>atau</em>
            <Link className="secondary-snap wide" href="/auth/register"><FiUser /> Belum punya akun? Daftar sekarang</Link>
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
