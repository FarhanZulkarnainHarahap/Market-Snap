"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiChevronRight, FiSearch, FiSliders } from "react-icons/fi";
import { addCartItem, fetchCart, fetchCategories, fetchProducts, fetchStores } from "@/lib/api";
import type { Product, Store } from "@/lib/types";
import { GroceryVisual, ProductCard, ProductGridSkeleton, SnapFooter, SnapHeader, BenefitStrip } from "./SnapCommon";

type CatalogState = {
  products: Product[];
  categories: string[];
  stores: Store[];
  store?: Store;
  serviceable: boolean;
  cartCount: number;
  message: string;
  loading: boolean;
};

const defaultState: CatalogState = {
  products: [],
  categories: ["Semua"],
  stores: [],
  serviceable: true,
  cartCount: 0,
  message: "",
  loading: true
};

export function SnapHomePage() {
  const [state, setState] = useState(defaultState);
  const featured = state.products.slice(0, 8);

  useEffect(() => {
    loadCatalog({ limit: "8" }).then(setState);
  }, []);

  return (
    <>
      <SnapHeader active="home" cartCount={state.cartCount} />
      <main>
        <section className="home-hero">
          <div>
            <span className="eyebrow">Fresh from nearest branch</span>
            <h1>Belanja segar dari cabang yang paling dekat.</h1>
            <p>Market Snap menampilkan stok aktual dari cabang terdekat supaya belanja harian lebih cepat, transparan, dan praktis.</p>
            <div className="hero-buttons">
              <Link className="primary-snap" href="/catalog">Mulai belanja <FiChevronRight /></Link>
              <Link className="secondary-snap" href="/about">Tentang kami</Link>
            </div>
          </div>
          <GroceryVisual variant="hero" />
        </section>
        <section className="snap-section">
          <div className="snap-section-title inline">
            <div>
              <span className="eyebrow">Produk pilihan</span>
              <h2>Stok segar di {state.store?.name ?? "cabang utama"}</h2>
            </div>
            <Link href="/catalog">Lihat catalog <FiChevronRight /></Link>
          </div>
          {state.loading ? <ProductGridSkeleton count={8} /> : (
            <>
              {state.message && <p className="catalog-message">{state.message}</p>}
              <div className="snap-product-grid">
                {featured.map((product) => <ProductCard key={product.id} product={product} storeId={state.store?.id} />)}
              </div>
            </>
          )}
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

export function SnapCatalogPage({ initialSearch = "" }: { initialSearch?: string }) {
  const [state, setState] = useState(defaultState);
  const [query, setQuery] = useState(initialSearch);
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState("featured");
  const [storeId, setStoreId] = useState("");
  const [onlyStock, setOnlyStock] = useState(true);
  const [onlyPromo, setOnlyPromo] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = { limit: "48", sort };
    if (query.trim()) params.search = query.trim();
    if (category !== "Semua" && category !== "Semua Produk") params.category = category;
    if (storeId) params.storeId = storeId;
    loadCatalog(params).then(setState);
  }, [category, query, sort, storeId]);

  const visibleProducts = useMemo(() => {
    return state.products.filter((product) => {
      const stock = state.store ? product.stockByStore[state.store.id] ?? 0 : 0;
      if (onlyStock && stock < 1) return false;
      if (onlyPromo && !product.discount) return false;
      return true;
    });
  }, [onlyPromo, onlyStock, state.products, state.store]);

  async function addProduct(product: Product) {
    if (!state.store) return;
    try {
      await addCartItem(product.id, state.store.id);
      const cart = await fetchCart();
      setState((current) => ({ ...current, cartCount: cart.summary.totalItems, message: `${product.name} masuk ke keranjang.` }));
    } catch (error) {
      setState((current) => ({ ...current, message: error instanceof Error ? error.message : "Silakan login untuk menambahkan produk." }));
    }
  }

  return (
    <>
      <SnapHeader active="catalog" cartCount={state.cartCount} />
      <main>
        <section className="catalog-hero">
          <div>
            <h1>Fresh Catalog</h1>
            <p>Belanja grocery dari cabang terdekat</p>
          </div>
          <GroceryVisual compact variant="catalog" />
        </section>
        <section className="catalog-search-card" aria-label="Filter katalog">
          <label className="search-box">
            <input onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk segar, sehat, dan berkualitas..." value={query} />
            <FiSearch />
          </label>
          <label>
            <small>Cabang</small>
            <select value={storeId || state.store?.id || ""} onChange={(event) => setStoreId(event.target.value)}>
              {state.stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
            </select>
          </label>
          <label>
            <small>Urutkan</small>
            <select onChange={(event) => setSort(event.target.value)} value={sort}>
              <option value="featured">Terbaru</option>
              <option value="price_asc">Harga termurah</option>
              <option value="price_desc">Harga tertinggi</option>
              <option value="stock">Stok terbanyak</option>
            </select>
          </label>
        </section>
        <section className="catalog-layout">
          <aside className="filter-sidebar">
            <h3>Kategori</h3>
            {["Semua Produk", ...state.categories.filter((item) => item !== "Semua")].map((item) => (
              <button className={item === category || (item === "Semua Produk" && category === "Semua") ? "active" : ""} key={item} onClick={() => setCategory(item === "Semua Produk" ? "Semua" : item)} type="button">{item}</button>
            ))}
            <hr />
            <h3>Rentang Harga</h3>
            <div className="range-line"><span /><span /></div>
            <div className="price-pills"><span>Rp 0</span><span>Rp 100.000+</span></div>
            <label className="switch-row">Stok Tersedia <input checked={onlyStock} onChange={(event) => setOnlyStock(event.target.checked)} type="checkbox" /></label>
            <label className="switch-row">Produk Promo <input checked={onlyPromo} onChange={(event) => setOnlyPromo(event.target.checked)} type="checkbox" /></label>
            <div className="promo-panel">
              <strong>Promo aktif</strong>
              <p>Diskon mengikuti cabang terpilih</p>
              <Link href="/catalog">Belanja Sekarang</Link>
            </div>
          </aside>
          <div className="catalog-results">
            <div className="catalog-results-head">
              <div className="filter-chips">
                {["Semua Produk", "Promo", "Stok Tersedia"].map((chip) => <button className={chip === "Semua Produk" ? "active" : ""} key={chip} type="button">{chip}</button>)}
              </div>
              <button className="clear-filter" onClick={() => { setCategory("Semua"); setOnlyPromo(false); setOnlyStock(false); setQuery(""); }} type="button"><FiSliders /> Hapus filter</button>
            </div>
            {state.loading ? <ProductGridSkeleton count={12} /> : (
              <>
                {state.message && <p className="catalog-message">{state.message}</p>}
                {!state.serviceable && <p className="catalog-message warning">Lokasi Anda di luar radius cabang terdekat. Silakan pilih alamat lain.</p>}
                <div className="snap-product-grid">
                  {visibleProducts.map((product) => <ProductCard key={product.id} onAdd={addProduct} product={product} storeId={state.store?.id} />)}
                </div>
              </>
            )}
            <div className="pagination-row">
              <span>Menampilkan {visibleProducts.length} produk</span>
              <div><button type="button">1</button><button type="button">2</button><button type="button">3</button></div>
              <select defaultValue="48"><option value="48">48 / halaman</option></select>
            </div>
          </div>
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

async function loadCatalog(extra: Record<string, string>): Promise<CatalogState> {
  const params = new URLSearchParams(extra);
  const point = await browserLocation();
  if (point) {
    params.set("lat", String(point.lat));
    params.set("lng", String(point.lng));
  }

  try {
    const [catalog, categories, stores, cart] = await Promise.all([
      fetchProducts(params),
      fetchCategories().catch(() => ["Semua"]),
      fetchStores().catch(() => []),
      fetchCart().catch(() => ({ items: [], summary: { totalItems: 0, total: 0 } }))
    ]);
    return {
      products: catalog.products,
      categories,
      stores: stores.length ? stores : [catalog.store],
      store: catalog.store,
      serviceable: catalog.serviceable,
      cartCount: cart.summary.totalItems,
      message: "",
      loading: false
    };
  } catch (error) {
    return { ...defaultState, loading: false, message: error instanceof Error ? error.message : "Data belum dapat dimuat." };
  }
}

async function browserLocation(): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve(null),
      { maximumAge: 60_000, timeout: 1800 }
    );
  });
}
