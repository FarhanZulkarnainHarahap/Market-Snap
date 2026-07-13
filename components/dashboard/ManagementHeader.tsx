"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiBell, FiBox, FiGrid, FiHome, FiLayers, FiMenu, FiPackage, FiPieChart, FiSearch, FiSettings, FiShoppingCart, FiTrendingUp, FiUsers, FiX } from "react-icons/fi";
import type { DashboardRole } from "../../lib/dashboard-api";

type ManagementHeaderProps = {
  role: Extract<DashboardRole, "admin" | "adminStore">;
};

const links = {
  admin: [
    { href: "/super-admin", icon: FiGrid, label: "Dashboard" },
    { href: "/super-admin/products", icon: FiPackage, label: "Products" },
    { href: "/super-admin/inventory", icon: FiBox, label: "Inventory" },
    { href: "/super-admin/orders", icon: FiShoppingCart, label: "Orders" },
    { href: "/super-admin/stores", icon: FiHome, label: "Branches" },
    { href: "/super-admin/discounts", icon: FiPieChart, label: "Vouchers" },
    { href: "/super-admin/users", icon: FiUsers, label: "Customers" },
    { href: "/super-admin/store-admins", icon: FiLayers, label: "Store Admins" },
    { href: "/super-admin/reports", icon: FiTrendingUp, label: "Reports" },
    { href: "/super-admin/settings", icon: FiSettings, label: "Settings" }
  ],
  adminStore: [
    { href: "/store-admin", icon: FiGrid, label: "Dashboard" },
    { href: "/store-admin/products", icon: FiPackage, label: "Products" },
    { href: "/store-admin/categories", icon: FiLayers, label: "Categories" },
    { href: "/store-admin/inventory", icon: FiBox, label: "Inventory" },
    { href: "/store-admin/discounts", icon: FiPieChart, label: "Discounts" },
    { href: "/store-admin/orders", icon: FiShoppingCart, label: "Orders" },
    { href: "/store-admin/reports", icon: FiTrendingUp, label: "Reports" }
  ]
};

export function ManagementHeader({ role }: ManagementHeaderProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = role === "admin" ? "Super Admin Console" : "Store Admin Console";
  const userLabel = role === "admin" ? "Admin" : "Store Admin";
  const rootHref = links[role][0].href;

  function toggleMenu() {
    setCollapsed((value) => !value);
    setMobileOpen((value) => !value);
  }

  return (
    <header className={`management-header${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}>
      <aside className="management-sidebar" aria-label={title}>
        <div className="management-sidebar-head">
          <Link className="management-brand" href={rootHref} onClick={() => setMobileOpen(false)}>
            <Image src="/market-snap-favicon-transparent.png" alt="Market Snap" height={42} width={42} />
            <span><strong>MARKET SNAP</strong><small>{title}</small></span>
          </Link>
          <button aria-label="Tutup menu" className="management-close-button" onClick={toggleMenu} type="button"><FiX /></button>
        </div>
        <nav className="management-nav">
          {links[role].map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== rootHref && pathname.startsWith(`${link.href}/`));
            return (
              <Link className={active ? "active" : ""} href={link.href} key={link.href} onClick={() => setMobileOpen(false)}>
                <Icon />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="management-sidebar-card">
          <Image alt="" height={130} src="/product.png" width={130} />
          <strong>Market Snap</strong>
          <small>Fresh groceries, fast delivery from your nearest branch.</small>
        </div>
      </aside>
      <button aria-label="Tutup overlay menu" className="management-overlay" onClick={() => setMobileOpen(false)} type="button" />
      <div className="management-topbar">
        <button aria-label="Buka atau tutup sidebar" className="management-menu-button" onClick={toggleMenu} type="button"><FiMenu /></button>
        <label className="management-search">
          <FiSearch />
          <input placeholder="Search products, orders, customers..." />
        </label>
        <div className="management-actions">
          <button aria-label="Notifikasi" className="management-icon-button" type="button"><FiBell /></button>
          <span className="management-user"><strong>{userLabel}</strong><small>{role === "admin" ? "Super Admin" : "Store Admin"}</small></span>
          <Link className="management-exit" href="/dashboard/customer"><FiHome /> Storefront</Link>
        </div>
      </div>
    </header>
  );
}
