import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminManageOrderPage() {
  return <DashboardFeaturePage active="adminStore" description="Konfirmasi pembayaran, proses order, kirim pesanan, dan pembatalan sebelum dikirim." eyebrow="Store admin" resource="orders" role="adminStore" title="Manage Order" />;
}
