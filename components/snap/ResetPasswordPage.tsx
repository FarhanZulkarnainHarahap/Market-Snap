"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiCheck, FiLock } from "react-icons/fi";
import { confirmPasswordReset } from "@/lib/api";

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
            <Link className="primary-snap wide" href="/login">Masuk sekarang</Link>
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
