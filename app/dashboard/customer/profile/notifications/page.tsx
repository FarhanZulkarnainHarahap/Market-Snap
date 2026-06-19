import { AccountLayout, NotificationsAccountContent } from "@/components/snap/AccountPages";

export default function CustomerNotificationsPage() {
  return (
    <AccountLayout
      active="notifications"
      description="Atur channel notifikasi dan lihat update penting tentang pesanan, promo, serta stok cabang."
      title="Pusat notifikasi."
    >
      <NotificationsAccountContent />
    </AccountLayout>
  );
}
