import { AccountLayout, AddressAccountContent } from "@/components/snap/AccountPages";

export default function NewCustomerAddressPage() {
  return (
    <AccountLayout
      active="addresses"
      description="Tambahkan alamat pengiriman baru untuk checkout Market Snap."
      title="Tambah alamat baru."
    >
      <AddressAccountContent />
    </AccountLayout>
  );
}
