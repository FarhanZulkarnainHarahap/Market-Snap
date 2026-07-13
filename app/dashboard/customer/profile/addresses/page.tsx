import { AccountLayout, AddressAccountContent } from "@/components/snap/AccountPages";

export default function CustomerAddressesPage() {
  return (
    <AccountLayout
      active="addresses"
      description="Simpan beberapa alamat, pilih alamat utama, dan pakai lokasi ini untuk estimasi cabang serta ongkir."
      title="Kelola alamat pengiriman."
    >
      <AddressAccountContent />
    </AccountLayout>
  );
}
