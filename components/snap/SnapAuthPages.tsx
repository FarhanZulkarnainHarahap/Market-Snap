"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiAlertCircle, FiArrowLeft, FiCheck, FiCheckCircle, FiEyeOff, FiLock, FiLogIn, FiMail, FiShoppingBag, FiTag, FiTruck, FiUser, FiUserPlus, FiX } from "react-icons/fi";
import { loginUser, registerUser, webRole } from "@/lib/api";
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
            <label>Email <span><FiMail /><input name="email" placeholder="customer@marketsnap.id" required type="email" /></span></label>
            <label>Password <span><FiLock /><input name="password" placeholder="password123" required type="password" /><FiEyeOff /></span></label>
            <div className="form-between"><label><input defaultChecked type="checkbox" /> Ingat saya</label><Link href="/auth/login">Lupa password?</Link></div>
            <button aria-busy={busy} className="primary-snap wide" disabled={busy} type="submit"><FiLogIn /> Masuk</button>
            <em>atau</em>
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
