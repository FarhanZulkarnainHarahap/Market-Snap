import { AccountLayout, HelpAccountContent } from "@/components/snap/AccountPages";

export default function CustomerHelpCenterPage() {
  return (
    <AccountLayout
      active="help"
      description="Temukan bantuan untuk pesanan, pengiriman, pembayaran, voucher, dan produk segar."
      title="Help center."
    >
      <HelpAccountContent />
    </AccountLayout>
  );
}
