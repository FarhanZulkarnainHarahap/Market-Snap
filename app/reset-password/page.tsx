import { Suspense } from "react";
import { ResetPasswordPage } from "@/components/snap/ResetPasswordPage";

export default function ResetPasswordRoute() {
  return (
    <Suspense fallback={<main className="oauth-callback-page"><section><h1>Ubah password</h1><p>Menyiapkan halaman...</p></section></main>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
