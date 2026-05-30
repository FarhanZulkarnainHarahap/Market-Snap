import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function AdminCreateStorePage() {
  return (
    <CreateResourceForm
      active="admin"
      description="Form ini hit POST /admin/stores untuk membuat cabang baru."
      endpoint="/admin/stores"
      fields={[
        { name: "name", label: "Nama toko", required: true },
        { name: "city", label: "Kota", required: true },
        { name: "lat", label: "Latitude", required: true, type: "number" },
        { name: "lng", label: "Longitude", required: true, type: "number" },
        { name: "radiusKm", label: "Radius layanan km", required: true, type: "number" },
        { name: "adminId", label: "Admin ID", placeholder: "ID admin toko", required: true },
        { name: "isMain", label: "Toko utama", type: "select", options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }] }
      ]}
      role="admin"
      title="Create Store"
    />
  );
}
