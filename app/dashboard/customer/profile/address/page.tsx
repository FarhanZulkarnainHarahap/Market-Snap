import { AccountLayout, AddressAccountContent } from "@/components/snap/AccountPages";

export default function CustomerAddressPage() {
  return (
    <AccountLayout
      active="address"
      description="Simpan beberapa alamat, pilih alamat utama, dan pakai lokasi ini untuk estimasi cabang serta ongkir."
      title="Kelola alamat pengiriman."
    >
      <AddressAccountContent />
    </AccountLayout>
  );
}
