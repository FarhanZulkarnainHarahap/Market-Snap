"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { fetchCurrentUser, saveSession, webRole } from "@/lib/api";

export function GoogleOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const token = searchParams.get("token");
  const immediateError = searchParams.get("error") || (!token ? "Token login Google tidak ditemukan." : "");

  useEffect(() => {
    if (immediateError || !token) return;

    window.localStorage.setItem("market-snap-token", token);
    fetchCurrentUser()
      .then((user) => {
        saveSession({ token, user });
        const role = webRole(user.role);
        router.replace(role === "admin" ? "/admin" : role === "adminStore" ? "/admin-store" : "/");
      })
      .catch((fetchError) => {
        window.localStorage.removeItem("market-snap-token");
        setError(fetchError instanceof Error ? fetchError.message : "Login Google gagal.");
      });
  }, [immediateError, router, token]);

  const shownError = immediateError || error;

  return (
    <main className="oauth-callback-page">
      <section>
        {shownError ? <FiAlertCircle /> : <FiCheckCircle />}
        <h1>{shownError ? "Login Google gagal" : "Login Google"}</h1>
        <p>{shownError || "Menyelesaikan login Google..."}</p>
        {shownError && <Link className="primary-snap wide" href="/login">Kembali ke login</Link>}
      </section>
    </main>
  );
}
