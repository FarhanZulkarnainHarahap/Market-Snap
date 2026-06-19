import { AccountLayout, SecurityAccountContent } from "@/components/snap/AccountPages";

export default function CustomerSecurityPage() {
  return (
    <AccountLayout
      active="security"
      description="Jaga akun tetap aman dengan pengaturan password, sesi login, dan notifikasi akses."
      title="Keamanan akun."
    >
      <SecurityAccountContent />
    </AccountLayout>
  );
}
