import type { Store } from "../lib/types";

type HeroProps = {
  store: Store;
  serviceable: boolean;
  distanceKm: number;
  onLocate: () => void;
};

export function Hero({ store, serviceable, distanceKm, onLocate }: HeroProps) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Market Snap</p>
        <h1>Everything You Need, Just Nearby.</h1>
        <p className="hero-text">
          Semua yang kamu butuhkan dari toko terdekat, langsung ke tanganmu dengan stok cabang dan promo aktif.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onLocate}>Gunakan lokasi saya</button>
          <a className="secondary-button" href="#products">Lihat produk</a>
        </div>
        <div className={`service-chip ${serviceable ? "ok" : "warn"}`}>
          {serviceable ? `${store.name} - ${distanceKm || "<1"} km` : "Di luar jangkauan toko terdekat"}
        </div>
      </div>
      <div className="hero-visual" aria-label="Promo produk segar">
        <FeatureCard image="/product.png" tone="orange" title="Product" action="Shop Now" />
        <FeatureCard image="/coupon.png" tone="cyan" title="Coupon" action="Get Now" />
        <FeatureCard image="/discount-product.png" tone="orange" title="Discount Product" action={store.eta} />
        <FeatureCard image="/pineapple.png" tone="green" title="Nearby Store" action={store.name} />
      </div>
    </section>
  );
}

function FeatureCard({ image, tone, title, action }: { image: string; tone: string; title: string; action: string }) {
  return (
    <article className={`feature-card ${tone}`}>
      <img alt={title} src={image} />
      <h2>{title}</h2>
      <span>{action}</span>
    </article>
  );
}
