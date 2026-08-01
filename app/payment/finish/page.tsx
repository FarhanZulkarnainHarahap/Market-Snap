import { Suspense } from "react";
import { PaymentFinishPage } from "@/components/payment/PaymentReturnPages";

export default function Page() {
  return (
    <Suspense fallback={<main className="payment-return-page"><section className="payment-return-panel"><h1>Memverifikasi pembayaran...</h1></section></main>}>
      <PaymentFinishPage />
    </Suspense>
  );
}
