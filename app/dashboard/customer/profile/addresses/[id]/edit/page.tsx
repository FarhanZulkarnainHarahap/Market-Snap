import { AccountLayout, AddressAccountContent } from "@/components/snap/AccountPages";

export default function EditCustomerAddressPage() {
  return (
    <AccountLayout
      active="addresses"
      description="Perbarui alamat, koordinat, dan status alamat utama."
      title="Edit alamat pengiriman."
    >
      <AddressAccountContent />
    </AccountLayout>
  );
}
