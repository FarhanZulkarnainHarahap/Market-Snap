import { Suspense } from "react";
import { VerifyEmailPage } from "@/components/snap/VerifyEmailPage";

export default function VerifyEmailRoute() {
  return (
    <Suspense fallback={<main className="oauth-callback-page"><section><h1>Verifikasi akun</h1><p>Menyiapkan verifikasi...</p></section></main>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
