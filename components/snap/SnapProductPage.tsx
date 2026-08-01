"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMapPin, FiMinus, FiPlus, FiShoppingCart, FiStar } from "react-icons/fi";
import { addCartItem, fetchCart, fetchProductDetail, fetchProducts } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { Product, Store } from "@/lib/types";
import { BenefitStrip, FeatureList, PanelSkeleton, RelatedProducts, SnapFooter, SnapHeader } from "./SnapCommon";

const CUSTOMER_CATALOG = "/catalog";
const CUSTOMER_CHECKOUT = "/checkout";
const CHECKOUT_STATE_KEY = "market-snap-checkout-selection";
const purchaseOptions = [
  { id: "unit", label: "Satuan", quantity: 1 },
  { id: "saving", label: "Paket hemat", quantity: 3 },
  { id: "bundle", label: "Bundling", quantity: 5 }
] as const;
const productTabs = [
  { id: "description", label: "Deskripsi" },
  { id: "nutrition", label: "Nutrisi" },
  { id: "reviews", label: "Ulasan" },
  { id: "shipping", label: "Pengiriman & Retur" }
] as const;

type PurchaseOptionId = typeof purchaseOptions[number]["id"];
type ProductTabId = typeof productTabs[number]["id"];

export function SnapProductPage({ productId }: { productId: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>();
  const [store, setStore] = useState<Store>();
  const [related, setRelated] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<PurchaseOptionId>("unit");
  const [activeTab, setActiveTab] = useState<ProductTabId>("description");
  const [busyAction, setBusyAction] = useState<"" | "cart" | "buy">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    fetchProductDetail(productId, params)
      .then(async (result) => {
        setProduct(result.product);
        setStore(result.store);
        setSelectedImage(0);
        setSelectedOption("unit");
        setActiveTab("description");
        setQuantity(1);
        setMessage("");
        setLoading(false);
        const relatedResult = await fetchProducts(new URLSearchParams({ limit: "6", category: result.product.category, storeId: result.store.id })).catch(() => null);
        setRelated(relatedResult?.products.filter((item) => item.id !== result.product.id) ?? []);
      })
      .catch((error) => {
        setLoading(false);
        setMessage(error instanceof Error ? error.message : "Produk tidak ditemukan.");
      });
    fetchCart().then((cart) => setCartCount(cart.summary.totalItems)).catch(() => setCartCount(0));
  }, [productId]);

  const stock = useMemo(() => product && store ? product.stockByStore[store.id] ?? 0 : 0, [product, store]);
  const gallery = product?.images.length ? product.images : product ? [{ alt: product.name, id: product.id, position: 0, url: product.image }] : [];
  const activeImage = gallery[selectedImage] ?? gallery[0];
  const maxQuantity = Math.max(1, stock);
  const selectedPurchase = purchaseOptions.find((option) => option.id === selectedOption) ?? purchaseOptions[0];

  function choosePurchaseOption(optionId: PurchaseOptionId) {
    const option = purchaseOptions.find((item) => item.id === optionId) ?? purchaseOptions[0];
    const nextQuantity = Math.min(option.quantity, maxQuantity);
    setSelectedOption(option.id);
    setQuantity(nextQuantity);
    if (stock > 0 && option.quantity > stock) {
      setMessage(`Stok cabang hanya tersedia ${stock} ${product?.unit ?? "item"}.`);
    } else {
      setMessage("");
    }
  }

  function openTab(tab: ProductTabId) {
    setActiveTab(tab);
    requestAnimationFrame(() => document.getElementById("product-detail-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function addProduct(mode: "cart" | "buy" = "cart") {
    if (!product || !store) return;
    setBusyAction(mode);
    try {
      const item = await addCartItem(product.id, store.id, quantity);
      const cart = await fetchCart();
      setCartCount(cart.summary.totalItems);
      if (mode === "buy") {
        const selectedCartItemId = item.cartId ?? item.id;
        window.sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify({ selectedCartItemIds: [selectedCartItemId] }));
        router.push(CUSTOMER_CHECKOUT);
        return;
      }
      setMessage(`${quantity} ${product.unit} ${product.name} masuk ke keranjang.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Silakan login untuk menambahkan produk.");
    } finally {
      setBusyAction("");
    }
  }

  return (
    <>
      <SnapHeader active="catalog" cartCount={cartCount} />
      <main>
        <nav className="breadcrumb product-breadcrumb">
          <Link className="breadcrumb-back" href={CUSTOMER_CATALOG}><FiChevronLeft /> Kembali</Link>
          <Link href={CUSTOMER_CATALOG}>{product?.category ?? "Produk"}</Link>
          <FiChevronRight />
          <span>{product?.name ?? "Detail"}</span>
        </nav>
        {loading && <ProductDetailSkeleton />}
        {!loading && message && <p className="catalog-message">{message}</p>}
        {!loading && product && (
          <>
            <section className="product-detail-layout">
              <div>
                <div className="product-gallery-main">
                  <button aria-label="Gambar sebelumnya" disabled={gallery.length < 2} onClick={() => setSelectedImage((index) => (index <= 0 ? gallery.length - 1 : index - 1))} type="button"><FiChevronLeft /></button>
                  <Image alt={activeImage?.alt ?? product.name} height={420} priority src={activeImage?.url ?? product.image} width={520} />
                  <button aria-label="Gambar berikutnya" disabled={gallery.length < 2} onClick={() => setSelectedImage((index) => (index + 1) % gallery.length)} type="button"><FiChevronRight /></button>
                </div>
                <div className="thumbnail-row">
                  {gallery.map((image, index) => (
                    <button aria-label={`Lihat gambar ${index + 1}`} key={image.id} onClick={() => setSelectedImage(index)} type="button">
                      <Image alt={image.alt} className={index === selectedImage ? "active" : ""} height={84} src={image.url} width={84} />
                    </button>
                  ))}
                </div>
              </div>
              <article className="product-info-panel">
                <span className="tag-soft">{product.category}{product.brand ? ` / ${product.brand}` : ""}</span>
                <h1>{product.name}</h1>
                <div className="rating-line"><FiStar /> <strong>Ulasan</strong> belum tersedia <span>Stok tersedia: {stock}</span>{product.sku && <span>SKU: {product.sku}</span>}</div>
                <p className="detail-price">{rupiah(product.price)} <small>/{product.unit}</small></p>
                <p className="muted">{product.shortInfo ?? product.description ?? "Produk segar Market Snap."}</p>
                <FeatureList />
                <div className="product-spec-grid">
                  <span><small>Berat</small><strong>{product.weightGram ? `${product.weightGram * quantity} g` : `${quantity} ${product.unit}`}</strong></span>
                  <span><small>Penyimpanan</small><strong>{product.storageInfo ?? "Ikuti instruksi pada kemasan"}</strong></span>
                </div>
                <h3>Pilih berat</h3>
                <div className="option-row">
                  {purchaseOptions.map((option) => (
                    <button aria-pressed={selectedOption === option.id} className={selectedOption === option.id ? "active" : ""} disabled={!stock} key={option.id} onClick={() => choosePurchaseOption(option.id)} type="button">
                      {option.id === "unit" ? product.unit : option.label}
                    </button>
                  ))}
                </div>
                <p className="muted option-note">{selectedPurchase.quantity > 1 ? `${selectedPurchase.label} mengatur jumlah ke ${Math.min(selectedPurchase.quantity, maxQuantity)} ${product.unit}.` : `Pembelian satuan per ${product.unit}.`}</p>
                <h3>Jumlah</h3>
                <div className="qty-row">
                  <button disabled={!stock || quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button"><FiMinus /></button>
                  <span>{quantity}</span>
                  <button disabled={!stock || quantity >= maxQuantity} onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))} type="button"><FiPlus /></button>
                  <small>Stok: {stock}</small>
                </div>
                <div className="branch-card">
                  <strong>Tersedia di cabang</strong>
                  <h3>{store?.name ?? "Cabang utama"} <span>Cabang aktif</span></h3>
                  <p>{store?.area ?? "Jakarta Selatan"}</p>
                  <div><span><FiMapPin /> {store?.distanceKm?.toFixed(1) ?? "0"} km</span><span>{store?.radiusKm ?? 0} km radius layanan</span><span>{store?.eta}</span></div>
                </div>
                <div className="buy-actions">
                  <button className="secondary-snap" disabled={!stock || Boolean(busyAction)} onClick={() => addProduct("cart")} type="button"><FiShoppingCart /> {busyAction === "cart" ? "Menambahkan..." : "Tambah ke keranjang"}</button>
                  <button className="primary-snap" disabled={!stock || Boolean(busyAction)} onClick={() => addProduct("buy")} type="button">{busyAction === "buy" ? "Memproses..." : "Beli sekarang"}</button>
                </div>
              </article>
            </section>
            <section className="product-tabs" id="product-detail-tabs">
              <div className="tab-head">
                {productTabs.map((tab) => (
                  <button aria-pressed={activeTab === tab.id} className={activeTab === tab.id ? "active" : ""} key={tab.id} onClick={() => openTab(tab.id)} type="button">
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="tab-grid">
                {activeTab === "description" && (
                  <>
                    <div><p>{product.description}</p><ul><li>SKU: {product.sku ?? "Mengikuti data produk"}</li><li>Brand: {product.brand ?? "Market Snap"}</li><li>{product.storageInfo ?? "Produk mengikuti instruksi penyimpanan pada kemasan"}</li><li>Stok mengikuti cabang aktif</li><li>Diskon mengikuti promo yang berlaku</li></ul></div>
                    <div className="nutrition-card"><h3>Detail Pembelian</h3><p>Opsi <strong>{selectedOption === "unit" ? product.unit : selectedPurchase.label}</strong></p><p>Jumlah <strong>{quantity} {product.unit}</strong></p><p>Total <strong>{rupiah(product.price * quantity)}</strong></p></div>
                    <div className="review-card"><h3>Ulasan Pelanggan</h3><strong>Belum tersedia</strong><p>Data ulasan belum tersedia dari API.</p><button onClick={() => openTab("reviews")} type="button">Lihat semua ulasan</button></div>
                  </>
                )}
                {activeTab === "nutrition" && <div className="tab-empty-state"><h3>Nutrisi</h3><p>Data nutrisi resmi untuk {product.name} belum tersedia dari API produk.</p></div>}
                {activeTab === "reviews" && <div className="tab-empty-state"><h3>Ulasan Pelanggan</h3><p>Belum ada ulasan pelanggan untuk {product.name}. Panel ini siap menampilkan data ketika endpoint ulasan tersedia.</p></div>}
                {activeTab === "shipping" && <div className="tab-empty-state"><h3>Pengiriman & Retur</h3><p>Produk dikirim dari {store?.name ?? "cabang aktif"} dengan estimasi {store?.eta ?? "20-30 min"}. Pengembalian mengikuti kebijakan Market Snap untuk produk rusak atau tidak sesuai.</p></div>}
              </div>
            </section>
            <RelatedProducts products={related} store={store} />
            <div className="product-sticky-buy">
              <span><small>Total</small><strong>{rupiah(product.price * quantity)}</strong></span>
              <button disabled={!stock || Boolean(busyAction)} onClick={() => addProduct("cart")} type="button"><FiShoppingCart /> {busyAction ? "Proses..." : "Keranjang"}</button>
            </div>
          </>
        )}
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

function ProductDetailSkeleton() {
  return (
    <section className="product-detail-layout" aria-hidden="true">
      <div>
        <div className="product-gallery-main skeleton-block" />
        <div className="thumbnail-row">
          {Array.from({ length: 4 }, (_, index) => <span className="thumbnail-skeleton skeleton-block" key={index} />)}
        </div>
      </div>
      <article className="product-info-panel">
        <span className="skeleton-line short" />
        <span className="skeleton-line title" />
        <span className="skeleton-line medium" />
        <span className="skeleton-line price" />
        <PanelSkeleton rows={5} />
      </article>
    </section>
  );
}
