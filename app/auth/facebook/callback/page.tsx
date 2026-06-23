import { Suspense } from "react";
import { GoogleOAuthCallbackPage } from "@/components/snap/GoogleOAuthCallbackPage";

export default function FacebookCallbackPage() {
  return (
    <Suspense fallback={<main className="oauth-callback-page"><section><h1>Login Facebook</h1><p>Menyelesaikan login Facebook...</p></section></main>}>
      <GoogleOAuthCallbackPage />
    </Suspense>
  );
}
