import { AccountLayout, PaymentAccountContent } from "@/components/snap/AccountPages";

export default function CustomerPaymentMethodsPage() {
  return (
    <AccountLayout
      active="payment-methods"
      description="Kelola metode pembayaran yang aman tanpa menyimpan data kartu sensitif."
      title="Metode pembayaran."
    >
      <PaymentAccountContent />
    </AccountLayout>
  );
}
