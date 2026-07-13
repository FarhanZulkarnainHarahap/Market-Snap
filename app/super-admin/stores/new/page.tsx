import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function SuperAdminCreateStorePage() {
  return (
    <CreateResourceForm
      active="admin"
      description="Tambahkan cabang baru beserta koordinat, radius layanan, dan Store Admin."
      endpoint="/super-admin/stores"
      fields={[
        { name: "name", label: "Nama toko", required: true },
        { name: "city", label: "Kota", required: true },
        { name: "lat", label: "Latitude", required: true, type: "number" },
        { name: "lng", label: "Longitude", required: true, type: "number" },
        { name: "radiusKm", label: "Radius layanan km", required: true, type: "number" },
        { name: "adminId", label: "Store Admin ID", placeholder: "ID admin toko", required: true },
        { name: "isMain", label: "Store utama", type: "select", options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }] }
      ]}
      role="admin"
      title="Create Store"
    />
  );
}
