import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiClock,
  FiHeadphones,
  FiHeart,
  FiLock,
  FiMapPin,
  FiPlus,
  FiShield,
  FiShoppingCart,
  FiTruck
} from "react-icons/fi";
import { products, rupiah, type SnapProduct } from "@/lib/snap-data";

type HeaderProps = {
  active?: "home" | "catalog" | "about" | "contact";
  simple?: boolean;
  cartCount?: number;
};

const navItems = [
  { key: "home", href: "/", label: "Home" },
  { key: "catalog", href: "/catalog", label: "Catalog" },
  { key: "about", href: "/about", label: "About" },
  { key: "contact", href: "/contact", label: "Contact" }
] as const;

export function SnapHeader({ active = "home", simple = false, cartCount = 3 }: HeaderProps) {
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
          <Link href="/about">Tentang Kami</Link>
        </nav>
      )}
      <div className="snap-actions">
        <button className="location-chip" type="button"><FiMapPin /> Jakarta Selatan</button>
        {!simple && <Link className="outline-action" href="/login">Masuk</Link>}
        {!simple && <Link className="cart-action" href="/cart"><FiShoppingCart /> Keranjang <span>{cartCount}</span></Link>}
      </div>
    </header>
  );
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

export function ProductCard({ product }: { product: SnapProduct }) {
  return (
    <article className="snap-product-card">
      <Link className="product-picture" href={`/product/${product.id}`}>
        <img alt={product.name} src={product.image} />
        {product.promo && <span className="promo-dot">Promo</span>}
      </Link>
      <div className="snap-product-body">
        <Link href={`/product/${product.id}`}><h3>{product.name}</h3></Link>
        <p>{product.unit}</p>
        <strong>{rupiah(product.price)}</strong>
        <small>Stok: {product.stock}</small>
        <div className="product-card-bottom">
          <span>Rating {product.rating} ({product.reviews})</span>
          <button type="button"><FiPlus /> Keranjang</button>
        </div>
      </div>
    </article>
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
        <Link href="/catalog">Cara Belanja</Link>
        <Link href="/about">Syarat & Ketentuan</Link>
        <Link href="/contact">Pusat Bantuan</Link>
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

export function RelatedProducts() {
  return (
    <section className="snap-section">
      <div className="snap-section-title inline">
        <h2>Produk Terkait</h2>
        <Link href="/catalog">Lihat semua <FiArrowRight /></Link>
      </div>
      <div className="related-row">
        {products.slice(1, 7).map((product) => <ProductCard key={product.id} product={product} />)}
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
