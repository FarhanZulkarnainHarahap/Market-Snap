import { Suspense } from "react";
import { GoogleOAuthCallbackPage } from "@/components/snap/GoogleOAuthCallbackPage";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<main className="oauth-callback-page"><section><h1>Login Google</h1><p>Menyelesaikan login Google...</p></section></main>}>
      <GoogleOAuthCallbackPage />
    </Suspense>
  );
}
