import { AccountLayout, ProfileAccountContent } from "@/components/snap/AccountPages";

export default function CustomerPersonalDataPage() {
  return (
    <AccountLayout
      active="personal-data"
      description="Kelola nama, email, nomor handphone, foto profil, dan verifikasi akun."
      title="Data pribadi."
    >
      <ProfileAccountContent />
    </AccountLayout>
  );
}
