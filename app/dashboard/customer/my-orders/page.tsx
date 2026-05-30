import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function CustomerOrdersPage() {
  return <DashboardFeaturePage active="customer" description="Daftar order customer, status pembayaran, pengiriman, dan konfirmasi penerimaan." eyebrow="Customer orders" resource="orders" role="customer" title="My Orders" />;
}
