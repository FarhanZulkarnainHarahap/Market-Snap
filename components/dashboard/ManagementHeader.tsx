"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiBell, FiBox, FiGrid, FiHome, FiLayers, FiLogOut, FiMenu, FiPackage, FiPieChart, FiSearch, FiSettings, FiShoppingCart, FiTrendingUp, FiUsers, FiX } from "react-icons/fi";
import { logoutUser } from "../../lib/api";
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
  const [loggingOut, setLoggingOut] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const title = role === "admin" ? "Super Admin Console" : "Store Admin Console";
  const userLabel = role === "admin" ? "Admin" : "Store Admin";
  const rootHref = links[role][0].href;

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const opener = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key !== "Tab" || !sidebarRef.current) return;
      const focusable = Array.from(sidebarRef.current.querySelectorAll<HTMLElement>("a,button")).filter((item) => !item.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeydown);
    window.setTimeout(() => sidebarRef.current?.querySelector<HTMLElement>("a,button")?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeydown);
      opener?.focus();
    };
  }, [mobileOpen]);

  function toggleMenu() {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches) {
      setMobileOpen((value) => !value);
      return;
    }
    setCollapsed((value) => !value);
  }

  function handleLogout() {
    setLoggingOut(true);
    void logoutUser().finally(() => {
      window.location.href = "/auth/login";
    });
  }

  return (
    <header className={`management-header${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}>
      <aside className="management-sidebar" aria-label={title} ref={sidebarRef}>
        <div className="management-sidebar-head">
          <Link className="management-brand" href={rootHref} onClick={() => setMobileOpen(false)}>
            <Image src="/market-snap-favicon-transparent.png" alt="Market Snap" height={42} width={42} />
            <span><strong>MARKET SNAP</strong><small>{title}</small></span>
          </Link>
          <button aria-label="Tutup menu" className="management-close-button" onClick={() => setMobileOpen(false)} type="button"><FiX /></button>
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
        <footer className="management-sidebar-footer">
          <div className="management-sidebar-user">
            <span>{role === "admin" ? "SA" : "ST"}</span>
            <p><strong>{userLabel}</strong><small>{title}</small></p>
          </div>
          <div className="management-sidebar-footer-actions">
            <Link href="/dashboard/customer" onClick={() => setMobileOpen(false)}><FiHome /> Storefront</Link>
            <button disabled={loggingOut} onClick={handleLogout} type="button"><FiLogOut /> {loggingOut ? "Logout..." : "Logout"}</button>
          </div>
        </footer>
      </aside>
      <button aria-label="Tutup overlay menu" className="management-overlay" onClick={() => setMobileOpen(false)} type="button" />
      <div className="management-topbar">
        <button aria-label="Buka atau tutup sidebar" className="management-menu-button" onClick={toggleMenu} ref={menuButtonRef} type="button"><FiMenu /></button>
        <label className="management-search">
          <FiSearch />
          <input placeholder="Search products, orders, customers..." />
        </label>
        <div className="management-actions">
          <button aria-label="Notifikasi" className="management-icon-button" type="button"><FiBell /></button>
          <span className="management-user"><strong>{userLabel}</strong><small>{role === "admin" ? "Super Admin" : "Store Admin"}</small></span>
          <Link className="management-exit" href="/dashboard/customer"><FiHome /> Storefront</Link>
          <button className="management-logout" disabled={loggingOut} onClick={handleLogout} type="button"><FiLogOut /> Logout</button>
        </div>
      </div>
    </header>
  );
}
