import { CreateResourceForm } from "@/components/forms/CreateResourceForm";

export default function RegisterPage() {
  return (
    <CreateResourceForm
      active="register"
      description="Form ini hit POST /auth/register dan membuat customer belum terverifikasi."
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
