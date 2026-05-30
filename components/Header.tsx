import Link from "next/link";
import Image from "next/image";

type HeaderProps = {
  cartCount?: number;
  active?: string;
};

export function Header({ cartCount = 0, active = "home" }: HeaderProps) {
  const linkClass = (key: string) => `nav-link ${active === key ? "is-active" : ""}`;

  return (
    <header className="site-header">
      <div className="header-notice">Welcome to Market Snap</div>
      <div className="header-main">
        <Link className="brand" href="/">
          <Image src="/market-snap.png" alt="Market Snap" width={40} height={40} />
          <span>MARKET SNAP</span>
        </Link>
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
          <Link className={linkClass("home")} href="/">Home</Link>
          <Link className={linkClass("customer")} href="/dashboard/customer">Customer</Link>
          <Link className={linkClass("profile")} href="/dashboard/customer/profile">Address</Link>
          <Link className={linkClass("cart")} href="/dashboard/customer/cart">Cart</Link>
          <Link className={linkClass("admin")} href="/dashboard/admin">Admin</Link>
          <Link className={linkClass("adminStore")} href="/dashboard/adminStore">Admin Store</Link>
        </nav>
      </div>
    </header>
  );
}
