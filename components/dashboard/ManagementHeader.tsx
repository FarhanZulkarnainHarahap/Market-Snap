import Image from "next/image";
import Link from "next/link";
import type { DashboardRole } from "../../lib/dashboard-api";

type ManagementHeaderProps = {
  role: Extract<DashboardRole, "admin" | "adminStore">;
};

const links = {
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/store", label: "Stores" },
    { href: "/dashboard/admin/product", label: "Products" },
    { href: "/dashboard/admin/category", label: "Categories" },
    { href: "/dashboard/admin/user", label: "Users" },
    { href: "/dashboard/admin/user-store", label: "Store Admins" },
    { href: "/dashboard/admin/inventory-history", label: "Reports" }
  ],
  adminStore: [
    { href: "/dashboard/admin-store", label: "Overview" },
    { href: "/dashboard/admin-store/manage-order", label: "Orders" },
    { href: "/dashboard/admin-store/inventory-management", label: "Inventory" },
    { href: "/dashboard/admin-store/product", label: "Products" },
    { href: "/dashboard/admin-store/category", label: "Categories" },
    { href: "/dashboard/admin-store/discount", label: "Discounts" },
    { href: "/dashboard/admin-store/store", label: "Store" }
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
        <Link className="management-exit" href="/">Storefront</Link>
      </div>
      <nav className="management-nav" aria-label={title}>
        {links[role].map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
      </nav>
    </header>
  );
}
