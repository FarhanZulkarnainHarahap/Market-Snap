import { Suspense } from "react";
import { PaymentStatePage } from "@/components/payment/PaymentReturnPages";

export default function Page() {
  return (
    <Suspense fallback={<main className="payment-return-page"><section className="payment-return-panel"><h1>Memuat status pembayaran...</h1></section></main>}>
      <PaymentStatePage mode="error" />
    </Suspense>
  );
}
