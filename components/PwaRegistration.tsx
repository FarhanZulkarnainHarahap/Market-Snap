"use client";

import { useEffect, useSyncExternalStore } from "react";

export function PwaRegistration() {
  const offline = useSyncExternalStore(subscribeNetwork, () => !navigator.onLine, () => false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => undefined);
    }
  }, []);

  return offline ? <p className="offline-indicator" role="status">Anda sedang offline. Data akun, checkout, dan pembayaran tidak tersedia.</p> : null;
}

function subscribeNetwork(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
