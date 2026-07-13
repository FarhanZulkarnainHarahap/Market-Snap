import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function SuperAdminCreateStoreAdminPage() {
  return (
    <CreateResourceForm
      active="admin"
      description="Buat akun Store Admin untuk ditugaskan ke store tertentu."
      endpoint="/super-admin/store-admins"
      fields={[
        { name: "name", label: "Nama Store Admin", required: true },
        { name: "email", label: "Email", required: true, type: "email" },
        { name: "password", label: "Password sementara", placeholder: "Minimal 8 karakter", type: "password" },
        { name: "role", label: "Role", type: "select", options: [{ label: "Store Admin", value: "store_admin" }] },
        { name: "verified", label: "Verified", type: "select", options: [{ label: "Tidak", value: "false" }, { label: "Ya", value: "true" }] }
      ]}
      role="admin"
      title="Create Store Admin"
    />
  );
}
