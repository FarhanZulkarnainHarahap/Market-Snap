import { AccountLayout, VouchersAccountContent } from "@/components/snap/AccountPages";

export default function CustomerVouchersPage() {
  return (
    <AccountLayout
      active="vouchers"
      description="Simpan dan gunakan voucher terbaik untuk diskon produk, gratis ongkir, dan promo pembayaran."
      title="Voucher belanjamu."
    >
      <VouchersAccountContent />
    </AccountLayout>
  );
}
