import Image from "next/image";
import Link from "next/link";
import { FiBell, FiHome, FiSearch } from "react-icons/fi";
import type { DashboardRole } from "../../lib/dashboard-api";

type ManagementHeaderProps = {
  role: Extract<DashboardRole, "admin" | "adminStore">;
};

const links = {
  admin: [
    { href: "/super-admin", label: "Dashboard" },
    { href: "/super-admin/stores", label: "Stores" },
    { href: "/super-admin/products", label: "Products" },
    { href: "/super-admin/categories", label: "Categories" },
    { href: "/super-admin/users", label: "Users" },
    { href: "/super-admin/store-admins", label: "Store Admins" },
    { href: "/super-admin/reports", label: "Reports" }
  ],
  adminStore: [
    { href: "/store-admin", label: "Dashboard" },
    { href: "/store-admin/products", label: "Products" },
    { href: "/store-admin/categories", label: "Categories" },
    { href: "/store-admin/inventory", label: "Inventory" },
    { href: "/store-admin/discounts", label: "Discounts" },
    { href: "/store-admin/orders", label: "Orders" },
    { href: "/store-admin/reports", label: "Reports" }
  ]
};

export function ManagementHeader({ role }: ManagementHeaderProps) {
  const title = role === "admin" ? "Super Admin Console" : "Store Admin Console";

  return (
    <header className="management-header">
      <div className="management-bar">
        <Link className="management-brand" href={links[role][0].href}>
          <Image src="/market-snap-favicon-transparent.png" alt="Market Snap" height={42} width={42} />
          <span><strong>Market Snap</strong><small>{title}</small></span>
        </Link>
        <label className="management-search">
          <FiSearch />
          <input placeholder="Cari produk, pesanan, pelanggan..." />
        </label>
        <div className="management-actions">
          <button aria-label="Notifikasi" className="management-icon-button" type="button"><FiBell /></button>
          <Link className="management-exit" href="/"><FiHome /> Storefront</Link>
        </div>
      </div>
      <nav className="management-nav" aria-label={title}>
        {links[role].map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
      </nav>
    </header>
  );
}
