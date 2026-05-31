import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function RegisterPage() {
  return (
    <CreateResourceForm
      active="register"
      description="Daftarkan akun untuk mulai berbelanja grocery dari cabang terdekat."
      endpoint="/auth/register"
      fields={[
        { name: "name", label: "Nama lengkap", required: true },
        { name: "email", label: "Email", required: true, type: "email" },
        { name: "referralCode", label: "Kode referral", placeholder: "Opsional" }
      ]}
      role="public"
      title="Buat akun pembeli"
    />
  );
}
