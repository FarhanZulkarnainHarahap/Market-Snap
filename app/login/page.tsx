"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "../../components/Header";
import { loginUser, webRole } from "../../lib/api";

const destinations = {
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
  adminStore: "/dashboard/adminStore"
};

type Role = keyof typeof destinations;

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Masuk untuk melanjutkan belanja atau mengelola toko.");
  const [submitting, setSubmitting] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("Memproses login...");
    const form = new FormData(event.currentTarget);
    try {
      const payload = await loginUser(String(form.get("email")), String(form.get("password")));
      const role = webRole(payload.user.role) as Role;
      setMessage("Login berhasil.");
      router.push(destinations[role]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login gagal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header active="login" />
      <main className="auth-shell">
        <section className="auth-panel">
          <span className="mini-label">Akun Market Snap</span>
          <h1>Masuk ke Market Snap</h1>
          <p>{message}</p>
          <form className="form-grid" onSubmit={login}>
            <label>Email<input name="email" type="email" placeholder="nama@email.com" required /></label>
            <label>Password<input name="password" type="password" placeholder="Minimal 8 karakter" required /></label>
            <button className="primary-button" disabled={submitting} type="submit">{submitting ? "Masuk..." : "Masuk"}</button>
          </form>
          <Link className="text-link" href="/register">Belum punya akun? Daftar</Link>
        </section>
      </main>
    </>
  );
}
