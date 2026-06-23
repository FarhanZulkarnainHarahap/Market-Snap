"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiAlertCircle, FiArrowLeft, FiCheck, FiCheckCircle, FiEyeOff, FiLock, FiLogIn, FiMail, FiShoppingBag, FiTag, FiTruck, FiUser, FiUserPlus, FiX } from "react-icons/fi";
import { facebookAuthUrl, googleAuthUrl, loginUser, registerUser, webRole } from "@/lib/api";
import { GroceryVisual } from "./SnapCommon";

type AuthModal = {
  variant: "success" | "error";
  title: string;
  message: string;
  redirectTo?: string;
};

type RegisterStep = 1 | 2 | 3;

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
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
            <label>Email <span><FiMail /><input name="email" placeholder="your@email.com" required type="email" /></span></label>
            <label>Password <span><FiLock /><input name="password" placeholder="password123" required type="password" /><FiEyeOff /></span></label>
            <div className="form-between"><label><input defaultChecked type="checkbox" /> Ingat saya</label><Link href="/auth/login">Lupa password?</Link></div>
            <button aria-busy={busy} className="primary-snap wide" disabled={busy} type="submit"><FiLogIn /> Masuk</button>
            <em>atau</em>
            <Link className="google-auth-button" href={googleAuthUrl()}><GoogleIcon /> Masuk dengan Google</Link>
            <Link className="google-auth-button facebook-auth-button" href={facebookAuthUrl()}><FacebookIcon /> Masuk dengan Facebook</Link>
            <Link className="secondary-snap wide" href="/register"><FiUser /> Belum punya akun? Daftar sekarang</Link>
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
  const [step, setStep] = useState<RegisterStep>(1);
  const [formState, setFormState] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: ""
  });
  const [error, setError] = useState("");
  const [modal, setModal] = useState<AuthModal | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (step === 1) {
      if (!formState.name.trim() || !formState.email.trim()) {
        setError("Nama lengkap dan email wajib diisi.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (formState.password.length < 6) {
        setError("Password minimal 6 karakter.");
        return;
      }
      if (formState.password !== formState.confirmPassword) {
        setError("Konfirmasi password tidak sama.");
        return;
      }
      setStep(3);
      return;
    }

    setBusy(true);
    try {
      await registerUser({
        name: formState.name.trim(),
        email: formState.email.trim(),
        password: formState.password,
        referralCode: formState.referralCode.trim()
      });
      setModal({
        variant: "success",
        title: "Registrasi berhasil",
        message: "Akun Market Snap sudah dibuat. Silakan masuk untuk mulai belanja.",
        redirectTo: "/login"
      });
    } catch (error) {
      setModal({
        variant: "error",
        title: "Registrasi gagal",
        message: error instanceof Error ? error.message : "Registrasi gagal. Coba lagi sebentar."
      });
    } finally {
      setBusy(false);
    }
  }

  function updateField(field: keyof RegisterForm) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function closeModal() {
    const redirectTo = modal?.redirectTo;
    setModal(null);
    if (redirectTo) router.push(redirectTo);
  }

  return (
    <>
      <main className="auth-capture register-capture">
        <section className="register-card">
          <Link className="auth-brand" href="/">MARKET SNAP</Link>
          <span className="auth-step-pill">Langkah {step} dari 3</span>
          <FiUserPlus className="auth-big-icon" />
          <h1>Buat akun Market Snap</h1>
          <p>{registerStepCopy(step)}</p>
          <div className="auth-stepper" aria-label="Progress registrasi">
            {[1, 2, 3].map((item) => (
              <span className={item <= step ? "active" : ""} key={item}>{item < step ? <FiCheck /> : item}</span>
            ))}
          </div>
          <form className="capture-form compact" onSubmit={submit}>
            {step === 1 && (
              <>
                <label>Nama lengkap<input autoComplete="name" onChange={updateField("name")} placeholder="Masukkan nama lengkap Anda" required value={formState.name} /></label>
                <label>Email<input autoComplete="email" onChange={updateField("email")} placeholder="Masukkan email Anda" required type="email" value={formState.email} /></label>
              </>
            )}
            {step === 2 && (
              <>
                <label>Password<input autoComplete="new-password" onChange={updateField("password")} placeholder="Buat password" required type="password" value={formState.password} /></label>
                <label>Konfirmasi Password<input autoComplete="new-password" onChange={updateField("confirmPassword")} placeholder="Ulangi password" required type="password" value={formState.confirmPassword} /></label>
              </>
            )}
            {step === 3 && (
              <label>Kode referral <small>Opsional, boleh dikosongkan</small><input onChange={updateField("referralCode")} placeholder="Masukkan kode referral jika ada" value={formState.referralCode} /></label>
            )}
            {error && <p className="auth-step-error">{error}</p>}
            <div className="auth-step-actions">
              {step > 1 && <button className="secondary-snap" onClick={() => setStep((current) => (current - 1) as RegisterStep)} type="button"><FiArrowLeft /> Kembali</button>}
              <button className="primary-snap wide" disabled={busy} type="submit">{busy ? "Mendaftarkan..." : step === 3 ? "Daftar" : "OK"}</button>
            </div>
            <div className="auth-oauth-block">
              <em>atau</em>
              <Link className="google-auth-button" href={googleAuthUrl()}><GoogleIcon /> Daftar dengan Google</Link>
              <Link className="google-auth-button facebook-auth-button" href={facebookAuthUrl()}><FacebookIcon /> Daftar dengan Facebook</Link>
            </div>
            <p className="center-copy">Sudah punya akun? <Link href="/login">Masuk di sini</Link></p>
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
      {modal && <AuthStatusModal modal={modal} onClose={closeModal} />}
    </>
  );
}

function registerStepCopy(step: RegisterStep) {
  if (step === 1) return "Masukkan nama lengkap dan email aktif untuk membuat akun.";
  if (step === 2) return "Buat password akun lalu konfirmasi password yang sama.";
  return "Tambahkan kode referral jika ada. Bagian ini bisa dikosongkan.";
}

function AuthMini({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="auth-mini"><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article>;
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21.6 12.23c0-.74-.07-1.45-.19-2.14H12v4.05h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.44Z" fill="#4285f4" />
      <path d="M12 22c2.7 0 4.96-.89 6.61-2.42l-3.22-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A9.98 9.98 0 0 0 12 22Z" fill="#34a853" />
      <path d="M6.41 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.31-1.9V7.51H3.08A9.98 9.98 0 0 0 2 12c0 1.61.39 3.13 1.08 4.49l3.33-2.59Z" fill="#fbbc05" />
      <path d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86C16.95 3.01 14.69 2 12 2a9.98 9.98 0 0 0-8.92 5.51l3.33 2.59C7.2 7.74 9.4 5.98 12 5.98Z" fill="#ea4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.01 3.66 9.17 8.44 9.92v-7.02H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.23 0-1.62.77-1.62 1.56v1.88h2.76l-.44 2.9h-2.32V22C18.34 21.23 22 17.07 22 12.06Z" fill="#1877f2" />
    </svg>
  );
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
