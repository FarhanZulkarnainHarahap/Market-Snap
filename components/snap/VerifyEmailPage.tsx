"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCheck, FiMail } from "react-icons/fi";
import { confirmEmailVerification } from "@/lib/api";

export function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState(() => token ? "Memverifikasi akun Anda..." : "Link verifikasi tidak lengkap.");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    confirmEmailVerification(token)
      .then((response) => {
        setSuccess(true);
        setMessage(response.message);
        window.setTimeout(() => router.push("/profile"), 1400);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Verifikasi belum dapat diproses."));
  }, [router, token]);

  return (
    <main className="oauth-callback-page">
      <section>
        {success ? <FiCheck /> : <FiMail />}
        <h1>{success ? "Akun terverifikasi" : "Verifikasi akun"}</h1>
        <p>{message}</p>
        <Link className="primary-snap wide" href="/profile">Kembali ke profil</Link>
      </section>
    </main>
  );
}
