"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "../../components/Header";

const destinations = {
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
  adminStore: "/dashboard/adminStore"
};

type Role = keyof typeof destinations;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");

  function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.cookie = `market-snap-role=${role}; path=/; max-age=86400; SameSite=Lax`;
    window.localStorage.setItem("market-snap-role", role);
    router.push(destinations[role]);
  }

  return (
    <>
      <Header active="login" />
      <main className="auth-shell">
        <section className="auth-panel">
          <span className="mini-label">Role login</span>
          <h1>Masuk ke Market Snap</h1>
          <p>Pilih role demo untuk masuk ke dashboard yang sesuai.</p>
          <form className="form-grid" onSubmit={login}>
            <label>Email<input type="email" placeholder="nama@email.com" required /></label>
            <label>Password<input type="password" placeholder="Minimal 8 karakter" required /></label>
            <label>
              Role
              <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="adminStore">Admin Store</option>
              </select>
            </label>
            <button className="primary-button" type="submit">Masuk</button>
          </form>
          <Link className="text-link" href="/register">Belum punya akun? Daftar</Link>
        </section>
      </main>
    </>
  );
}
