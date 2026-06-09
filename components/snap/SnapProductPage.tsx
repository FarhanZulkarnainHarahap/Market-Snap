"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiHeart, FiMapPin, FiMinus, FiPlus, FiShoppingCart, FiStar } from "react-icons/fi";
import { addCartItem, fetchCart, fetchProductDetail, fetchProducts } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { Product, Store } from "@/lib/types";
import { BenefitStrip, FeatureList, RelatedProducts, SnapFooter, SnapHeader } from "./SnapCommon";

export function SnapProductPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product>();
  const [store, setStore] = useState<Store>();
  const [related, setRelated] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("Memuat detail produk dari database...");

  useEffect(() => {
    const params = new URLSearchParams();
    fetchProductDetail(productId, params)
      .then(async (result) => {
        setProduct(result.product);
        setStore(result.store);
        setMessage("");
        const relatedResult = await fetchProducts(new URLSearchParams({ limit: "6", category: result.product.category, storeId: result.store.id })).catch(() => null);
        setRelated(relatedResult?.products.filter((item) => item.id !== result.product.id) ?? []);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Produk tidak ditemukan."));
    fetchCart().then((cart) => setCartCount(cart.summary.totalItems)).catch(() => setCartCount(0));
  }, [productId]);

  const stock = useMemo(() => product && store ? product.stockByStore[store.id] ?? 0 : 0, [product, store]);

  async function addProduct() {
    if (!product || !store) return;
    try {
      await addCartItem(product.id, store.id, quantity);
      const cart = await fetchCart();
      setCartCount(cart.summary.totalItems);
      setMessage(`${product.name} masuk ke keranjang.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Silakan login untuk menambahkan produk.");
    }
  }

  return (
    <>
      <SnapHeader active="home" cartCount={cartCount} />
      <main>
        <nav className="breadcrumb"><Link href="/">Beranda</Link><FiChevronRight /> <Link href="/catalog">{product?.category ?? "Produk"}</Link><FiChevronRight /> <span>{product?.name ?? "Detail"}</span></nav>
        {message && <p className="catalog-message">{message}</p>}
        {product && (
          <>
            <section className="product-detail-layout">
              <div>
                <div className="product-gallery-main">
                  <button type="button"><FiChevronLeft /></button>
                  <img alt={product.name} src={product.image} />
                  <button type="button"><FiChevronRight /></button>
                  <button className="favorite-button" type="button"><FiHeart /></button>
                </div>
                <div className="thumbnail-row">
                  {[product.image, "/tomato.png", "/bread.png", "/pineapple.png"].map((src, index) => <img alt="" className={index === 0 ? "active" : ""} key={src} src={src} />)}
                </div>
              </div>
              <article className="product-info-panel">
                <span className="tag-soft">{product.category}</span>
                <h1>{product.name}</h1>
                <div className="rating-line"><FiStar /> <strong>4.8</strong> (data ulasan dummy) <span>Stok database: {stock}</span></div>
                <p className="detail-price">{rupiah(product.price)} <small>/{product.unit}</small></p>
                <p className="muted">{product.description ?? "Produk segar dari database Market Snap."}</p>
                <FeatureList />
                <h3>Pilih berat</h3>
                <div className="option-row"><button className="active" type="button">{product.unit}</button><button type="button">Paket hemat</button><button type="button">Bundling</button></div>
                <h3>Jumlah</h3>
                <div className="qty-row">
                  <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button"><FiMinus /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((value) => Math.min(stock || value + 1, value + 1))} type="button"><FiPlus /></button>
                  <small>Stok: {stock}</small>
                </div>
                <div className="branch-card">
                  <strong>Tersedia di cabang</strong>
                  <h3>{store?.name ?? "Cabang utama"} <span>Cabang aktif</span></h3>
                  <p>{store?.area ?? "Jakarta Selatan"}</p>
                  <div><span><FiMapPin /> {store?.distanceKm?.toFixed(1) ?? "0"} km</span><span>{store?.radiusKm ?? 0} km radius layanan</span><span>{store?.eta}</span></div>
                </div>
                <div className="buy-actions">
                  <button className="secondary-snap" disabled={!stock} onClick={addProduct} type="button"><FiShoppingCart /> Tambah ke keranjang</button>
                  <Link className="primary-snap" href="/checkout">Beli sekarang</Link>
                </div>
              </article>
            </section>
            <section className="product-tabs">
              <div className="tab-head"><button className="active" type="button">Deskripsi</button><button type="button">Nutrisi</button><button type="button">Ulasan</button><button type="button">Pengiriman & Retur</button></div>
              <div className="tab-grid">
                <div><p>{product.description}</p><ul><li>Data produk berasal dari database</li><li>Stok mengikuti cabang aktif</li><li>Diskon mengikuti promo yang berlaku</li></ul></div>
                <div className="nutrition-card"><h3>Nutrisi (per 100 g)</h3><p>Energi <strong>52 kkal</strong></p><p>Karbohidrat <strong>13.8 g</strong></p><p>Serat <strong>2.4 g</strong></p><p>Vitamin C <strong>4.6 mg</strong></p></div>
                <div className="review-card"><h3>Ulasan Pelanggan</h3><strong>4.8 <small>/5</small></strong><p>Rating dummy untuk tampilan</p><button type="button">Lihat semua ulasan</button></div>
              </div>
            </section>
            <RelatedProducts products={related} store={store} />
          </>
        )}
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}
