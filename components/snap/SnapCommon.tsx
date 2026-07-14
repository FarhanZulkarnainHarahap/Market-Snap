"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiBell,
  FiClock,
  FiChevronDown,
  FiHeadphones,
  FiHeart,
  FiHome,
  FiLock,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiPlus,
  FiUser,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
  FiTruck,
  FiX
} from "react-icons/fi";
import { rupiah } from "@/lib/format";
import { fetchCurrentUser, fetchStores, logoutUser } from "@/lib/api";
import type { Product, Store } from "@/lib/types";

type HeaderProps = {
  active?: "home" | "catalog" | "about" | "contact" | "orders" | "cart" | "notifications" | "profile";
  simple?: boolean;
  cartCount?: number;
};

type HeaderSession = {
  isLoggedIn: boolean;
  name: string;
};

const DEFAULT_LOCATION_LABEL = "Market Snap Center";
const CUSTOMER_HOME = "/dashboard/customer";
const CUSTOMER_CATALOG = "/dashboard/customer/catalog";
const CUSTOMER_ABOUT = "/dashboard/customer/about";
const CUSTOMER_CONTACT = "/dashboard/customer/contact";
const CUSTOMER_CART = "/dashboard/customer/cart";
const CUSTOMER_PROFILE = "/dashboard/customer/profile";
const CUSTOMER_ORDERS = "/dashboard/customer/profile/orders";
const CUSTOMER_NOTIFICATIONS = "/dashboard/customer/profile/notifications";
const CUSTOMER_VOUCHERS = "/dashboard/customer/profile/vouchers";

const navItems = [
  { key: "home", href: CUSTOMER_HOME, label: "Home", icon: FiHome },
  { key: "catalog", href: CUSTOMER_CATALOG, label: "Catalog", icon: FiShoppingBag },
  { key: "about", href: CUSTOMER_ABOUT, label: "About", icon: FiShield },
  { key: "contact", href: CUSTOMER_CONTACT, label: "Contact", icon: FiHeadphones }
] as const;

export function SnapHeader({ active = "home", simple = false, cartCount = 0 }: HeaderProps) {
  const [locationLabel, setLocationLabel] = useState(readCachedLocationLabel);
  const [session, setSession] = useState<HeaderSession>(readSession);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
    fetchStores()
      .then((stores) => {
        const selected = stores[0];
        if (selected) setLocationLabel(selected.area || selected.name);
      })
      .catch(() => undefined);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [profileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const opener = menuButtonRef.current;
    document.body.style.overflow = "hidden";

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>("a,button")).filter((item) => !item.hasAttribute("disabled"));
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
    }

    window.addEventListener("keydown", handleKeydown);
    window.setTimeout(() => drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
      opener?.focus();
    };
  }, [mobileOpen]);

  const profileLabel = displayName(session.name);
  const mobileItems = [
    ...navItems,
    { key: "profile", href: session.isLoggedIn ? CUSTOMER_PROFILE : "/auth/login", label: "Profile", icon: FiUser },
    { key: "orders", href: CUSTOMER_ORDERS, label: "Pesanan Saya", icon: FiPackage },
    { key: "vouchers", href: CUSTOMER_VOUCHERS, label: "Voucher Saya", icon: FiHeart },
    { key: "cart", href: CUSTOMER_CART, label: `Cart (${cartCount})`, icon: FiShoppingCart },
    { key: "location", href: CUSTOMER_PROFILE, label: locationLabel, icon: FiMapPin },
    { key: "notifications", href: CUSTOMER_NOTIFICATIONS, label: "Notifikasi", icon: FiBell }
  ] as const;

  return (
    <header className="snap-header">
      <Link className="snap-brand" href={CUSTOMER_HOME}><span>MARKET SNAP</span></Link>
      {!simple && (
        <button
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Tutup menu customer" : "Buka menu customer"}
          className="customer-menu-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      )}
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
          <Link href={CUSTOMER_HOME}>Beranda</Link>
          <Link href={CUSTOMER_ABOUT}>Tentang Kami</Link>
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
          <Link className="outline-action" href="/auth/login">Login</Link>
        ))}
        {!simple && <Link className="cart-action" href={CUSTOMER_CART}><FiShoppingCart /> Keranjang <span>{cartCount}</span></Link>}
      </div>
      {mobileOpen && <button aria-label="Tutup menu" className="customer-drawer-overlay" onClick={() => setMobileOpen(false)} type="button" />}
      {mobileOpen && (
        <div aria-modal="true" className="customer-mobile-drawer" ref={drawerRef} role="dialog">
          <div className="customer-mobile-drawer-head">
            <div>
              <strong>MARKET SNAP</strong>
              <small>{session.isLoggedIn ? `Halo, ${profileLabel}` : "Belanja dari cabang terdekat"}</small>
            </div>
            <button aria-label="Tutup menu customer" onClick={() => setMobileOpen(false)} type="button"><FiX /></button>
          </div>
          <button className="customer-drawer-location" onClick={() => refreshLocationLabel(setLocationLabel)} type="button"><FiMapPin /> <span>{locationLabel}</span></button>
          <nav aria-label="Menu customer mobile">
            {mobileItems.map((item) => {
              const Icon = item.icon;
              return (
              <Link className={active === item.key ? "active" : ""} href={item.href} key={item.key} onClick={() => setMobileOpen(false)}>
                <Icon />
                <span>{item.label}</span>
              </Link>
              );
            })}
            {session.isLoggedIn && <button onClick={() => logout(setSession, setProfileOpen)} type="button"><FiLogOut /><span>Logout</span></button>}
          </nav>
        </div>
      )}
      {!simple && <MobileGroceryNav active={active} cartCount={cartCount} locationLabel={locationLabel} profileLabel={profileLabel} session={session} />}
    </header>
  );
}

function MobileGroceryNav({ active, cartCount, locationLabel, profileLabel, session }: { active: HeaderProps["active"]; cartCount: number; locationLabel: string; profileLabel: string; session: HeaderSession }) {
  return (
    <nav className="mobile-grocery-nav" aria-label="Navigasi mobile">
      <span className="mobile-veg veg-left" aria-hidden="true">🥬</span>
      <span className="mobile-veg veg-right" aria-hidden="true">🥕</span>
      <div className="mobile-location"><FiMapPin /> {locationLabel}</div>
      <div className="mobile-nav-track">
        <Link className={active === "home" ? "active" : ""} href={CUSTOMER_HOME}>
          <FiHome />
          <span>Home</span>
        </Link>
        <Link className={active === "catalog" ? "active" : ""} href={CUSTOMER_CATALOG}>
          <FiShoppingBag />
          <span>Catalog</span>
        </Link>
        <Link className={active === "orders" ? "active" : ""} href={CUSTOMER_ORDERS}>
          <FiPackage />
          <span>Orders</span>
        </Link>
        <Link className={active === "cart" ? "mobile-cart-link active" : "mobile-cart-link"} href={CUSTOMER_CART}>
          <FiShoppingCart />
          <span>Cart</span>
          <strong>{cartCount}</strong>
        </Link>
        <Link className={active === "notifications" ? "active" : ""} href={CUSTOMER_NOTIFICATIONS}>
          <FiBell />
          <span>Notif</span>
        </Link>
        <Link className={active === "profile" ? "mobile-profile-link active" : "mobile-profile-link"} href={session.isLoggedIn ? CUSTOMER_PROFILE : "/auth/login"}>
          <FiUser />
          <span>{session.isLoggedIn ? profileLabel : "Login"}</span>
        </Link>
      </div>
    </nav>
  );
}

function ProfileMenu({ onLogout }: { onLogout: () => void }) {
  const menuItems = [
    { href: CUSTOMER_PROFILE, icon: FiUser, label: "Profil Saya", text: "Profil, alamat, pesanan" },
    { href: CUSTOMER_NOTIFICATIONS, icon: FiBell, label: "Notifikasi", text: "Update pesanan & promo" }
  ];

  return (
    <div className="profile-menu" onClick={(event) => event.stopPropagation()} role="menu">
      {menuItems.map(({ href, icon: Icon, label, text }) => (
        <Link href={href} key={href} role="menuitem">
          <Icon />
          <span><strong>{label}</strong><small>{text}</small></span>
        </Link>
      ))}
      <button onClick={onLogout} role="menuitem" type="button"><FiLogOut /> Logout</button>
    </div>
  );
}

function logout(setSession: (session: HeaderSession) => void, setProfileOpen: (open: boolean) => void) {
  setSession({ isLoggedIn: false, name: "" });
  setProfileOpen(false);
  void logoutUser().finally(() => {
    window.location.href = "/auth/login";
  });
}

function readSession(): HeaderSession {
  if (typeof window === "undefined") return { isLoggedIn: false, name: "" };
  const role = readCookie("market-snap-role") || window.localStorage.getItem("market-snap-role");
  const name = window.localStorage.getItem("market-snap-user-name") || window.localStorage.getItem("market-snap-user-email") || "";
  return {
    isLoggedIn: Boolean(role || name),
    name
  };
}

function readCachedLocationLabel() {
  if (typeof window === "undefined") return DEFAULT_LOCATION_LABEL;
  return window.localStorage.getItem("market-snap-location-label") || DEFAULT_LOCATION_LABEL;
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  return document.cookie.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`))?.slice(name.length + 1) ?? "";
}

function displayName(name: string) {
  if (!name) return "Profil";
  const firstName = name.split(/\s+/)[0];
  return firstName.length > 16 ? `${firstName.slice(0, 14)}...` : firstName;
}

function refreshLocationLabel(setLocationLabel: (label: string) => void) {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    clearCachedLocation();
    setLocationLabel(DEFAULT_LOCATION_LABEL);
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
      clearCachedLocation();
      setLocationLabel(DEFAULT_LOCATION_LABEL);
    },
    { enableHighAccuracy: true, maximumAge: 60_000, timeout: 5000 }
  );
}

function clearCachedLocation() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("market-snap-location-label");
  window.localStorage.removeItem("market-snap-location-lat");
  window.localStorage.removeItem("market-snap-location-lng");
  window.localStorage.removeItem("market-snap-location-updated-at");
}

function labelFromCoordinates(lat: number, lng: number) {
  if (lat >= 3.35 && lat <= 3.9 && lng >= 98.45 && lng <= 99.05) return "Medan";
  if (lat >= -6.45 && lat <= -5.95 && lng >= 106.6 && lng <= 107.05) return "Jakarta Selatan";
  if (lat >= -6.45 && lat <= -6.1 && lng >= 106.55 && lng <= 106.85) return "Tangerang Selatan";
  if (lat >= -6.45 && lat <= -6.05 && lng >= 106.9 && lng <= 107.15) return "Bekasi";
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}

type GroceryVisualVariant = "hero" | "promo" | "catalog" | "storefront";

const groceryVisuals: Record<GroceryVisualVariant, { alt: string; height: number; src: string; width: number }> = {
  hero: {
    alt: "Tas belanja Market Snap berisi produk segar",
    height: 900,
    src: "/market-snap-hero-v2.png",
    width: 1350
  },
  promo: {
    alt: "Voucher promo Market Snap dengan perlengkapan pengiriman",
    height: 720,
    src: "/market-snap-promo-v2.png",
    width: 1350
  },
  catalog: {
    alt: "Kumpulan produk katalog Market Snap",
    height: 675,
    src: "/market-snap-catalog-v2.png",
    width: 1350
  },
  storefront: {
    alt: "Toko grocery Market Snap dengan pengiriman cepat",
    height: 900,
    src: "/market-snap-storefront-v2.png",
    width: 1350
  }
};

export function GroceryVisual({ compact = false, variant = "hero" }: { compact?: boolean; variant?: GroceryVisualVariant }) {
  const visual = groceryVisuals[variant];

  return (
    <div className={`grocery-visual variant-${variant}${compact ? " compact" : ""}`}>
      <div className="visual-halo" />
      <div className="grocery-stage">
        {variant === "hero" && <div className="freshness-card">
          <FiShield />
          <span><strong>Fresh Check</strong><small>Dipilih pagi ini</small></span>
        </div>}
        <Image alt={visual.alt} className="product-stack-image" height={visual.height} priority src={visual.src} width={visual.width} />
        {variant === "hero" && <div className="brand-tote">
          <span>MARKET SNAP</span>
          <small>nearest branch</small>
        </div>}
        {variant !== "catalog" && <div className="delivery-chip">
          <FiTruck />
          <span>{variant === "storefront" ? "Cabang aktif" : "20-30 min"}</span>
        </div>}
      </div>
    </div>
  );
}

export function ProductCard({ product, storeId, disabled = false, onAdd }: { product: Product; storeId?: string; disabled?: boolean; onAdd?: (product: Product) => void }) {
  const activeStoreId = storeId ?? Object.keys(product.stockByStore)[0] ?? "";
  const stock = product.stockByStore[activeStoreId] ?? 0;
  const productHref = `${CUSTOMER_HOME}/product/${product.id}`;
  return (
    <article className="snap-product-card">
      <Link className="product-picture" href={productHref}>
        <Image alt={product.name} height={220} src={product.image} width={260} />
        {product.discount && <span className="promo-dot">{product.discount}</span>}
      </Link>
      <div className="snap-product-body">
        <Link href={productHref}><h3>{product.name}</h3></Link>
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
        <Link href={CUSTOMER_CATALOG}>Cara Belanja</Link>
        <Link href={CUSTOMER_ABOUT}>Syarat & Ketentuan</Link>
        <Link href={CUSTOMER_CONTACT}>Pusat Bantuan</Link>
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
        <Link href={CUSTOMER_CATALOG}>Lihat semua <FiArrowRight /></Link>
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
