"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiGrid, FiHome, FiInfo, FiLogIn, FiMail, FiMapPin, FiMenu, FiPackage, FiSearch, FiShoppingCart, FiUser, FiX } from "react-icons/fi";

type HeaderProps = {
  cartCount?: number;
  active?: string;
  mode?: "public" | "customer";
};

const publicLinks = [
  { key: "home", href: "/", icon: FiHome, label: "Home" },
  { key: "catalog", href: "/catalog", icon: FiGrid, label: "Catalog" },
  { key: "about", href: "/about", icon: FiInfo, label: "About" },
  { key: "contact", href: "/contact-us", icon: FiMail, label: "Contact" }
];

const customerLinks = [
  { key: "customer", href: "/", icon: FiHome, label: "Overview" },
  { key: "catalog", href: "/catalog", icon: FiGrid, label: "Catalog" },
  { key: "orders", href: "/dashboard/customer/my-orders", icon: FiPackage, label: "Pesanan" },
  { key: "profile", href: "/dashboard/customer/profile/address", icon: FiMapPin, label: "Alamat" },
  { key: "cart", href: "/cart", icon: FiShoppingCart, label: "Cart" }
];

export function Header({ cartCount = 0, active = "home", mode = "public" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkClass = (key: string) => `nav-link ${active === key ? "is-active" : ""}`;
  const links = mode === "customer" ? customerLinks : publicLinks;

  return (
    <header className="site-header">
      <div className="header-notice">Welcome to Market Snap</div>
      <div className="header-main">
        <Link className="brand" href="/">
          <Image src="/market-snap-favicon-transparent.png" alt="Market Snap" width={52} height={52} />
          <span>MARKET SNAP</span>
        </Link>
        <form action="/catalog" className="header-search" role="search">
          <input aria-label="Cari produk grocery" name="search" placeholder="Cari sayur, buah, susu..." type="search" />
          <button aria-label="Cari produk" title="Cari produk" type="submit"><FiSearch /></button>
        </form>
        <div className="header-actions">
          <Link className="ghost-button" href="/auth/login"><FiLogIn /><span>Login</span></Link>
          <Link className="cart-button" href="/cart" aria-label="Keranjang">
            <FiShoppingCart />
            <span>Cart</span>
            <strong>{cartCount}</strong>
          </Link>
          <button
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            title={menuOpen ? "Tutup menu" : "Buka menu"}
            type="button"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <div className={`header-submenu ${menuOpen ? "is-open" : ""}`}>
        <nav className="desktop-nav" aria-label="Menu utama">
          {links.map((link) => (
            <Link className={linkClass(link.key)} href={link.href} key={link.href} onClick={() => setMenuOpen(false)}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          ))}
          <Link className="mobile-login" href="/auth/login" onClick={() => setMenuOpen(false)}><FiUser /><span>Login</span></Link>
        </nav>
      </div>
    </header>
  );
}
