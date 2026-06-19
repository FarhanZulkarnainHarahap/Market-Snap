"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiBell,
  FiClock,
  FiChevronDown,
  FiHeadphones,
  FiHeart,
  FiLogOut,
  FiLock,
  FiMapPin,
  FiPlus,
  FiUser,
  FiShield,
  FiShoppingCart,
  FiShoppingBag,
  FiTruck
} from "react-icons/fi";
import { rupiah } from "@/lib/format";
import { fetchCurrentUser } from "@/lib/api";
import type { Product, Store } from "@/lib/types";

type HeaderProps = {
  active?: "home" | "catalog" | "about" | "contact";
  simple?: boolean;
  cartCount?: number;
};

type HeaderSession = {
  isLoggedIn: boolean;
  name: string;
};

const navItems = [
  { key: "home", href: "/", label: "Home" },
  { key: "catalog", href: "/dashboard/customer/catalog", label: "Catalog" },
  { key: "about", href: "/dashboard/customer/about", label: "About" },
  { key: "contact", href: "/dashboard/customer/contact-us", label: "Contact" }
] as const;

export function SnapHeader({ active = "home", simple = false, cartCount = 0 }: HeaderProps) {
  const [locationLabel, setLocationLabel] = useState(readCachedLocationLabel);
  const [session, setSession] = useState<HeaderSession>(readSession);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const storedSession = readSession();
    const frame = window.requestAnimationFrame(() => setSession(storedSession));
    if (storedSession.isLoggedIn && !storedSession.name) {
      fetchCurrentUser()
        .then((user) => {
          window.localStorage.setItem("market-snap-user-name", user.name);
          window.localStorage.setItem("market-snap-user-email", user.email);
          setSession({ isLoggedIn: true, name: user.name || user.email });
        })
        .catch(() => undefined);
    }
    refreshLocationLabel(setLocationLabel);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [profileOpen]);

  const profileLabel = displayName(session.name);

  return (
    <header className="snap-header">
      <Link className="snap-brand" href="/">MARKET SNAP</Link>
      {!simple ? (
        <nav className="snap-nav" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <Link className={active === item.key ? "active" : ""} href={item.href} key={item.key}>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : (
        <nav className="snap-nav snap-simple-nav" aria-label="Navigasi utama">
          <Link href="/">Beranda</Link>
          <Link href="/dashboard/customer/about">Tentang Kami</Link>
        </nav>
      )}
      <div className="snap-actions">
        <button className="location-chip" onClick={() => refreshLocationLabel(setLocationLabel)} title="Perbarui lokasi dari GPS" type="button"><FiMapPin /> {locationLabel}</button>
        {!simple && (session.isLoggedIn ? (
          <div className="profile-menu-wrap">
            <button
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="profile-action"
              onClick={(event) => {
                event.stopPropagation();
                setProfileOpen((open) => !open);
              }}
              type="button"
            >
              <FiUser /> <span>{profileLabel}</span> <FiChevronDown />
            </button>
            {profileOpen && <ProfileMenu onLogout={() => logout(setSession, setProfileOpen)} />}
          </div>
        ) : (
          <Link className="outline-action" href="/auth/login">Masuk</Link>
        ))}
        {!simple && <Link className="cart-action" href="/dashboard/customer/cart"><FiShoppingCart /> Keranjang <span>{cartCount}</span></Link>}
      </div>
    </header>
  );
}

function ProfileMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="profile-menu" onClick={(event) => event.stopPropagation()} role="menu">
      <Link href="/dashboard/customer/profile" role="menuitem"><FiUser /> Profile</Link>
      <Link href="/dashboard/customer/my-orders" role="menuitem"><FiBell /> Notification</Link>
      <Link href="/dashboard/customer/my-orders" role="menuitem"><FiShoppingBag /> History</Link>
      <button onClick={onLogout} role="menuitem" type="button"><FiLogOut /> Logout</button>
    </div>
  );
}

function logout(setSession: (session: HeaderSession) => void, setProfileOpen: (open: boolean) => void) {
  window.localStorage.removeItem("market-snap-token");
  window.localStorage.removeItem("market-snap-user-id");
  window.localStorage.removeItem("market-snap-user-name");
  window.localStorage.removeItem("market-snap-user-email");
  window.localStorage.removeItem("market-snap-role");
  document.cookie = "market-snap-role=; path=/; max-age=0; SameSite=Lax";
  setSession({ isLoggedIn: false, name: "" });
  setProfileOpen(false);
  window.location.href = "/login";
}

function readSession(): HeaderSession {
  if (typeof window === "undefined") return { isLoggedIn: false, name: "" };
  const token = window.localStorage.getItem("market-snap-token");
  return {
    isLoggedIn: Boolean(token),
    name: window.localStorage.getItem("market-snap-user-name") || window.localStorage.getItem("market-snap-user-email") || ""
  };
}

function readCachedLocationLabel() {
  if (typeof window === "undefined") return "Mendeteksi lokasi";
  return window.localStorage.getItem("market-snap-location-label") || "Mendeteksi lokasi";
}

function displayName(name: string) {
  if (!name) return "Profil";
  const firstName = name.split(/\s+/)[0];
  return firstName.length > 16 ? `${firstName.slice(0, 14)}...` : firstName;
}

function refreshLocationLabel(setLocationLabel: (label: string) => void) {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    setLocationLabel("Lokasi tidak tersedia");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const label = labelFromCoordinates(position.coords.latitude, position.coords.longitude);
      window.localStorage.setItem("market-snap-location-label", label);
      window.localStorage.setItem("market-snap-location-lat", String(position.coords.latitude));
      window.localStorage.setItem("market-snap-location-lng", String(position.coords.longitude));
      window.localStorage.setItem("market-snap-location-updated-at", String(Date.now()));
      setLocationLabel(label);
    },
    () => {
      if (!window.localStorage.getItem("market-snap-location-label")) setLocationLabel("Aktifkan lokasi");
    },
    { enableHighAccuracy: true, maximumAge: 60_000, timeout: 5000 }
  );
}

function labelFromCoordinates(lat: number, lng: number) {
  if (lat >= 3.35 && lat <= 3.9 && lng >= 98.45 && lng <= 99.05) return "Medan";
  if (lat >= -6.45 && lat <= -5.95 && lng >= 106.6 && lng <= 107.05) return "Jakarta Selatan";
  if (lat >= -6.45 && lat <= -6.1 && lng >= 106.55 && lng <= 106.85) return "Tangerang Selatan";
  if (lat >= -6.45 && lat <= -6.05 && lng >= 106.9 && lng <= 107.15) return "Bekasi";
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

export function GroceryVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grocery-visual compact" : "grocery-visual"}>
      <div className="visual-halo" />
      <Image alt="Market Snap grocery bag" className="bag-image" height={520} priority src="/market-snap.png" width={520} />
      <img alt="Tomat segar" className="floating tomato" src="/tomato.png" />
      <img alt="Roti segar" className="floating bread" src="/bread.png" />
      <img alt="Nanas segar" className="floating pineapple" src="/pineapple.png" />
    </div>
  );
}

export function ProductCard({ product, storeId, disabled = false, onAdd }: { product: Product; storeId?: string; disabled?: boolean; onAdd?: (product: Product) => void }) {
  const activeStoreId = storeId ?? Object.keys(product.stockByStore)[0] ?? "";
  const stock = product.stockByStore[activeStoreId] ?? 0;
  return (
    <article className="snap-product-card">
      <Link className="product-picture" href={`/dashboard/customer/product/${product.id}`}>
        <img alt={product.name} src={product.image} />
        {product.discount && <span className="promo-dot">{product.discount}</span>}
      </Link>
      <div className="snap-product-body">
        <Link href={`/dashboard/customer/product/${product.id}`}><h3>{product.name}</h3></Link>
        <p>{product.unit}</p>
        <strong>{rupiah(product.price)}</strong>
        <small>Stok: {stock}</small>
        <div className="product-card-bottom">
          <span>{product.badge ?? product.category}</span>
          <button disabled={disabled || stock < 1} onClick={() => onAdd?.(product)} type="button"><FiPlus /> Keranjang</button>
        </div>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="snap-product-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <article className="snap-product-card skeleton-card" key={index}>
          <div className="product-picture skeleton-block" />
          <div className="snap-product-body">
            <span className="skeleton-line wide" />
            <span className="skeleton-line short" />
            <span className="skeleton-line medium" />
            <div className="product-card-bottom">
              <span className="skeleton-line short" />
              <span className="skeleton-button" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="panel-skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => <span className="skeleton-line wide" key={index} />)}
    </div>
  );
}

export function BenefitStrip() {
  const items = [
    { icon: FiShield, title: "100% Produk Segar", text: "Kualitas terjaga setiap hari" },
    { icon: FiTruck, title: "Pengantaran Cepat", text: "Sampai di hari yang sama" },
    { icon: FiLock, title: "Transaksi Aman", text: "Pembayaran terenkripsi" },
    { icon: FiHeadphones, title: "Layanan 24/7", text: "Kami siap membantu" }
  ];

  return (
    <section className="benefit-strip" aria-label="Keunggulan Market Snap">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title}>
          <Icon />
          <span><strong>{title}</strong><small>{text}</small></span>
        </div>
      ))}
    </section>
  );
}

export function SnapFooter() {
  return (
    <footer className="snap-footer">
      <div>
        <h3>Welcome</h3>
        <p>Market Snap hadir untuk membuat belanja harian lebih mudah, hemat, dan menyenangkan. Dari cabang terdekat ke rumahmu.</p>
        <strong className="footer-brand">MARKET SNAP</strong>
        <small>(c) 2025 Market Snap. All rights reserved.</small>
      </div>
      <div>
        <h3>Connect With Us</h3>
        <p>@marketsnap.id</p>
        <p>Market Snap</p>
        <p>0812-3456-7890</p>
      </div>
      <div>
        <h3>Useful Link</h3>
        <Link href="/dashboard/customer/catalog">Cara Belanja</Link>
        <Link href="/dashboard/customer/about">Syarat & Ketentuan</Link>
        <Link href="/dashboard/customer/contact-us">Pusat Bantuan</Link>
      </div>
      <div>
        <h3>Download Our App</h3>
        <p>Belanja lebih mudah lewat aplikasi Market Snap.</p>
        <span className="store-badge">Get it on Google Play</span>
        <span className="store-badge">Download on App Store</span>
      </div>
    </footer>
  );
}

export function SnapShell({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <>
      {children}
      {footer && (
        <>
          <BenefitStrip />
          <SnapFooter />
        </>
      )}
    </>
  );
}

export function RelatedProducts({ products, store }: { products: Product[]; store?: Store }) {
  return (
    <section className="snap-section">
      <div className="snap-section-title inline">
        <h2>Produk Terkait</h2>
        <Link href="/dashboard/customer/catalog">Lihat semua <FiArrowRight /></Link>
      </div>
      <div className="related-row">
        {products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} storeId={store?.id} />)}
      </div>
    </section>
  );
}

export function FeatureList() {
  return (
    <div className="feature-row">
      <span><FiClock /> Segar setiap hari</span>
      <span><FiShield /> Tanpa pengawet</span>
      <span><FiHeart /> 100% Alami</span>
    </div>
  );
}
