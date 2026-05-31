import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function AdminCreateProductPage() {
  return (
    <CreateResourceForm
      active="admin"
      description="Tambahkan produk baru ke katalog Market Snap."
      endpoint="/admin/products"
      fields={[
        { name: "name", label: "Nama produk", required: true },
        { name: "category", label: "Kategori", required: true },
        { name: "price", label: "Harga", required: true, type: "number" },
        { name: "unit", label: "Unit", placeholder: "kg / pcs / ikat", required: true },
        { name: "discount", label: "Diskon", placeholder: "10% / BOGO / 15000" },
        { name: "organic", label: "Pilihan organik", type: "select", options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }] },
        { name: "image", label: "URL gambar", placeholder: "https://..." },
        { name: "description", label: "Deskripsi" }
      ]}
      role="admin"
      title="Create Product"
    />
  );
}
