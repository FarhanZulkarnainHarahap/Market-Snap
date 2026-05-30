import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function CustomerCheckoutPage() {
  return <DashboardFeaturePage active="cart" description="Checkout order, alamat pengiriman, estimasi ongkir, voucher, dan status pembayaran." eyebrow="Customer checkout" resource="addresses" role="customer" title="Checkout" />;
}
