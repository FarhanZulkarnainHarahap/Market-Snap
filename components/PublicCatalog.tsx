"use client";

import { useEffect, useMemo, useState } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProductGrid } from "./ProductGrid";
import { addCartItem, fetchCart, fetchCategories, fetchProducts } from "../lib/api";
import type { CartItem, Product, Store } from "../lib/types";

type PublicCatalogProps = {
  initialSearch?: string;
};

export function PublicCatalog({ initialSearch = "" }: PublicCatalogProps) {
  const [query, setQuery] = useState(initialSearch);
  const [category, setCategory] = useState("Semua");
  const [categories, setCategories] = useState(["Semua"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [store, setStore] = useState<Store>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories(["Semua"]));
    fetchCart().then((result) => setCart(result.items)).catch(() => setCart([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ limit: "50", sort: "featured" });
    if (query) params.set("search", query);
    if (category !== "Semua") params.set("category", category);
    fetchProducts(params).then((result) => {
      setProducts(result.products);
      setStore(result.store);
    }).catch(() => {
      setProducts([]);
      setMessage("Produk belum dapat dimuat. Silakan coba kembali beberapa saat lagi.");
    });
  }, [category, query]);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const inCategory = category === "Semua" || product.category === category;
    return inCategory && product.name.toLowerCase().includes(query.toLowerCase());
  }), [category, products, query]);

  async function addToCart(product: Product) {
    try {
      const item = await addCartItem(product.id, store?.id ?? "jakarta-selatan");
      setCart((items) => mergeCart(items, item));
      setMessage(`${product.name} masuk ke cart.`);
    } catch {
      setMessage("Silakan login sebagai customer untuk menambahkan produk.");
    }
  }

  return (
    <>
      <Header active="catalog" cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <main>
        <section className="public-page-heading">
          <span className="mini-label">Fresh catalog</span>
          <h1>Belanja grocery dari cabang terdekat</h1>
          <p>Cari produk segar, cek stok, lalu masuk sebagai customer untuk menambahkan produk ke keranjang.</p>
        </section>
        <section className="content-section public-catalog">
          <div className="catalog-toolbar">
            <input aria-label="Cari produk" onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk..." value={query} />
            <select aria-label="Kategori" onChange={(event) => setCategory(event.target.value)} value={category}>
              {categories.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
          {message && <p className="range-alert">{message}</p>}
          <ProductGrid onAdd={addToCart} products={visibleProducts} storeId={store?.id ?? "jakarta-selatan"} />
        </section>
      </main>
      <Footer />
    </>
  );
}

function mergeCart(items: CartItem[], item: CartItem) {
  return items.some((cartItem) => cartItem.cartId === item.cartId)
    ? items.map((cartItem) => cartItem.cartId === item.cartId ? item : cartItem)
    : [...items, item];
}
