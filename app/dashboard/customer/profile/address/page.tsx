import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function CustomerAddressPage() {
  return (
    <CreateResourceForm
      active="profile"
      description="Tambahkan alamat pengiriman agar pesanan dapat dilayani oleh cabang terdekat."
      endpoint="/addresses"
      fields={[
        { name: "label", label: "Label alamat", placeholder: "Rumah / Kantor", required: true },
        { name: "detail", label: "Detail alamat", required: true },
        { name: "lat", label: "Latitude", required: true, type: "number" },
        { name: "lng", label: "Longitude", required: true, type: "number" },
        { name: "isPrimary", label: "Alamat utama", type: "select", options: [{ label: "Ya", value: "true" }, { label: "Tidak", value: "false" }] }
      ]}
      role="customer"
      title="Create Address"
    />
  );
}
