import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function SuperAdminCreateProductPage() {
  return (
    <CreateResourceForm
      active="admin"
      description="Tambahkan produk global yang akan tersedia untuk seluruh store."
      endpoint="/super-admin/products"
      fields={[
        { name: "name", label: "Nama produk", required: true },
        { name: "category", label: "Kategori", required: true },
        { name: "price", label: "Harga", required: true, type: "number" },
        { name: "unit", label: "Unit", placeholder: "kg / pcs / ikat", required: true },
        { name: "image", label: "URL gambar", placeholder: "https://..." },
        { name: "description", label: "Deskripsi" }
      ]}
      role="admin"
      title="Create Product"
    />
  );
}
