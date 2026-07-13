import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function AdminCreateStoreUserPage() {
  return (
    <CreateResourceForm
      active="admin"
      description="Tambahkan akun pengelola untuk ditempatkan pada cabang toko."
      endpoint="/admin/users"
      fields={[
        { name: "name", label: "Nama admin", required: true },
        { name: "email", label: "Email", required: true, type: "email" },
        { name: "password", label: "Password", placeholder: "Minimal 8 karakter", type: "password" },
        { name: "role", label: "Role", type: "select", options: [{ label: "Store Admin", value: "store_admin" }, { label: "Customer", value: "customer" }] },
        { name: "verified", label: "Verified", type: "select", options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }] }
      ]}
      role="admin"
      title="Create Store Admin"
    />
  );
}
