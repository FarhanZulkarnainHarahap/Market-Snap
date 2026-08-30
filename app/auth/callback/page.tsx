import { Suspense } from "react";
import { GoogleOAuthCallbackPage } from "@/components/snap/GoogleOAuthCallbackPage";

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<main className="oauth-callback-page"><section><h1>Login</h1><p>Menyelesaikan login...</p></section></main>}>
      <GoogleOAuthCallbackPage />
    </Suspense>
  );
}
