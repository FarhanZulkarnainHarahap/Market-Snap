"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPreview } from "./AdminPreview";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ProductGrid } from "./ProductGrid";
import { PromoSection } from "./PromoSection";
import { StoreStrip } from "./StoreStrip";
import { categories as fallbackCategories, products as fallbackProducts } from "../lib/market-data";
import { addCartItem, fetchCart, fetchCategories, fetchProducts } from "../lib/api";
import { nearestStore, type UserPoint } from "../lib/location";
import type { CartItem, Product, Store } from "../lib/types";

const defaultCart: CartItem[] = [];

export function MarketHome() {
  const [point, setPoint] = useState<UserPoint>();
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartItem[]>(defaultCart);
  const [apiStore, setApiStore] = useState<Store>();
  const [apiProducts, setApiProducts] = useState<Product[]>(fallbackProducts);
  const [apiCategories, setApiCategories] = useState(fallbackCategories);
  const [apiServiceable, setApiServiceable] = useState(true);
  const [apiDistanceKm, setApiDistanceKm] = useState(0);
  const [cartNotice, setCartNotice] = useState("");
  const fallbackSelection = nearestStore(point);
  const selection = {
    store: apiStore ?? fallbackSelection.store,
    serviceable: apiStore ? apiServiceable : fallbackSelection.serviceable,
    distanceKm: apiStore ? apiDistanceKm : fallbackSelection.distanceKm
  };

  useEffect(() => {
    fetchCart().then((result) => setCart(result.items)).catch(() => setCart(defaultCart));
  }, []);

  useEffect(() => {
    fetchCategories().then(setApiCategories).catch(() => setApiCategories(fallbackCategories));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ limit: "50", sort });
    if (query) params.set("search", query);
    if (category !== "Semua") params.set("category", category);
    if (point) {
      params.set("lat", String(point.lat));
      params.set("lng", String(point.lng));
    }
    fetchProducts(params)
      .then((result) => {
        setApiProducts(result.products);
        setApiStore(result.store);
        setApiServiceable(result.serviceable);
        setApiDistanceKm(result.distanceKm);
      })
      .catch(() => {
        setApiProducts(fallbackProducts);
        setApiStore(undefined);
      });
  }, [category, point, query, sort]);

  const visibleProducts = useMemo(() => {
    const filtered = apiProducts
      .filter((item) => category === "Semua" || item.category === category)
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    return sortProducts(filtered, sort, selection.store.id);
  }, [apiProducts, category, query, sort, selection.store.id]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function requestLocation() {
    navigator.geolocation?.getCurrentPosition(
      (position) => setPoint({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setPoint({ lat: -6.2607, lng: 106.8106 })
    );
  }

  async function addToCart(product: Product) {
    setCartNotice("");
    try {
      const item = await addCartItem(product.id, selection.store.id);
      setCart((items) => mergeCart(items, item));
      setCartNotice(`${product.name} masuk ke cart.`);
    } catch (error) {
      setCartNotice(error instanceof Error ? error.message : "Gagal menambahkan produk.");
    }
  }

  return (
    <>
      <Header cartCount={cartCount} />
      <main>
        <Hero
          distanceKm={selection.distanceKm}
          onLocate={requestLocation}
          serviceable={selection.serviceable}
          store={selection.store}
        />
        <StoreStrip serviceable={selection.serviceable} store={selection.store} />
        <section className="content-section" id="products">
          <div className="section-heading">
            <span className="mini-label">Katalog cabang</span>
            <h2>Produk tersedia di {selection.store.name}</h2>
          </div>
          <div className="catalog-toolbar">
            <input
              aria-label="Cari produk"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari sayur, buah, susu..."
              value={query}
            />
            <select aria-label="Urutkan produk" onChange={(event) => setSort(event.target.value)} value={sort}>
              <option value="featured">Pilihan</option>
              <option value="price_asc">Harga termurah</option>
              <option value="price_desc">Harga tertinggi</option>
              <option value="stock">Stok terbanyak</option>
            </select>
          </div>
          <div className="category-tabs" role="tablist" aria-label="Kategori produk">
            {apiCategories.map((name) => (
              <button className={name === category ? "active" : ""} key={name} onClick={() => setCategory(name)}>
                {name}
              </button>
            ))}
          </div>
          {!selection.serviceable && (
            <p className="range-alert">Lokasi kamu di luar radius toko terdekat. Produk tetap tampil dari cabang utama, tetapi checkout meminta alamat lain.</p>
          )}
          {cartNotice && <p className="range-alert">{cartNotice}</p>}
          <ProductGrid onAdd={addToCart} products={visibleProducts} storeId={selection.store.id} />
        </section>
        <PromoSection />
        <AdminPreview />
      </main>
      <Footer />
    </>
  );
}

function mergeCart(items: CartItem[], item: CartItem) {
  const exists = items.some((cartItem) => cartItem.cartId === item.cartId);
  if (exists) return items.map((cartItem) => cartItem.cartId === item.cartId ? item : cartItem);
  return [...items, item];
}

function sortProducts(items: Product[], sort: string, storeId: string) {
  const copy = [...items];
  if (sort === "price_asc") return copy.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return copy.sort((a, b) => b.price - a.price);
  if (sort === "stock") return copy.sort((a, b) => b.stockByStore[storeId] - a.stockByStore[storeId]);
  return copy.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)));
}
