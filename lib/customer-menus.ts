import { FiBarChart2, FiBell, FiCreditCard, FiEdit3, FiHeart, FiHelpCircle, FiLogOut, FiMapPin, FiShoppingBag, FiTag, FiTruck, FiUser } from "react-icons/fi";
import type { IconType } from "react-icons";

export type CustomerAccountMenuKey =
  | "profile"
  | "personal-data"
  | "orders"
  | "tracking"
  | "addresses"
  | "vouchers"
  | "wishlist"
  | "payment-methods"
  | "statistics"
  | "notifications"
  | "help"
  | "logout";

export type CustomerAccountMenu = {
  key: CustomerAccountMenuKey;
  href: string;
  label: string;
  section: "Akun" | "Belanja" | "Informasi";
  text: string;
  icon: IconType;
};

export const customerAccountMenus: CustomerAccountMenu[] = [
  { key: "profile", href: "/dashboard/customer/profile", label: "Overview", section: "Akun", text: "Ringkasan akun", icon: FiUser },
  { key: "personal-data", href: "/dashboard/customer/profile/personal-data", label: "Data Pribadi", section: "Akun", text: "Nama, email, foto", icon: FiEdit3 },
  { key: "orders", href: "/dashboard/customer/profile/orders", label: "Pesanan Saya", section: "Belanja", text: "Riwayat belanja", icon: FiShoppingBag },
  { key: "tracking", href: "/dashboard/customer/tracking", label: "Lacak Paket", section: "Belanja", text: "Status pengiriman", icon: FiTruck },
  { key: "addresses", href: "/dashboard/customer/profile/addresses", label: "Alamat", section: "Akun", text: "Alamat pengiriman", icon: FiMapPin },
  { key: "vouchers", href: "/dashboard/customer/profile/vouchers", label: "Voucher Saya", section: "Belanja", text: "Promo tersimpan", icon: FiTag },
  { key: "wishlist", href: "/dashboard/customer/profile/wishlist", label: "Wishlist", section: "Belanja", text: "Produk favorit", icon: FiHeart },
  { key: "payment-methods", href: "/dashboard/customer/profile/payment-methods", label: "Metode Pembayaran", section: "Belanja", text: "Pembayaran checkout", icon: FiCreditCard },
  { key: "statistics", href: "/dashboard/customer/profile/statistics", label: "Statistik Belanja", section: "Belanja", text: "Grafik pesanan", icon: FiBarChart2 },
  { key: "notifications", href: "/dashboard/customer/profile/notifications", label: "Notifikasi", section: "Informasi", text: "Update pesanan", icon: FiBell },
  { key: "help", href: "/dashboard/customer/profile/help-center", label: "Bantuan", section: "Informasi", text: "Bantuan pelanggan", icon: FiHelpCircle }
];

export const customerLogoutMenu = { key: "logout", href: "#logout", label: "Logout", section: "Informasi", text: "Keluar dari akun", icon: FiLogOut } as const;
