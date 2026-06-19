import { AccountLayout, PaymentAccountContent } from "@/components/snap/AccountPages";

export default function CustomerPaymentPage() {
  return (
    <AccountLayout
      active="payment"
      description="Kelola metode pembayaran favorit untuk checkout yang lebih cepat dan aman."
      title="Metode pembayaran."
    >
      <PaymentAccountContent />
    </AccountLayout>
  );
}
