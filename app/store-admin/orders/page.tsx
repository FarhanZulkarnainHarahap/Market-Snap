import { DashboardFeaturePage } from "@/components/dashboard/DashboardFeaturePage";

export default function StoreAdminOrdersPage() {
  return <DashboardFeaturePage active="adminStore" description="Proses order store sendiri, konfirmasi pembayaran, kirim pesanan, dan pembatalan sesuai aturan." eyebrow="Store Admin" resource="orders" role="adminStore" title="Orders" />;
}
