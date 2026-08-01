"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiChevronRight, FiSearch, FiSliders } from "react-icons/fi";
import { addCartItem, fetchCart, fetchCategories, fetchProducts, fetchStores } from "@/lib/api";
import { rupiah } from "@/lib/format";
import { readStaleCache, writeStaleCache } from "@/lib/stale-cache";
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
  refreshing: boolean;
};

const defaultState: CatalogState = {
  products: [],
  categories: ["Semua"],
  stores: [],
  serviceable: true,
  cartCount: 0,
  message: "",
  loading: true,
  refreshing: false
};

const CUSTOMER_CATALOG = "/catalog";
const CUSTOMER_ABOUT = "/about";

export function SnapHomePage() {
  const [state, setState] = useState<CatalogState>(() => {
    const cached = readStaleCache<CatalogState>("catalog:home:limit-8");
    return cached ? { ...cached, loading: false, refreshing: true } : defaultState;
  });
  const featured = state.products.slice(0, 8);

  useEffect(() => {
    const cacheKey = "catalog:home:limit-8";
    loadCatalog({ limit: "8" }).then((next) => {
      writeStaleCache(cacheKey, next, 1000 * 60 * 5);
      setState(next);
    });
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
              <Link className="primary-snap" href={CUSTOMER_CATALOG}>Mulai belanja <FiChevronRight /></Link>
              <Link className="secondary-snap" href={CUSTOMER_ABOUT}>Tentang kami</Link>
            </div>
          </div>
          <GroceryVisual variant="hero" />
        </section>
        <section className="snap-section">
          <div className="snap-section-title inline">
            <div>
              <span className="eyebrow">Produk pilihan</span>
              <h2>Stok segar di {state.store?.name ?? "cabang utama"}</h2>
              {state.refreshing && <small className="refreshing-copy">Memperbarui data...</small>}
            </div>
            <Link href={CUSTOMER_CATALOG}>Lihat catalog <FiChevronRight /></Link>
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState(defaultState);
  const [query, setQuery] = useState(initialSearch || searchParams.get("search") || "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch || searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "Semua");
  const [sort, setSort] = useState(searchParams.get("sort") || "featured");
  const [storeId, setStoreId] = useState(searchParams.get("storeId") || "");
  const [onlyStock, setOnlyStock] = useState(searchParams.get("inStock") !== "false");
  const [onlyPromo, setOnlyPromo] = useState(searchParams.get("promo") === "true");
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice") ?? 0));
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice") ?? 100000));
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 320);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const params: Record<string, string> = { limit: "48", sort };
    if (debouncedQuery.trim()) params.search = debouncedQuery.trim();
    if (category !== "Semua" && category !== "Semua Produk") params.category = category;
    if (storeId) params.storeId = storeId;
    if (onlyStock) params.inStock = "true";
    if (onlyPromo) params.promo = "true";
    if (minPrice > 0) params.minPrice = String(minPrice);
    if (maxPrice < 100000) params.maxPrice = String(maxPrice);
    router.replace(`${pathname}${catalogQueryString(params)}`, { scroll: false });
    const cacheKey = catalogCacheKey(params);
    const cached = readStaleCache<CatalogState>(cacheKey);
    if (cached) window.setTimeout(() => setState({ ...cached, loading: false, refreshing: true }), 0);
    loadCatalog(params).then((next) => {
      writeStaleCache(cacheKey, next, 1000 * 60 * 3);
      setState(next);
    });
  }, [category, debouncedQuery, maxPrice, minPrice, onlyPromo, onlyStock, pathname, router, sort, storeId]);

  const visibleProducts = useMemo(() => {
    return state.products.filter((product) => {
      const stock = state.store ? product.stockByStore[state.store.id] ?? 0 : 0;
      if (onlyStock && stock < 1) return false;
      if (onlyPromo && !product.discount) return false;
      if (product.price < minPrice) return false;
      if (product.price > maxPrice) return false;
      return true;
    });
  }, [maxPrice, minPrice, onlyPromo, onlyStock, state.products, state.store]);

  useEffect(() => {
    if (!filterOpen && !sortOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
        setSortOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [filterOpen, sortOpen]);

  function clearFilters() {
    setCategory("Semua");
    setOnlyPromo(false);
    setOnlyStock(false);
    setMinPrice(0);
    setMaxPrice(100000);
    setQuery("");
    setDebouncedQuery("");
  }

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
            <h1>Belanja kebutuhan harian</h1>
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
        <section className="catalog-mobile-controls" aria-label="Kontrol katalog mobile">
          <div className="mobile-category-chips">
            {["Semua Produk", ...state.categories.filter((item) => item !== "Semua")].slice(0, 8).map((item) => (
              <button className={item === category || (item === "Semua Produk" && category === "Semua") ? "active" : ""} key={item} onClick={() => setCategory(item === "Semua Produk" ? "Semua" : item)} type="button">{item.replace("Semua Produk", "Semua")}</button>
            ))}
            <button onClick={() => setFilterOpen(true)} type="button">Lihat Semua</button>
          </div>
          <div className="mobile-filter-actions">
            <button onClick={() => setFilterOpen(true)} type="button"><FiSliders /> Filter</button>
            <button onClick={() => setSortOpen(true)} type="button">Urutkan</button>
          </div>
        </section>
        <section className="catalog-layout">
          <aside className="filter-sidebar">
            <h3>Kategori</h3>
            {["Semua Produk", ...state.categories.filter((item) => item !== "Semua")].map((item) => (
              <button className={item === category || (item === "Semua Produk" && category === "Semua") ? "active" : ""} key={item} onClick={() => setCategory(item === "Semua Produk" ? "Semua" : item)} type="button">{item}</button>
            ))}
            <hr />
            <h3>Rentang Harga</h3>
            <div className="price-slider">
              <input
                aria-label="Harga maksimum"
                max="100000"
                min="0"
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                step="5000"
                type="range"
                value={maxPrice}
              />
              <div className="price-pills"><span>{rupiah(minPrice)}</span><span>{maxPrice >= 100000 ? "Rp 100.000+" : rupiah(maxPrice)}</span></div>
            </div>
            <label className="switch-row">Stok Tersedia <input checked={onlyStock} onChange={(event) => setOnlyStock(event.target.checked)} type="checkbox" /></label>
            <label className="switch-row">Produk Promo <input checked={onlyPromo} onChange={(event) => setOnlyPromo(event.target.checked)} type="checkbox" /></label>
            <div className="promo-panel">
              <strong>Promo aktif</strong>
              <p>Diskon mengikuti cabang terpilih</p>
              <Link href={CUSTOMER_CATALOG}>Belanja Sekarang</Link>
            </div>
          </aside>
          <div className="catalog-results">
            <div className="catalog-results-head">
              <div className="filter-chips">
                {[
                  ["Semua Produk", () => clearFilters(), category === "Semua" && !onlyPromo && !onlyStock],
                  ["Promo", () => setOnlyPromo((value) => !value), onlyPromo],
                  ["Stok Tersedia", () => setOnlyStock((value) => !value), onlyStock]
                ].map(([chip, action, active]) => <button className={active ? "active" : ""} key={String(chip)} onClick={action as () => void} type="button">{String(chip)}</button>)}
              </div>
              {state.refreshing && <span className="refreshing-copy">Memperbarui data...</span>}
              <button className="clear-filter" onClick={clearFilters} type="button"><FiSliders /> Hapus filter</button>
            </div>
            {state.loading ? <ProductGridSkeleton count={12} /> : (
              <>
                {state.message && <p className="catalog-message">{state.message}</p>}
                {!state.serviceable && <p className="catalog-message warning">Lokasi Anda di luar radius cabang terdekat. Silakan pilih alamat lain.</p>}
                {visibleProducts.length ? (
                  <div className="snap-product-grid">
                    {visibleProducts.map((product) => <ProductCard key={product.id} onAdd={addProduct} product={product} storeId={state.store?.id} />)}
                  </div>
                ) : (
                  <div className="catalog-empty-state">
                    <h2>Produk tidak ditemukan</h2>
                    <p>Coba ubah kategori, harga, lokasi, atau filter yang digunakan.</p>
                    <div>
                      <button onClick={clearFilters} type="button">Hapus Filter</button>
                      <button onClick={() => setFilterOpen(true)} type="button">Ganti Lokasi</button>
                      <Link href={CUSTOMER_CATALOG}>Lihat Semua Produk</Link>
                    </div>
                  </div>
                )}
              </>
            )}
            {visibleProducts.length > 0 && <div className="pagination-row">
              <span>Menampilkan {visibleProducts.length} produk</span>
              <div><button type="button">1</button><button type="button">2</button><button type="button">3</button></div>
              <select defaultValue="48"><option value="48">48 / halaman</option></select>
            </div>}
          </div>
        </section>
        {(filterOpen || sortOpen) && <button aria-label="Tutup filter" className="sheet-backdrop" onClick={() => { setFilterOpen(false); setSortOpen(false); }} type="button" />}
        {filterOpen && (
          <section aria-modal="true" className="mobile-bottom-sheet" role="dialog">
            <header><span /> <h2>Filter produk</h2><button aria-label="Tutup filter" onClick={() => setFilterOpen(false)} type="button">X</button></header>
            <div className="sheet-content">
              <label>
                <small>Cabang</small>
                <select value={storeId || state.store?.id || ""} onChange={(event) => setStoreId(event.target.value)}>
                  {state.stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
                </select>
              </label>
              <div className="sheet-chip-grid">
                {["Semua Produk", ...state.categories.filter((item) => item !== "Semua")].map((item) => (
                  <button className={item === category || (item === "Semua Produk" && category === "Semua") ? "active" : ""} key={item} onClick={() => setCategory(item === "Semua Produk" ? "Semua" : item)} type="button">{item}</button>
                ))}
              </div>
              <div className="sheet-price-grid">
                <label><small>Harga minimum</small><input min="0" onChange={(event) => setMinPrice(Number(event.target.value))} step="5000" type="number" value={minPrice} /></label>
                <label><small>Harga maksimum</small><input min={minPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} step="5000" type="number" value={maxPrice} /></label>
              </div>
              <label className="sheet-check"><span>Stok tersedia</span><input checked={onlyStock} onChange={(event) => setOnlyStock(event.target.checked)} type="checkbox" /></label>
              <label className="sheet-check"><span>Produk promo</span><input checked={onlyPromo} onChange={(event) => setOnlyPromo(event.target.checked)} type="checkbox" /></label>
            </div>
            <footer><button onClick={clearFilters} type="button">Reset</button><button onClick={() => setFilterOpen(false)} type="button">Terapkan</button></footer>
          </section>
        )}
        {sortOpen && (
          <section aria-modal="true" className="mobile-bottom-sheet compact" role="dialog">
            <header><span /> <h2>Urutkan</h2><button aria-label="Tutup urutan" onClick={() => setSortOpen(false)} type="button">X</button></header>
            <div className="sheet-chip-grid vertical">
              {[
                ["featured", "Terbaru"],
                ["price_asc", "Harga termurah"],
                ["price_desc", "Harga tertinggi"],
                ["stock", "Stok terbanyak"]
              ].map(([value, label]) => <button className={sort === value ? "active" : ""} key={value} onClick={() => { setSort(value); setSortOpen(false); }} type="button">{label}</button>)}
            </div>
          </section>
        )}
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
      loading: false,
      refreshing: false
    };
  } catch (error) {
    return { ...defaultState, loading: false, refreshing: false, message: error instanceof Error ? error.message : "Data belum dapat dimuat." };
  }
}

function catalogCacheKey(params: Record<string, string>): string {
  return `catalog:${Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}-${value}`).join(":")}`;
}

function catalogQueryString(params: Record<string, string>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key !== "limit" && value) query.set(key, value);
  }
  const text = query.toString();
  return text ? `?${text}` : "";
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
