"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiClock, FiMapPin, FiShoppingBag, FiTruck } from "react-icons/fi";
import { BenefitStrip, GroceryVisual, ProductCard, ProductGridSkeleton, SnapFooter, SnapHeader } from "@/components/snap/SnapCommon";
import { fetchCart, fetchProducts, fetchStores } from "@/lib/api";
import type { Product, Store } from "@/lib/types";

type HomeState = {
  products: Product[];
  store?: Store;
  cartCount: number;
  loading: boolean;
};

export function CustomerHomePage() {
  const [state, setState] = useState<HomeState>({
    products: [],
    cartCount: 0,
    loading: true
  });

  useEffect(() => {
    loadHome().then(setState);
  }, []);

  return (
    <>
      <SnapHeader active="home" cartCount={state.cartCount} />
      <main>
        <section className="home-hero">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h1>Fresh groceries from your nearest branch.</h1>
            <p>Belanja kebutuhan harian lebih cepat, praktis, dan segar langsung dari cabang terdekat Market Snap.</p>
            <div className="hero-buttons">
              <Link className="primary-snap" href="/catalog">Mulai belanja <FiArrowRight /></Link>
              <Link className="secondary-snap" href="/profile/orders">Pesanan saya</Link>
            </div>
            <div className="feature-row dashboard-features">
              <span><FiTruck /> Delivery 20-30 menit</span>
              <span><FiMapPin /> {state.store?.name ?? "Market Snap"}</span>
              <span><FiShoppingBag /> Belanja lebih cepat</span>
              <span><FiClock /> Fresh setiap hari</span>
            </div>
          </div>
          <GroceryVisual variant="hero" />
        </section>

        <section className="snap-section">
          <div className="snap-section-title inline">
            <div>
              <span className="eyebrow">Produk Pilihan</span>
              <h2>Fresh products near you</h2>
            </div>
            <Link href="/catalog">Lihat catalog <FiArrowRight /></Link>
          </div>

          {state.loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="snap-product-grid">
              {state.products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} storeId={state.store?.id} />
              ))}
            </div>
          )}
        </section>

        <section className="snap-section">
          <div className="promo-banner">
            <div className="promo-copy">
              <span className="eyebrow">Promo Hari Ini</span>
              <h2>Gratis ongkir untuk pembelian di atas Rp 100.000</h2>
              <p>Nikmati pengiriman cepat dan promo menarik dari Market Snap.</p>
              <div className="promo-perks">
                <span>Diskon member 20%</span>
                <span>Fresh stock pagi</span>
                <span>Checkout aman</span>
              </div>
              <Link className="primary-snap" href="/catalog">Belanja sekarang <FiArrowRight /></Link>
            </div>
            <div className="promo-visual-wrap">
              <GroceryVisual compact variant="promo" />
              <div className="promo-progress" aria-hidden="true"><span /><span /><span /></div>
            </div>
          </div>
        </section>

        <BenefitStrip />
      </main>
      <SnapFooter />
    </>
  );
}

async function loadHome(): Promise<HomeState> {
  try {
    const [catalog, stores, cart] = await Promise.all([
      fetchProducts(new URLSearchParams({ limit: "8" })),
      fetchStores().catch(() => []),
      fetchCart().catch(() => ({ items: [], summary: { totalItems: 0, total: 0 } }))
    ]);

    return {
      products: catalog.products,
      store: catalog.store || stores?.[0],
      cartCount: cart.summary.totalItems,
      loading: false
    };
  } catch {
    return {
      products: [],
      cartCount: 0,
      loading: false
    };
  }
}
