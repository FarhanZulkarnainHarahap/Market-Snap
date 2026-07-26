import { AccountLayout, StoreAdminRequestContent } from "@/components/snap/AccountPages";

export default function CustomerStoreAdminRequestPage() {
  return (
    <AccountLayout
      active="store-admin-request"
      description="Ajukan akses Store Admin untuk mengelola cabang Market Snap setelah data akun lengkap."
      title="Daftar Store Admin"
    >
      <StoreAdminRequestContent />
    </AccountLayout>
  );
}
