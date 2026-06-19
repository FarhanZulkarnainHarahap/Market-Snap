"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiClock, FiHome, FiLock, FiMapPin, FiMinus, FiPlus, FiShield, FiShoppingBag, FiTrash2, FiTruck, FiZap } from "react-icons/fi";
import { clearCart, createOrderFromCart, deleteCartItem, fetchAddresses, fetchCart, fetchNearestStore, updateCartItem } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { Address, CartItem, Store } from "@/lib/types";
import { BenefitStrip, PanelSkeleton, SnapFooter, SnapHeader } from "./SnapCommon";

const xenditPaymentMethods = [
  { id: "va-bca", label: "BCA Virtual Account", detail: "Bayar dari m-BCA, ATM, atau internet banking" },
  { id: "va-mandiri", label: "Mandiri Virtual Account", detail: "Livin, ATM, dan transfer bank" },
  { id: "va-bni", label: "BNI Virtual Account", detail: "BNI Mobile, ATM, dan internet banking" },
  { id: "va-bri", label: "BRI Virtual Account", detail: "BRImo, ATM, dan transfer bank" },
  { id: "ewallet", label: "E-Wallet", detail: "OVO, DANA, LinkAja, dan ShopeePay" },
  { id: "qris", label: "QRIS", detail: "Scan QR dari aplikasi pembayaran favorit" },
  { id: "card", label: "Kartu Kredit / Debit", detail: "Visa, Mastercard, dan kartu debit online" },
  { id: "retail", label: "Gerai Retail", detail: "Alfamart dan Indomaret" },
  { id: "paylater", label: "PayLater", detail: "Cicilan dan bayar nanti lewat partner Xendit" }
];

export function SnapCartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<Store>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.subtotal ?? item.price * item.quantity), 0), [items]);
  const discount = subtotal >= 50000 ? Math.min(20000, Math.round(subtotal * 0.2)) : 0;
  const shipping = items.length ? 10000 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const loadCart = useCallback(async () => {
    try {
      const [cart, nearest] = await Promise.all([fetchCart(), fetchNearestStore().catch(() => null)]);
      setItems(cart.items);
      setStore(nearest?.store);
      setMessage(cart.items.length ? "" : "Keranjang masih kosong. Tambahkan produk dari katalog.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Silakan login untuk melihat keranjang.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadCart);
  }, [loadCart]);

  async function updateQuantity(item: CartItem, quantity: number) {
    if (!item.cartId) return;
    try {
      if (quantity < 1) {
        await deleteCartItem(item.cartId);
      } else {
        await updateCartItem(item.cartId, quantity);
      }
      await loadCart();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui cart.");
    }
  }

  return (
    <>
      <SnapHeader active="home" cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
      <main>
        <section className="snap-page-title">
          <h1>Keranjang Belanja</h1>
          <p>Review produk pilihanmu sebelum checkout. Belanja segar, cepat, dan aman.</p>
        </section>
        <section className="cart-layout">
          <div>
            <article className="cart-list">
              <header><span><FiShoppingBag /> Cabang aktif</span><h2>{store?.name ?? items[0]?.storeId ?? "Market Snap"}</h2><Link className="outline-action" href="/catalog">Ubah cabang</Link></header>
              {loading && <CartRowsSkeleton />}
              {!loading && message && <p className="catalog-message">{message}</p>}
              {!loading && items.map((item) => (
                <div className="cart-item-row" key={item.cartId ?? item.id}>
                  <img alt={item.name} src={item.image} />
                  <div><h3>{item.name}</h3><p>{item.unit}</p><strong>Stok: {item.stock ?? "-"}</strong><span>{store?.name ?? item.storeId}</span></div>
                  <div className="qty-stepper"><button onClick={() => updateQuantity(item, item.quantity - 1)} type="button"><FiMinus /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item, item.quantity + 1)} type="button"><FiPlus /></button></div>
                  <b>{rupiah(item.subtotal ?? item.price * item.quantity)}</b>
                  <button className="trash-button" onClick={() => updateQuantity(item, 0)} type="button"><FiTrash2 /></button>
                </div>
              ))}
            </article>
            <article className="voucher-box">
              <div><h3>Punya kode voucher?</h3><div><input defaultValue="SNAPWELCOME" placeholder="Masukkan kode voucher" /><button type="button">Terapkan</button></div></div>
              <div><p>Voucher tersedia untukmu</p><button type="button">SNAPWELCOME<br /><small>Diskon 20%</small></button><button type="button">SNAPSHIP<br /><small>Gratis Ongkir</small></button></div>
            </article>
          </div>
          <aside className="cart-side">
            {loading ? <article className="summary-panel"><PanelSkeleton rows={6} /></article> : <Summary discount={discount} shipping={shipping} subtotal={subtotal} total={total} />}
            <article className="nearest-card">
              <img alt="" src="/market-snap-favicon-transparent.png" />
              <h3>Cabang Terdekat</h3>
              <strong>{store?.name ?? "Market Snap Kemang"}</strong>
              <p>{store?.area ?? "Jakarta Selatan"}</p>
              <span>Radius layanan {store?.radiusKm ?? 0} km</span>
              <button type="button"><FiMapPin /> Lihat di Peta</button>
            </article>
            <article className="trust-card">
              <h3>Belanja Aman & Terpercaya</h3>
              {["100% Produk Segar", "Pembayaran Terlindungi", "Pengantaran Cepat", "Layanan 24/7"].map((item) => <p key={item}><FiShield /> {item}</p>)}
            </article>
          </aside>
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

function Summary({ subtotal, shipping, discount, total }: { subtotal: number; shipping: number; discount: number; total: number }) {
  return (
    <article className="summary-panel">
      <h2>Ringkasan Belanja</h2>
      <p><span>Subtotal</span><strong>{rupiah(subtotal)}</strong></p>
      <p><span>Estimasi Ongkir</span><strong>{rupiah(shipping)}</strong></p>
      <p className="green"><span>Diskon Voucher</span><strong>- {rupiah(discount)}</strong></p>
      <hr />
      <p className="total"><span>Total Pembayaran</span><strong>{rupiah(total)}</strong></p>
      <div className="eta-card"><FiClock /><span><strong>Estimasi Tiba Hari ini, 18:00 - 20:00</strong><small>Pengantaran cepat di area cabang aktif</small></span></div>
      <Link className="primary-snap wide" href="/checkout"><FiLock /> Checkout Sekarang</Link>
    </article>
  );
}

export function SnapCheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<Store>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState(xenditPaymentMethods[0].id);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.subtotal ?? item.price * item.quantity), 0), [items]);
  const shipping = items.length ? 10000 : 0;
  const discount = subtotal >= 50000 ? Math.min(20000, Math.round(subtotal * 0.2)) : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) ?? addresses.find((address) => address.isPrimary) ?? addresses[0],
    [addresses, selectedAddressId]
  );

  useEffect(() => {
    Promise.all([fetchCart(), fetchNearestStore().catch(() => null), fetchAddresses().catch(() => [])])
      .then(([cart, nearest, addressList]) => {
        setItems(cart.items);
        setStore(nearest?.store);
        setAddresses(addressList);
        setSelectedAddressId(addressList.find((address) => address.isPrimary)?.id ?? addressList[0]?.id ?? "");
        setMessage(cart.items.length ? "" : "Cart kosong. Checkout membutuhkan produk.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Silakan login untuk checkout."))
      .finally(() => setLoading(false));
  }, []);

  async function submitOrder() {
    if (!selectedAddress) {
      setMessage("Tambahkan alamat pengiriman dari profil sebelum membuat pesanan.");
      return;
    }

    try {
      const result = await createOrderFromCart(items, total, {
        courier: "standard",
        location: { lat: selectedAddress.lat, lng: selectedAddress.lng },
        paymentMethod: "xendit"
      });
      await clearCart().catch(() => undefined);
      setItems([]);
      setMessage(`Order ${result.data.id} berhasil dibuat. Mengarahkan ke pembayaran ${xenditPaymentMethods.find((method) => method.id === selectedPaymentId)?.label ?? "Xendit"}...`);
      if (result.payment?.invoiceUrl) {
        window.location.href = result.payment.invoiceUrl;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat order.");
    }
  }

  return (
    <>
      <SnapHeader active="home" cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
      <main>
        <section className="checkout-title-row">
          <div><h1>Checkout</h1><p>Lengkapi informasi di bawah untuk menyelesaikan pesanan Anda.</p></div>
          <div className="stepper"><span className="active">1</span><span>2</span><span>3</span><span>4</span></div>
        </section>
        {loading ? <CheckoutSkeleton /> : (
          <>
            {message && <p className="catalog-message">{message}</p>}
            <section className="checkout-page-grid">
              <div className="checkout-forms">
                <CheckoutBlock title="1. Alamat Pengiriman" action="Ubah Alamat">
                  {addresses.length ? (
                    <div className="address-picker">
                      {addresses.map((address) => (
                        <button className={address.id === selectedAddress?.id ? "address-card active" : "address-card"} key={address.id} onClick={() => setSelectedAddressId(address.id)} type="button">
                          <FiHome />
                          <div>
                            <strong>{address.label} {address.isPrimary && <span>Utama</span>}</strong>
                            <p>{address.detail}</p>
                            <small>{address.isPrimary ? "Alamat utama pelanggan" : "Alamat tersimpan"}</small>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="address-empty">
                      <FiHome />
                      <div>
                        <strong>Belum ada alamat tersimpan</strong>
                        <p>Tambahkan alamat dari halaman profil agar checkout memakai lokasi database.</p>
                      </div>
                    </div>
                  )}
                  <button className="dashed-add" type="button"><FiPlus /> Tambah alamat baru</button>
                </CheckoutBlock>
                <CheckoutBlock title="2. Jadwal Pengiriman">
                  <div className="date-row">{["Hari ini", "Besok", "Lusa", "Akhir Pekan"].map((date, index) => <button className={index === 0 ? "active" : ""} key={date} type="button">{date}</button>)}</div>
                  <select><option>08:00 - 10:00</option><option>18:00 - 20:00</option></select>
                </CheckoutBlock>
                <CheckoutBlock title="3. Cabang Terdekat" action="Ubah cabang">
                  <div className="branch-checkout"><img alt="" src="/market-snap-favicon-transparent.png" /><div><h3>{store?.name ?? "Market Snap"}</h3><p>{store?.area ?? "Jakarta Selatan"}</p><span>{store?.distanceKm?.toFixed(1) ?? "0"} km jarak dari lokasi Anda</span></div></div>
                </CheckoutBlock>
                <CheckoutBlock title="4. Opsi Pengiriman">
                  <div className="delivery-row"><button className="active" type="button"><FiTruck /> Pengiriman Standar<br /><strong>{rupiah(shipping)}</strong></button><button type="button"><FiZap /> Pengiriman Express<br /><strong>Rp 18.000</strong></button><button type="button"><FiHome /> Ambil di Cabang<br /><strong>GRATIS</strong></button></div>
                </CheckoutBlock>
                <CheckoutBlock title="5. Metode Pembayaran">
                  <div className="payment-row xendit-methods">
                    {xenditPaymentMethods.map((method) => (
                      <button className={method.id === selectedPaymentId ? "active" : ""} key={method.id} onClick={() => setSelectedPaymentId(method.id)} type="button">
                        <strong>{method.label}</strong>
                        <small>{method.detail}</small>
                      </button>
                    ))}
                  </div>
                  <div className="voucher-success"><strong>Voucher berhasil!</strong><span>Diskon {rupiah(discount)}</span></div>
                </CheckoutBlock>
              </div>
              <aside className="checkout-summary">
                <article className="summary-panel">
                  <h2>Ringkasan Pesanan <small>{items.length} item</small></h2>
                  {items.map((item) => <div className="mini-order" key={item.cartId ?? item.id}><img alt={item.name} src={item.image} /><span><strong>{item.name}</strong><small>{item.unit}</small><b>{rupiah(item.price)}</b></span><small>Qty: {item.quantity}</small></div>)}
                  <p><span>Subtotal</span><strong>{rupiah(subtotal)}</strong></p>
                  <p className="green"><span>Diskon Voucher</span><strong>- {rupiah(discount)}</strong></p>
                  <p><span>Biaya Pengiriman</span><strong>{rupiah(shipping)}</strong></p>
                  <hr />
                  <p className="total"><span>Total Pembayaran</span><strong>{rupiah(total)}</strong></p>
                  <button className="primary-snap wide" disabled={!items.length || !selectedAddress} onClick={submitOrder} type="button"><FiLock /> Buat pesanan</button>
                </article>
                <article className="invoice-card"><h2>Preview Invoice</h2><strong>MARKET SNAP</strong><p>Invoice dibuat setelah order tersimpan</p><hr /><p>Total <b>{rupiah(total)}</b></p></article>
              </aside>
            </section>
          </>
        )}
      </main>
      <SnapFooter />
      <BenefitStrip />
    </>
  );
}

function CheckoutBlock({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return <article className="checkout-block"><header><h2>{title}</h2>{action && <button type="button">{action}</button>}</header>{children}</article>;
}

function CartRowsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }, (_, index) => (
        <div className="cart-item-row skeleton-row" aria-hidden="true" key={index}>
          <span className="cart-image-skeleton skeleton-block" />
          <PanelSkeleton rows={3} />
          <span className="skeleton-button" />
          <span className="skeleton-line short" />
          <span className="skeleton-icon" />
        </div>
      ))}
    </>
  );
}

function CheckoutSkeleton() {
  return (
    <section className="checkout-page-grid checkout-skeleton" aria-hidden="true">
      <div className="checkout-forms">
        {Array.from({ length: 3 }, (_, index) => <article className="checkout-block" key={index}><PanelSkeleton rows={4} /></article>)}
      </div>
      <aside className="checkout-summary"><article className="summary-panel"><PanelSkeleton rows={7} /></article></aside>
    </section>
  );
}
