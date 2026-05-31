import Link from "next/link";
import Image from "next/image";

type HeaderProps = {
  cartCount?: number;
  active?: string;
  mode?: "public" | "customer";
};

const publicLinks = [
  { key: "home", href: "/", label: "Home" },
  { key: "catalog", href: "/catalog", label: "Catalog" },
  { key: "about", href: "/about", label: "About" },
  { key: "contact", href: "/contact", label: "Contact" }
];

const customerLinks = [
  { key: "customer", href: "/dashboard/customer", label: "Overview" },
  { key: "catalog", href: "/dashboard/customer/catalog", label: "Catalog" },
  { key: "orders", href: "/dashboard/customer/my-orders", label: "My Orders" },
  { key: "profile", href: "/dashboard/customer/profile/address", label: "Address" },
  { key: "cart", href: "/dashboard/customer/cart", label: "Cart" }
];

export function Header({ cartCount = 0, active = "home", mode = "public" }: HeaderProps) {
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
          <button type="submit">Cari</button>
        </form>
        <div className="header-actions">
          <Link className="ghost-button" href="/login">Masuk</Link>
          <Link className="cart-button" href="/dashboard/customer/cart" aria-label="Keranjang">
            <span>Bag</span>
            <strong>{cartCount}</strong>
          </Link>
        </div>
      </div>
      <div className="header-submenu">
        <nav className="desktop-nav" aria-label="Menu utama">
          {links.map((link) => <Link className={linkClass(link.key)} href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
