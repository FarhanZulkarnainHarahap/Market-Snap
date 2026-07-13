"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiCheck, FiLock, FiMail } from "react-icons/fi";
import { confirmPasswordReset, requestPasswordReset } from "@/lib/api";

export function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    setMessage("");
    setSubmitting(true);
    try {
      const response = await requestPasswordReset(email);
      setSent(true);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Link reset password belum dapat dikirim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-capture reset-password-capture">
      <section className="auth-left reset-password-panel">
        <Link className="auth-brand" href="/">MARKET SNAP</Link>
        <FiMail className="auth-big-icon" />
        <h1>Reset password akun</h1>
        <p>Masukkan email akun Market Snap. Kami akan mengirim tautan aman untuk membuat password baru.</p>
        {sent ? (
          <div className="reset-success">
            <FiCheck />
            <h2>Cek email kamu</h2>
            <p>{message}</p>
            <Link className="primary-snap wide" href="/auth/login"><FiArrowLeft /> Kembali ke login</Link>
          </div>
        ) : (
          <form className="capture-form" onSubmit={submit}>
            <label>Email akun<input autoComplete="email" name="email" placeholder="nama@email.com" required type="email" /></label>
            {message && <p className="auth-step-error">{message}</p>}
            <button className="primary-snap wide" disabled={submitting} type="submit">{submitting ? "Mengirim..." : "Kirim link reset"}</button>
            <Link className="secondary-snap wide" href="/auth/login"><FiArrowLeft /> Kembali ke login</Link>
          </form>
        )}
      </section>
    </main>
  );
}

export function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    setMessage("");
    if (password !== confirm) {
      setMessage("Konfirmasi password belum sama.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await confirmPasswordReset(token, password);
      setDone(true);
      setMessage(response.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Password belum dapat diperbarui.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-capture reset-password-capture">
      <section className="auth-left reset-password-panel">
        <Link className="auth-brand" href="/">MARKET SNAP</Link>
        <FiLock className="auth-big-icon" />
        <h1>Buat password baru</h1>
        <p>Gunakan password yang kuat agar akun belanjamu tetap aman.</p>
        {done ? (
          <div className="reset-success">
            <FiCheck />
            <h2>Password diperbarui</h2>
            <p>{message}</p>
            <Link className="primary-snap wide" href="/auth/login">Login sekarang</Link>
          </div>
        ) : (
          <form className="capture-form" onSubmit={submit}>
            <label>Password baru<input name="password" placeholder="Minimal 8 karakter" required type="password" /></label>
            <label>Konfirmasi password<input name="confirm" placeholder="Ulangi password baru" required type="password" /></label>
            {message && <p className="auth-step-error">{message}</p>}
            <button className="primary-snap wide" disabled={submitting || !token} type="submit">{submitting ? "Menyimpan..." : "Simpan password"}</button>
          </form>
        )}
      </section>
    </main>
  );
}
