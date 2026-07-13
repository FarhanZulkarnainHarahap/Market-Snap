"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiClock, FiHome, FiLock, FiMinus, FiPlus, FiRefreshCcw, FiShoppingCart, FiTag, FiTrash2, FiTruck, FiZap } from "react-icons/fi";
import { clearCart, createOrderFromCart, deleteCartItem, fetchAddresses, fetchCart, fetchNearestStore, fetchVouchers, updateCartItem } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { Address, CartItem, Store, Voucher } from "@/lib/types";
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

type CartStatus = "loading" | "success" | "empty" | "error" | "auth" | "verification";
const CUSTOMER_HOME = "/dashboard/customer";
const CUSTOMER_CATALOG = "/dashboard/customer/catalog";
const CUSTOMER_CHECKOUT = "/dashboard/customer/checkout";

export function SnapCartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<Store>();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<CartStatus>("loading");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectedItems = useMemo(() => items.filter((item) => selectedIds.has(cartItemKey(item))), [items, selectedIds]);
  const subtotal = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [selectedItems]);
  const discount = selectedItems.length && subtotal >= 50000 ? Math.min(20000, Math.round(subtotal * 0.2)) : 0;
  const shipping = selectedItems.length ? 10000 : 0;
  const total = Math.max(0, subtotal + shipping - discount);
  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const isSuccess = status === "success";

  const loadCart = useCallback(async () => {
    setStatus((current) => current === "success" ? "success" : "loading");
    setMessage("");
    try {
      const [cart, nearest] = await Promise.all([
        fetchCart(),
        fetchNearestStore().catch(() => null)
      ]);
      setItems(cart.items);
      setStore(cart.store ?? nearest?.store);
      setSelectedIds(new Set(cart.items.map(cartItemKey)));
      if (!cart.items.length) {
        setVouchers([]);
        setStatus("empty");
        setMessage("Keranjang masih kosong. Tambahkan produk segar dari katalog.");
        return;
      }
      setStatus("success");
      setVouchers(await fetchVouchers().catch(() => []));
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setItems([]);
      setSelectedIds(new Set());
      setVouchers([]);
      if (code === "AUTH_REQUIRED") {
        setStatus("auth");
        setMessage("Login ke akun Market Snap untuk melihat keranjang belanja.");
        return;
      }
      if (code === "VERIFICATION_REQUIRED") {
        setStatus("verification");
        setMessage("Verifikasi email terlebih dahulu agar keranjang dan checkout bisa digunakan.");
        return;
      }
      setStatus("error");
      setMessage(code || "Gagal memuat cart. Coba muat ulang halaman.");
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadCart);
  }, [loadCart]);

  async function updateQuantity(item: CartItem, quantity: number) {
    if (!item.cartId) {
      setMessage("Item keranjang belum memiliki ID yang valid. Muat ulang keranjang lalu coba lagi.");
      return;
    }
    const normalizedQuantity = Math.min(Math.max(1, quantity), item.stock ?? quantity);
    const previousItems = items;
    setItems((current) => {
      if (quantity < 1) return current.filter((cartItem) => (cartItem.cartId ?? cartItem.id) !== (item.cartId ?? item.id));
      return current.map((cartItem) => {
        if ((cartItem.cartId ?? cartItem.id) !== (item.cartId ?? item.id)) return cartItem;
        return { ...cartItem, quantity: normalizedQuantity, subtotal: cartItem.price * normalizedQuantity };
      });
    });
    try {
      if (quantity < 1) {
        await deleteCartItem(item.cartId);
      } else {
        await updateCartItem(item.cartId, normalizedQuantity);
      }
      await loadCart();
    } catch (error) {
      setItems(previousItems);
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui cart.");
    }
  }

  function removeItem(item: CartItem) {
    const confirmed = window.confirm(`Hapus ${item.name} dari keranjang?`);
    if (confirmed) void updateQuantity(item, 0);
  }

  function toggleItem(item: CartItem) {
    const key = cartItemKey(item);
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(items.map(cartItemKey)));
  }

  return (
    <>
      <SnapHeader active="cart" cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="cart-page-shell">
        <section className="snap-page-title">
          <span className="cart-breadcrumb">Market Snap / Keranjang</span>
          <h1>Keranjang Belanja</h1>
          <p>Review produk pilihanmu sebelum checkout. Belanja segar, cepat, dan aman.</p>
        </section>
        <section className="cart-layout">
          <div>
            <article className="cart-list">
              {status === "loading" && <CartRowsSkeleton />}
              {status === "auth" && <CartState icon={<FiLock />} message={message} primaryHref="/auth/login" primaryLabel="Login" secondaryHref="/auth/register" secondaryLabel="Daftar" title="Login dulu untuk melihat cart" />}
              {status === "verification" && <CartState icon={<FiAlertCircle />} message={message} primaryHref="/auth/login" primaryLabel="Buka akun saya" secondaryHref={CUSTOMER_CATALOG} secondaryLabel="Kembali belanja" title="Email belum diverifikasi" />}
              {status === "error" && <CartState action={loadCart} icon={<FiRefreshCcw />} message={message} primaryLabel="Muat ulang cart" secondaryHref={CUSTOMER_CATALOG} secondaryLabel="Lihat katalog" title="Cart belum bisa dimuat" />}
              {status === "empty" && <CartState icon={<FiShoppingCart />} image="/market-snap-catalog-v2.png" message={message} primaryHref={CUSTOMER_CATALOG} primaryLabel="Mulai belanja" secondaryHref={CUSTOMER_HOME} secondaryLabel="Ke beranda" title="Keranjang masih kosong" />}
              {isSuccess && (
                <>
                  <div className="cart-store-card">
                    <div><FiCheckCircle /><span><strong>{store?.name ?? "Market Snap Center"}</strong><small>{store?.area ?? "Cabang aktif"} - estimasi {store?.eta ?? "20-30 min"}</small></span></div>
                    <button onClick={loadCart} type="button"><FiRefreshCcw /> Sinkronkan</button>
                  </div>
                  <div className="cart-select-row">
                    <label><input checked={allSelected} onChange={toggleAll} type="checkbox" /> Pilih semua produk</label>
                    <span>{selectedItems.length} dari {items.length} item dipilih</span>
                  </div>
                  {items.map((item) => {
                    const checked = selectedIds.has(cartItemKey(item));
                    const stock = item.stock ?? 0;
                    return (
                      <div className={checked ? "cart-item-row selected" : "cart-item-row"} key={cartItemKey(item)}>
                        <label className="cart-item-check" aria-label={`Pilih ${item.name}`}>
                          <input checked={checked} onChange={() => toggleItem(item)} type="checkbox" />
                        </label>
                        <Image alt={item.name} height={82} src={item.image} width={82} />
                        <div className="cart-item-meta">
                          <h3>{item.name}</h3>
                          <p>{item.category} - {item.unit}</p>
                          <strong className={stock < 1 ? "is-danger" : ""}>{stock < 1 ? "Stok habis" : `Stok: ${stock}`}</strong>
                          <span>{store?.name ?? item.storeId ?? "Market Snap"}</span>
                        </div>
                        <div className="cart-item-actions">
                          <div className="qty-stepper">
                            <button aria-label={`Kurangi ${item.name}`} disabled={item.quantity <= 1} onClick={() => updateQuantity(item, item.quantity - 1)} type="button"><FiMinus /></button>
                            <span>{item.quantity}</span>
                            <button aria-label={`Tambah ${item.name}`} disabled={stock > 0 && item.quantity >= stock} onClick={() => updateQuantity(item, item.quantity + 1)} type="button"><FiPlus /></button>
                          </div>
                          <b>{rupiah(item.price * item.quantity)}</b>
                          <button aria-label={`Hapus ${item.name}`} className="trash-button" onClick={() => removeItem(item)} type="button"><FiTrash2 /></button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </article>
            {isSuccess && (
              <article className="voucher-box">
                <div>
                  <h3><FiTag /> Punya kode voucher?</h3>
                  <div className="voucher-apply-row">
                    <input onChange={(event) => setVoucherCode(event.target.value)} placeholder="Masukkan kode voucher" value={voucherCode} />
                    <button disabled={!selectedItems.length} type="button">Terapkan</button>
                  </div>
                </div>
                <div>
                  <p>Voucher tersedia untukmu</p>
                  <select
                    aria-label="Pilih voucher tersedia"
                    disabled={!selectedItems.length}
                    onChange={(event) => setVoucherCode(event.target.value)}
                    value={vouchers.some((voucher) => voucher.code === voucherCode) ? voucherCode : ""}
                  >
                    <option value="">Pilih voucher tersedia</option>
                    {vouchers.map((voucher) => (
                      <option key={voucher.id} value={voucher.code}>
                        {voucher.code} - {voucher.title}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            )}
          </div>
          {isSuccess && (
            <aside className="cart-side">
              <Summary disabled={!selectedItems.length} discount={discount} itemCount={selectedItems.length} shipping={shipping} store={store} subtotal={subtotal} total={total} />
            </aside>
          )}
        </section>
      </main>
      <BenefitStrip />
      <SnapFooter />
    </>
  );
}

function CartState({ action, icon, image, message, primaryHref, primaryLabel, secondaryHref, secondaryLabel, title }: { action?: () => void; icon: React.ReactNode; image?: string; message: string; primaryHref?: string; primaryLabel: string; secondaryHref?: string; secondaryLabel: string; title: string }) {
  const primary = action ? <button onClick={action} type="button">{primaryLabel}</button> : <Link href={primaryHref ?? CUSTOMER_CATALOG}>{primaryLabel}</Link>;
  return (
    <div className="cart-state-card">
      {image ? <Image alt="" height={150} src={image} width={210} /> : <i>{icon}</i>}
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="cart-state-actions">
          {primary}
          {secondaryHref && <Link className="secondary" href={secondaryHref}>{secondaryLabel}</Link>}
        </div>
      </div>
    </div>
  );
}

function Summary({ disabled, discount, itemCount, shipping, store, subtotal, total }: { disabled: boolean; discount: number; itemCount: number; shipping: number; store?: Store; subtotal: number; total: number }) {
  return (
    <article className="summary-panel">
      <h2>Ringkasan Belanja</h2>
      <p><span>Item dipilih</span><strong>{itemCount}</strong></p>
      <p><span>Subtotal</span><strong>{rupiah(subtotal)}</strong></p>
      <p><span>Estimasi Ongkir</span><strong>{rupiah(shipping)}</strong></p>
      <p className="green"><span>Diskon Voucher</span><strong>- {rupiah(discount)}</strong></p>
      <hr />
      <p className="total"><span>Total Pembayaran</span><strong>{rupiah(total)}</strong></p>
      <div className="eta-card"><FiClock /><span><strong>{store ? `Estimasi tiba ${store.eta}` : "Pilih alamat saat checkout"}</strong><small>{store?.name ?? "Cabang akan ditentukan dari lokasi pengiriman"}</small></span></div>
      {disabled && <p className="summary-warning">Pilih minimal satu produk untuk melanjutkan checkout.</p>}
      <Link aria-disabled={disabled} className={disabled ? "primary-snap wide disabled" : "primary-snap wide"} href={disabled ? "#" : CUSTOMER_CHECKOUT}><FiLock /> Checkout Sekarang</Link>
    </article>
  );
}

function cartItemKey(item: CartItem) {
  return item.cartId ?? item.id;
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
      <SnapHeader active="cart" cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
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
                  <div className="branch-checkout"><Image alt="" height={48} src="/market-snap-favicon-transparent.png" width={48} /><div><h3>{store?.name ?? "Market Snap"}</h3><p>{store?.area ?? "Jakarta Selatan"}</p><span>{store?.distanceKm?.toFixed(1) ?? "0"} km jarak dari lokasi Anda</span></div></div>
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
                  {items.map((item) => <div className="mini-order" key={item.cartId ?? item.id}><Image alt={item.name} height={52} src={item.image} width={52} /><span><strong>{item.name}</strong><small>{item.unit}</small><b>{rupiah(item.price)}</b></span><small>Qty: {item.quantity}</small></div>)}
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
