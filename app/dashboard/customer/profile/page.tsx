import { AccountLayout, ProfileAccountContent } from "@/components/snap/AccountPages";

export default function ProfilePage() {
  return (
    <AccountLayout
      active="profile"
      description="Atur data personal, alamat, notifikasi, voucher, dan keamanan akun dalam satu tempat."
      title="Kelola profil belanjamu."
    >
      <ProfileAccountContent />
    </AccountLayout>
  );
}
