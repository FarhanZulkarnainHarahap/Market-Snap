"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiClock, FiGift, FiMapPin, FiSearch, FiShoppingBag, FiTruck, FiZap } from "react-icons/fi";
import { BenefitStrip, GroceryVisual, ProductCard, ProductGridSkeleton, SnapFooter, SnapHeader } from "@/components/snap/SnapCommon";
import { addCartItem, fetchCart, fetchCategories, fetchProducts, fetchStores } from "@/lib/api";
import type { Product, Store } from "@/lib/types";

type HomeState = {
  products: Product[];
  categories: string[];
  store?: Store;
  cartCount: number;
  message: string;
  loading: boolean;
};

const homeSections = [
  { key: "flash", title: "Flash sale cabang terdekat", category: "Promo Hari Ini", limit: 4 },
  { key: "fresh", title: "Buah dan sayur segar", category: "Buah", limit: 4 },
  { key: "kitchen", title: "Kebutuhan dapur", category: "Bumbu Dapur", limit: 4 },
  { key: "healthy", title: "Healthy choice", category: "Produk Organik", limit: 4 },
  { key: "family", title: "Paket hemat keluarga", category: "Promo Hari Ini", limit: 4 }
];

export function CustomerHomePage() {
  const [state, setState] = useState<HomeState>({
    products: [],
    categories: ["Semua"],
    cartCount: 0,
    message: "",
    loading: true
  });
  const grouped = useMemo(() => {
    return homeSections.map((section) => {
      const categoryProducts = state.products.filter((product) => product.category === section.category);
      const products = categoryProducts.length ? categoryProducts : state.products.filter((product) => Boolean(product.discount));
      return { ...section, products: products.slice(0, section.limit) };
    }).filter((section) => section.products.length);
  }, [state.products]);

  useEffect(() => {
    loadHome().then(setState);
  }, []);

  async function addProduct(product: Product) {
    if (!state.store) return;
    try {
      await addCartItem(product.id, state.store.id);
      const cart = await fetchCart();
      setState((current) => ({ ...current, cartCount: cart.summary.totalItems, message: `${product.name} masuk ke keranjang.` }));
    } catch (error) {
      setState((current) => ({ ...current, message: error instanceof Error ? error.message : "Login untuk menambahkan produk." }));
    }
  }

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
              <button className="secondary-snap" onClick={() => requestLocation(setState)} type="button">Gunakan lokasi saya</button>
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

        <section className="home-command-bar" aria-label="Pencarian dan lokasi Market Snap">
          <Link className="home-search-link" href="/catalog"><FiSearch /> Cari produk, kategori, atau promo</Link>
          <span><FiMapPin /> Cabang aktif: {state.store?.name ?? "Market Snap Center"}</span>
          <Link href="/catalog?promo=true"><FiGift /> Promo hari ini</Link>
        </section>

        <section className="snap-section">
          <div className="snap-section-title inline">
            <div>
              <span className="eyebrow">Kategori Cepat</span>
              <h2>Belanja dari rak yang paling sering dicari</h2>
            </div>
            <Link href="/catalog">Semua kategori <FiArrowRight /></Link>
          </div>
          <div className="category-rail">
            {state.categories.filter((item) => item !== "Semua").slice(0, 20).map((category, index) => (
              <Link href={`/catalog?category=${encodeURIComponent(category)}`} key={category}>
                <Image alt="" height={56} src={`/categories/${slugify(category)}.svg`} width={56} />
                <span>{category}</span>
                <small>{index < 4 ? "Populer" : "Fresh"}</small>
              </Link>
            ))}
          </div>
        </section>

        {state.message && <p className="home-toast" role="status">{state.message}</p>}

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
                <ProductCard key={product.id} onAdd={addProduct} product={product} storeId={state.store?.id} />
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
                <span><FiZap /> Flash sale aktif</span>
                <span>Fresh stock pagi</span>
                <span>Checkout Xendit aman</span>
              </div>
              <Link className="primary-snap" href="/catalog">Belanja sekarang <FiArrowRight /></Link>
            </div>
            <div className="promo-visual-wrap">
              <GroceryVisual compact variant="promo" />
              <div className="promo-progress" aria-hidden="true"><span /><span /><span /></div>
            </div>
          </div>
        </section>

        {grouped.map((section) => (
          <section className="snap-section" key={section.key}>
            <div className="snap-section-title inline">
              <div>
                <span className="eyebrow">{section.category}</span>
                <h2>{section.title}</h2>
              </div>
              <Link href={`/catalog?category=${encodeURIComponent(section.category)}`}>Lihat rak <FiArrowRight /></Link>
            </div>
            <div className="snap-product-grid">
              {section.products.map((product) => <ProductCard key={`${section.key}-${product.id}`} onAdd={addProduct} product={product} storeId={state.store?.id} />)}
            </div>
          </section>
        ))}

        <section className="shopping-flow">
          {[
            ["1", "Pilih lokasi", "Market Snap memilih cabang terdekat dan stok aktual."],
            ["2", "Masukkan cart", "Quick add, voucher, dan ringkasan total siap dicek."],
            ["3", "Checkout aman", "Alamat, jadwal, ongkir, dan Xendit diproses end-to-end."],
            ["4", "Pantau pesanan", "Invoice dan tracking tersedia dari akun customer."]
          ].map(([step, title, text]) => (
            <article key={step}><strong>{step}</strong><h3>{title}</h3><p>{text}</p></article>
          ))}
        </section>

        <section className="home-newsletter">
          <div>
            <span className="eyebrow">Market Snap PWA</span>
            <h2>Promo segar langsung dari cabang favoritmu.</h2>
            <p>Simpan Market Snap di layar utama dan nikmati pengalaman grocery yang lebih cepat di mobile.</p>
          </div>
          <Link className="primary-snap" href="/profile/vouchers">Lihat voucher saya <FiArrowRight /></Link>
        </section>

        <BenefitStrip />
      </main>
      <SnapFooter />
    </>
  );
}

async function loadHome(): Promise<HomeState> {
  try {
    const [catalog, categories, stores, cart] = await Promise.all([
      fetchProducts(new URLSearchParams({ limit: "32" })),
      fetchCategories().catch(() => ["Semua"]),
      fetchStores().catch(() => []),
      fetchCart().catch(() => ({ items: [], summary: { totalItems: 0, total: 0 } }))
    ]);

    return {
      products: catalog.products,
      categories,
      store: catalog.store || stores?.[0],
      cartCount: cart.summary.totalItems,
      message: "",
      loading: false
    };
  } catch {
    return {
      products: [],
      categories: ["Semua"],
      cartCount: 0,
      message: "Produk belum dapat dimuat. Coba buka katalog atau muat ulang halaman.",
      loading: false
    };
  }
}

function requestLocation(setState: React.Dispatch<React.SetStateAction<HomeState>>) {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    setState((current) => ({ ...current, message: "Browser belum mendukung lokasi otomatis." }));
    return;
  }
  navigator.geolocation.getCurrentPosition(
    () => setState((current) => ({ ...current, message: "Lokasi diperbarui. Katalog akan memakai cabang terdekat." })),
    () => setState((current) => ({ ...current, message: "Izin lokasi belum diberikan. Anda tetap bisa memilih cabang di katalog." })),
    { maximumAge: 60_000, timeout: 5000 }
  );
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
