"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiClock, FiGift, FiLock, FiMapPin, FiSearch, FiZap } from "react-icons/fi";
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

const preferredCategories = [
  "Buah",
  "Sayur",
  "Dairy & Telur",
  "Kebersihan",
  "Minuman",
  "Roti & Bakery",
  "Sembako"
];

const categoryImageMap: Record<string, string> = {
  buah: "/categories/buah.png",
  fruit: "/categories/buah.png",
  sayur: "/categories/sayur.png",
  vegetables: "/categories/sayur.png",
  "dairy-telur": "/categories/daly-telur.png",
  "dairy-and-telur": "/categories/daly-telur.png",
  "susu-dan-dairy": "/categories/daly-telur.png",
  telur: "/categories/daly-telur.png",
  kebersihan: "/categories/kebersihan.png",
  "home-care": "/categories/kebersihan.png",
  "personal-care": "/categories/kebersihan.png",
  minuman: "/categories/minuman.png",
  drinks: "/categories/minuman.png",
  "roti-bakery": "/categories/roti-bakery.png",
  roti: "/categories/roti-bakery.png",
  bakery: "/categories/roti-bakery.png",
  sembako: "/categories/sembako.png",
  "beras-dan-bahan-pokok": "/categories/sembako.png",
  "bahan-pokok": "/categories/sembako.png"
};

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
  const categoryCards = useMemo(() => {
    const apiCategories = state.categories.filter((item) => item !== "Semua");
    const merged = [...preferredCategories, ...apiCategories].filter((category, index, all) => {
      const key = normalizeCategoryKey(category);
      return all.findIndex((item) => normalizeCategoryKey(item) === key) === index;
    });

    return merged.slice(0, 14).map((category) => ({
      name: category,
      image: getCategoryImage(category),
      count: state.products.filter((product) => categoryMatches(product.category, category)).length
    }));
  }, [state.categories, state.products]);

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
            <span className="eyebrow">Fresh check</span>
            <h1>Belanja segar dari cabang <mark>terdekat.</mark></h1>
            <p>Produk harian pilihan, dikirim cepat 20-30 menit langsung ke rumahmu.</p>
            <div className="hero-buttons">
              <Link className="primary-snap" href="/catalog">Belanja sekarang <FiArrowRight /></Link>
              <button className="secondary-snap" onClick={() => requestLocation(setState)} type="button">Gunakan lokasi saya</button>
            </div>
            <div className="feature-row dashboard-features">
              <span><FiClock /> Fresh setiap hari</span>
              <span><FiMapPin /> Cabang terdekat</span>
              <span><FiLock /> Checkout aman</span>
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
            {categoryCards.map((category) => (
              <Link href={`/catalog?category=${encodeURIComponent(category.name)}`} key={category.name}>
                <span className="category-image-wrap">
                  <Image alt={category.name} height={112} src={category.image} width={112} />
                </span>
                <span className="category-card-row"><strong>{category.name}</strong><FiArrowRight /></span>
                <small>{category.count ? `${category.count} produk` : "Rak pilihan"}</small>
              </Link>
            ))}
          </div>
        </section>

        {state.message && <p className="home-toast" role="status">{state.message}</p>}

        <section className="snap-section">
          <div className="snap-section-title inline">
            <div>
              <span className="eyebrow">Produk Pilihan</span>
              <h2>Produk segar di dekatmu</h2>
              <p>Stok pilihan dari cabang terdekat hari ini.</p>
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
              <div className="promo-art-crop" aria-hidden="true">
                <Image alt="" className="promo-banner-image" height={540} src="/banners/promo-gratis-ongkir.png" width={760} />
              </div>
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

function getCategoryImage(category: string) {
  const key = normalizeCategoryKey(category);
  return categoryImageMap[key] ?? categoryImageMap[key.replace(/^dairy-/, "dairy-and-")] ?? "/categories/sembako.png";
}

function categoryMatches(productCategory: string, selectedCategory: string) {
  const productKey = normalizeCategoryKey(productCategory);
  const selectedKey = normalizeCategoryKey(selectedCategory);
  if (productKey === selectedKey) return true;
  if (selectedKey === "dairy-telur") return productKey.includes("dairy") || productKey.includes("telur") || productKey.includes("susu");
  if (selectedKey === "roti-bakery") return productKey.includes("roti") || productKey.includes("bakery");
  if (selectedKey === "sembako") return productKey.includes("beras") || productKey.includes("bahan-pokok") || productKey.includes("sembako");
  if (selectedKey === "kebersihan") return productKey.includes("care") || productKey.includes("kebersihan");
  return productKey.includes(selectedKey) || selectedKey.includes(productKey);
}

function normalizeCategoryKey(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " and ")
    .replace(/\bdan\b/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
