"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { fetchCurrentUser, saveSession } from "@/lib/api";

export function GoogleOAuthCallbackPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const providerParam = searchParams.get("provider");
  const provider = providerParam === "facebook" || pathname.includes("/facebook/") ? "Facebook" : "Google";
  const immediateError = searchParams.get("error") ?? "";

  useEffect(() => {
    if (immediateError) return;

    fetchCurrentUser()
      .then((user) => {
        saveSession({ token: "", user });
        router.replace("/");
      })
      .catch((fetchError) => {
        setError(fetchError instanceof Error ? fetchError.message : `Login ${provider} gagal.`);
      });
  }, [immediateError, provider, router]);

  const shownError = immediateError || error;

  return (
    <main className="oauth-callback-page">
      <section>
        {shownError ? <FiAlertCircle /> : <FiCheckCircle />}
        <h1>{shownError ? `Login ${provider} gagal` : `Login ${provider}`}</h1>
        <p>{shownError || `Menyelesaikan login ${provider}...`}</p>
        {shownError && <Link className="primary-snap wide" href="/auth/login">Kembali ke login</Link>}
      </section>
    </main>
  );
}
