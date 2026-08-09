"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheck, FiCheckCircle, FiClock, FiEdit2, FiHome, FiLock, FiMinus, FiPlus, FiRefreshCcw, FiShoppingCart, FiTag, FiTrash2, FiTruck, FiX, FiZap } from "react-icons/fi";
import { toast as sonnerToast } from "sonner";
import { createAddress, createOrderFromCart, deleteAddress, deleteCartItem, deleteSelectedCartItems, fetchAddresses, fetchCart, fetchCheckoutOptions, fetchNearestStore, fetchStores, fetchVouchers, updateAddress, updateCartItem, validateCartVoucher } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { Address, CartItem, CheckoutOption, Store, Voucher } from "@/lib/types";
import { useCheckoutDraftStore } from "@/stores/checkout-store";
import { BenefitStrip, PanelSkeleton, SnapFooter, SnapHeader } from "./SnapCommon";

const deliveryDates = [
  { id: "today", label: "Hari ini" },
  { id: "tomorrow", label: "Besok" },
  { id: "after-tomorrow", label: "Lusa" },
  { id: "weekend", label: "Akhir Pekan" }
];

const deliveryTimes = ["08:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00", "18:00 - 20:00"];

const fallbackDeliveryOptions = [
  { id: "standard", label: "Pengiriman Standar", cost: 10000, description: "Estimasi reguler dari cabang terdekat.", eta: "2-4 jam", icon: FiTruck, requiresAddress: true },
  { id: "express", label: "Pengiriman Express", cost: 18000, description: "Prioritas lebih cepat bila tersedia.", eta: "60-120 menit", icon: FiZap, requiresAddress: true },
  { id: "pickup", label: "Ambil di Cabang", cost: 0, description: "Ambil pesanan langsung di cabang.", eta: "Sesuai jadwal ambil", icon: FiHome, requiresAddress: false }
];

type CartStatus = "loading" | "success" | "empty" | "error" | "auth" | "verification";
type CheckoutAddressForm = {
  city: string;
  detail: string;
  district: string;
  isPrimary: boolean;
  label: string;
  lat: string;
  lng: string;
  note: string;
  phone: string;
  postalCode: string;
  province: string;
  recipientName: string;
};
const CUSTOMER_HOME = "/";
const CUSTOMER_CATALOG = "/catalog";
const CUSTOMER_CHECKOUT = "/checkout";
const CHECKOUT_STATE_KEY = "market-snap-checkout-selection";

export function SnapCartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<Store>();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [status, setStatus] = useState<CartStatus>("loading");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [busyAction, setBusyAction] = useState("");
  const selectedItems = useMemo(() => items.filter((item) => selectedIds.has(cartItemKey(item))), [items, selectedIds]);
  const vouchersQuery = useQuery({ queryKey: ["cart", "vouchers"], queryFn: fetchVouchers, enabled: status === "success" });
  const availableVouchers = vouchersQuery.data ?? vouchers;
  const subtotal = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [selectedItems]);
  const discount = Math.min(voucherDiscount, subtotal);
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
      setVoucherDiscount(0);
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
      setBusyAction(item.cartId ?? item.id);
      if (quantity < 1) {
        await deleteCartItem(item.cartId);
      } else {
        await updateCartItem(item.cartId, normalizedQuantity);
      }
      await loadCart();
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      setToast(quantity < 1 ? "Produk berhasil dihapus." : "Jumlah produk diperbarui.");
      sonnerToast.success(quantity < 1 ? "Produk berhasil dihapus." : "Jumlah produk diperbarui.");
    } catch (error) {
      setItems(previousItems);
      setMessage(error instanceof Error ? error.message : "Gagal memperbarui cart.");
      sonnerToast.error(error instanceof Error ? error.message : "Gagal memperbarui cart.");
    } finally {
      setBusyAction("");
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

  async function removeSelected() {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    if (!window.confirm(`Hapus ${ids.length} produk terpilih dari keranjang?`)) return;
    setBusyAction("delete-selected");
    try {
      await deleteSelectedCartItems(ids);
      setToast("Produk terpilih berhasil dihapus.");
      sonnerToast.success("Produk terpilih berhasil dihapus.");
      await loadCart();
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menghapus produk terpilih.");
      sonnerToast.error(error instanceof Error ? error.message : "Gagal menghapus produk terpilih.");
    } finally {
      setBusyAction("");
    }
  }

  async function applyVoucher() {
    const code = voucherCode.trim();
    if (!code) {
      setMessage("Masukkan kode voucher terlebih dahulu.");
      return;
    }
    setBusyAction("voucher");
    try {
      const result = await validateCartVoucher(code, Array.from(selectedIds));
      setVoucherCode(result.voucher.code);
      setVoucherDiscount(result.discount);
      setToast(result.message);
      sonnerToast.success(result.message);
      setMessage("");
    } catch (error) {
      setVoucherDiscount(0);
      setMessage(error instanceof Error ? error.message : "Voucher tidak dapat digunakan.");
      sonnerToast.error(error instanceof Error ? error.message : "Voucher tidak dapat digunakan.");
    } finally {
      setBusyAction("");
    }
  }

  function goToCheckout() {
    if (!selectedItems.length) return;
    window.sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify({ selectedCartItemIds: Array.from(selectedIds), voucherCode: voucherCode.trim() || undefined }));
    router.push(CUSTOMER_CHECKOUT);
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
                  {toast && <p className="toast-message" role="status">{toast}</p>}
                  <div className="cart-store-card">
                    <div><FiCheckCircle /><span><strong>{store?.name ?? "Market Snap Center"}</strong><small>{store?.area ?? "Cabang aktif"} - estimasi {store?.eta ?? "20-30 min"}</small></span></div>
                    <button onClick={loadCart} type="button"><FiRefreshCcw /> Sinkronkan</button>
                  </div>
                  <div className="cart-select-row">
                    <label><input checked={allSelected} onChange={toggleAll} type="checkbox" /> Pilih semua produk</label>
                    <span>{selectedItems.length} dari {items.length} item dipilih</span>
                    <button disabled={!selectedItems.length || busyAction === "delete-selected"} onClick={removeSelected} type="button"><FiTrash2 /> Hapus dipilih</button>
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
                            <button aria-label={`Kurangi ${item.name}`} disabled={item.quantity <= 1 || busyAction === (item.cartId ?? item.id)} onClick={() => updateQuantity(item, item.quantity - 1)} type="button"><FiMinus /></button>
                            <input aria-label={`Jumlah ${item.name}`} max={stock || undefined} min={1} onBlur={(event) => updateQuantity(item, Number(event.target.value))} onChange={(event) => {
                              const value = Math.min(Math.max(1, Number(event.target.value) || 1), stock || Number(event.target.value) || 1);
                              setItems((current) => current.map((cartItem) => cartItemKey(cartItem) === cartItemKey(item) ? { ...cartItem, quantity: value, subtotal: value * cartItem.price } : cartItem));
                            }} type="number" value={item.quantity} />
                            <button aria-label={`Tambah ${item.name}`} disabled={(stock > 0 && item.quantity >= stock) || busyAction === (item.cartId ?? item.id)} onClick={() => updateQuantity(item, item.quantity + 1)} type="button"><FiPlus /></button>
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
                    <input onChange={(event) => { setVoucherCode(event.target.value); setVoucherDiscount(0); }} placeholder="Masukkan kode voucher" value={voucherCode} />
                    <button disabled={!selectedItems.length || busyAction === "voucher"} onClick={applyVoucher} type="button">Terapkan</button>
                  </div>
                </div>
                <div>
                  <p>Voucher tersedia untukmu</p>
                  <select
                    aria-label="Pilih voucher tersedia"
                    disabled={!selectedItems.length}
                    onChange={(event) => setVoucherCode(event.target.value)}
                    value={availableVouchers.some((voucher) => voucher.code === voucherCode) ? voucherCode : ""}
                  >
                    <option value="">Pilih voucher tersedia</option>
                    {availableVouchers.map((voucher) => (
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
              <Summary disabled={!selectedItems.length} discount={discount} itemCount={selectedItems.length} onCheckout={goToCheckout} shipping={shipping} store={store} subtotal={subtotal} total={total} />
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

function Summary({ disabled, discount, itemCount, onCheckout, shipping, store, subtotal, total }: { disabled: boolean; discount: number; itemCount: number; onCheckout: () => void; shipping: number; store?: Store; subtotal: number; total: number }) {
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
      <button aria-disabled={disabled} className="primary-snap wide" disabled={disabled} onClick={onCheckout} type="button"><FiLock /> Checkout Sekarang</button>
    </article>
  );
}

function cartItemKey(item: CartItem) {
  return item.cartId ?? item.id;
}

function readCheckoutSelection(): { selectedCartItemIds: string[]; voucherCode?: string } {
  if (typeof window === "undefined") return { selectedCartItemIds: [] };
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(CHECKOUT_STATE_KEY) ?? "{}") as { selectedCartItemIds?: unknown; voucherCode?: unknown };
    return {
      selectedCartItemIds: Array.isArray(parsed.selectedCartItemIds) ? parsed.selectedCartItemIds.map(String).filter(Boolean) : [],
      voucherCode: typeof parsed.voucherCode === "string" ? parsed.voucherCode : undefined
    };
  } catch {
    return { selectedCartItemIds: [] };
  }
}

function selectedDeliveryDate(id: string, reference = new Date()) {
  const date = new Date(reference);
  if (id === "tomorrow") date.setDate(date.getDate() + 1);
  if (id === "after-tomorrow") date.setDate(date.getDate() + 2);
  if (id === "weekend") {
    const day = date.getDay();
    const daysUntilSaturday = day === 6 ? 0 : (6 - day + 7) % 7;
    date.setDate(date.getDate() + daysUntilSaturday);
    if (!availableDeliveryTimesForDate(date, reference).length) date.setDate(date.getDate() + 7);
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

function availableDeliveryTimes(dateId: string, reference = new Date()) {
  return availableDeliveryTimesForDate(selectedDeliveryDate(dateId, reference), reference);
}

function availableDeliveryTimesForDate(date: Date, reference = new Date()) {
  return deliveryTimes.filter((slot) => slotEndDate(date, slot).getTime() > reference.getTime());
}

function slotEndDate(date: Date, slot: string) {
  const end = slot.split("-").at(-1)?.trim() ?? "";
  const [hours = "0", minutes = "0"] = end.split(":");
  const endDate = new Date(date);
  endDate.setHours(Number(hours), Number(minutes), 0, 0);
  return endDate;
}

function activeDeliveryDates(reference = new Date()) {
  return deliveryDates.filter((date) => availableDeliveryTimes(date.id, reference).length);
}

function initialDeliveryDateId() {
  return activeDeliveryDates()[0]?.id ?? "tomorrow";
}

function initialDeliveryTime() {
  return availableDeliveryTimes(initialDeliveryDateId())[0] ?? deliveryTimes[0];
}

function shippingIcon(id: string) {
  if (id === "express") return FiZap;
  if (id === "pickup") return FiHome;
  return FiTruck;
}

export function SnapCheckoutPage() {
  const updateCheckoutDraft = useCheckoutDraftStore((state) => state.updateDraft);
  const [now, setNow] = useState(() => new Date());
  const [items, setItems] = useState<CartItem[]>([]);
  const [store, setStore] = useState<Store>();
  const [stores, setStores] = useState<Store[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [checkoutSelection] = useState(readCheckoutSelection);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedDateId, setSelectedDateId] = useState(initialDeliveryDateId);
  const [selectedTime, setSelectedTime] = useState(initialDeliveryTime);
  const [shippingMethods, setShippingMethods] = useState<CheckoutOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<CheckoutOption[]>([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(fallbackDeliveryOptions[0].id);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [voucherCode, setVoucherCode] = useState(() => readCheckoutSelection().voucherCode ?? "");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressEditingId, setAddressEditingId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<CheckoutAddressForm>(() => emptyCheckoutAddressForm());
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.subtotal ?? item.price * item.quantity), 0), [items]);
  const deliveryOptions = shippingMethods.length ? shippingMethods : fallbackDeliveryOptions.map(({ id, label, cost, description, eta, requiresAddress }) => ({ id, label, cost, description, eta, requiresAddress }));
  const visibleDeliveryDates = useMemo(() => activeDeliveryDates(now), [now]);
  const selectedDelivery = useMemo(() => deliveryOptions.find((option) => option.id === selectedDeliveryId) ?? deliveryOptions[0], [deliveryOptions, selectedDeliveryId]);
  const selectedPayment = useMemo(() => paymentMethods.find((option) => option.id === selectedPaymentId) ?? paymentMethods[0], [paymentMethods, selectedPaymentId]);
  const shipping = items.length ? selectedDelivery.cost ?? 0 : 0;
  const discount = Math.min(voucherDiscount, subtotal);
  const total = Math.max(0, subtotal + shipping - discount);
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedAddressId) ?? addresses.find((address) => address.isPrimary) ?? addresses[0],
    [addresses, selectedAddressId]
  );
  const orderDisabledReason = checkoutDisabledReason({
    hasAddress: Boolean(selectedAddress),
    hasItems: Boolean(items.length),
    hasSchedule: Boolean(selectedDateId && selectedTime && availableDeliveryTimes(selectedDateId, now).includes(selectedTime)),
    hasShipping: Boolean(selectedDeliveryId),
    hasPayment: Boolean(selectedPayment?.id),
    hasStore: Boolean(store),
    requiresAddress: selectedDelivery.requiresAddress !== false,
    submitting
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const dates = activeDeliveryDates(now);
    const nextDateId = dates.some((date) => date.id === selectedDateId) ? selectedDateId : dates[0]?.id ?? "tomorrow";
    const slots = availableDeliveryTimes(nextDateId, now);
    const timer = window.setTimeout(() => {
      if (nextDateId !== selectedDateId) setSelectedDateId(nextDateId);
      if (!slots.includes(selectedTime)) setSelectedTime(slots[0] ?? "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [now, selectedDateId, selectedTime]);

  async function reloadAddresses(selectId?: string) {
    const fresh = await fetchAddresses();
    setAddresses(fresh);
    const nextId = selectId ?? fresh.find((address) => address.isPrimary)?.id ?? fresh[0]?.id ?? "";
    setSelectedAddressId(nextId);
    return fresh;
  }

  function openAddressCreate() {
    setAddressEditingId(null);
    setAddressForm(emptyCheckoutAddressForm(addresses.length === 0));
    setAddressMessage("");
    setAddressModalOpen(true);
  }

  function openAddressEdit(address: Address) {
    setAddressEditingId(address.id);
    setAddressForm(formFromAddress(address));
    setAddressMessage("");
    setAddressModalOpen(true);
  }

  async function saveCheckoutAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddressSaving(true);
    setAddressMessage("");
    try {
      const payload = payloadFromAddressForm(addressForm);
      const saved = addressEditingId ? await updateAddress(addressEditingId, payload) : await createAddress(payload);
      await reloadAddresses(saved.id);
      setAddressModalOpen(false);
      setMessage(addressEditingId ? "Alamat berhasil diperbarui dan dipilih." : "Alamat berhasil ditambahkan dan dipilih.");
    } catch (error) {
      setAddressMessage(error instanceof Error ? error.message : "Alamat belum dapat disimpan.");
    } finally {
      setAddressSaving(false);
    }
  }

  async function removeCheckoutAddress(address: Address) {
    if (!window.confirm(`Hapus alamat ${address.label}?`)) return;
    setAddressSaving(true);
    try {
      await deleteAddress(address.id);
      await reloadAddresses();
      setAddressMessage("Alamat berhasil dihapus.");
    } catch (error) {
      setAddressMessage(error instanceof Error ? error.message : "Alamat belum dapat dihapus.");
    } finally {
      setAddressSaving(false);
    }
  }

  async function makeCheckoutAddressPrimary(address: Address) {
    setAddressSaving(true);
    try {
      const saved = await updateAddress(address.id, { isPrimary: true });
      await reloadAddresses(saved.id);
      setAddressMessage("Alamat utama berhasil diperbarui.");
    } catch (error) {
      setAddressMessage(error instanceof Error ? error.message : "Alamat utama belum dapat diperbarui.");
    } finally {
      setAddressSaving(false);
    }
  }

  useEffect(() => {
    Promise.all([fetchCart(), fetchNearestStore().catch(() => null), fetchAddresses().catch(() => []), fetchCheckoutOptions().catch(() => ({ paymentMethods: [], shippingMethods: [] })), fetchStores().catch(() => [])])
      .then(([cart, nearest, addressList, options, storeList]) => {
        const selected = checkoutSelection.selectedCartItemIds.length ? cart.items.filter((item) => checkoutSelection.selectedCartItemIds.includes(cartItemKey(item))) : cart.items;
        setItems(selected);
        setStore(nearest?.store ?? cart.store ?? storeList[0]);
        setStores(storeList);
        setAddresses(addressList);
        setShippingMethods(options.shippingMethods);
        setPaymentMethods(options.paymentMethods);
        setSelectedDeliveryId(options.shippingMethods[0]?.id ?? fallbackDeliveryOptions[0].id);
        setSelectedPaymentId(options.paymentMethods[0]?.id ?? "");
        setSelectedAddressId(addressList.find((address) => address.isPrimary)?.id ?? addressList[0]?.id ?? "");
        setMessage(selected.length ? "" : "Cart kosong atau produk terpilih tidak ditemukan. Checkout membutuhkan produk.");
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Silakan login untuk checkout."))
      .finally(() => setLoading(false));
  }, [checkoutSelection.selectedCartItemIds]);

  useEffect(() => {
    if (!voucherCode.trim() || !items.length) return;
    validateCartVoucher(voucherCode, checkoutSelection.selectedCartItemIds.length ? checkoutSelection.selectedCartItemIds : items.map(cartItemKey))
      .then((result) => {
        setVoucherDiscount(result.discount);
        setMessage(result.message);
      })
      .catch((error) => {
        setVoucherDiscount(0);
        setMessage(error instanceof Error ? error.message : "Voucher tidak dapat digunakan.");
      });
  }, [checkoutSelection.selectedCartItemIds, items, voucherCode]);

  useEffect(() => {
    if (!addressModalOpen && !branchModalOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAddressModalOpen(false);
        setBranchModalOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [addressModalOpen, branchModalOpen]);

  useEffect(() => {
    updateCheckoutDraft({
      addressId: selectedAddressId,
      deliveryId: selectedDeliveryId,
      paymentId: selectedPaymentId,
      storeId: store?.id ?? "",
      voucherCode
    });
  }, [selectedAddressId, selectedDeliveryId, selectedPaymentId, store?.id, updateCheckoutDraft, voucherCode]);

  async function syncNearestStore() {
    setMessage("");
    try {
      const nearest = await fetchNearestStore();
      setStore(nearest.store);
      setMessage(`Cabang terdekat diperbarui: ${nearest.store.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Cabang terdekat belum bisa diperbarui.");
    }
  }

  async function submitOrder() {
    if (!items.length) {
      setMessage("Pilih produk dari cart sebelum membuat pesanan.");
      return;
    }
    if (selectedDelivery.requiresAddress !== false && !selectedAddress) {
      setMessage("Tambahkan alamat pengiriman dari profil sebelum membuat pesanan.");
      return;
    }
    if (!store) {
      setMessage("Pilih cabang terlebih dahulu.");
      return;
    }
    if (!selectedDateId || !selectedTime || !selectedDeliveryId) {
      setMessage("Lengkapi jadwal dan opsi pengiriman.");
      return;
    }
    if (!selectedPayment) {
      setMessage("Metode pembayaran belum tersedia. Periksa konfigurasi Xendit backend.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createOrderFromCart(items, total, {
        addressId: selectedAddress?.id,
        deliveryDate: selectedDeliveryDate(selectedDateId, now).toISOString(),
        deliverySlot: selectedTime,
        location: selectedAddress ? { lat: selectedAddress.lat, lng: selectedAddress.lng } : undefined,
        orderNote,
        paymentChannel: selectedPayment.id,
        paymentMethod: "xendit",
        selectedCartItemIds: checkoutSelection.selectedCartItemIds.length ? checkoutSelection.selectedCartItemIds : items.map(cartItemKey),
        shippingMethod: selectedDelivery.id,
        storeId: store.id,
        voucherCode: voucherCode.trim() || undefined
      });
      setItems([]);
      window.sessionStorage.removeItem(CHECKOUT_STATE_KEY);
      window.sessionStorage.setItem("market-snap-last-order-number", result.data.orderNumber);
      const schedule = `${deliveryDates.find((date) => date.id === selectedDateId)?.label ?? "Hari ini"}, ${selectedTime}`;
      const redirectUrl = result.payment?.redirectUrl ?? result.payment?.invoiceUrl;
      if (isSafePaymentRedirect(redirectUrl)) {
        setMessage(`Order ${result.data.orderNumber} berhasil dibuat untuk ${schedule}. Mengarahkan ke pembayaran...`);
        window.location.assign(redirectUrl);
        return;
      }
      setMessage(`Order ${result.data.orderNumber} berhasil dibuat, tetapi sesi pembayaran gagal dibuat. Buka detail pesanan untuk mencoba lagi atau hubungi bantuan.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SnapHeader active="cart" cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
      <main>
        <section className="checkout-title-row">
          <div><h1>Checkout</h1><p>Lengkapi informasi di bawah untuk menyelesaikan pesanan Anda.</p></div>
          <div className="stepper checkout-stepper">
            <span className="done"><FiCheckCircle /> Informasi</span>
            <span className={selectedDeliveryId ? "active" : ""}><FiTruck /> Pengiriman</span>
            <span className="active"><FiLock /> Pembayaran</span>
            <span><FiCheckCircle /> Selesai</span>
          </div>
        </section>
        {loading ? <CheckoutSkeleton /> : (
          <>
            {message && <p className="catalog-message">{message}</p>}
            <section className="checkout-page-grid">
              <div className="checkout-forms">
                <CheckoutBlock title="1. Alamat Pengiriman" action="Ubah Alamat" onAction={() => setAddressModalOpen(true)}>
                  {addresses.length ? (
                    <div className="address-picker">
                      {addresses.map((address) => (
                        <button className={address.id === selectedAddress?.id ? "address-card active" : "address-card"} key={address.id} onClick={() => setSelectedAddressId(address.id)} type="button">
                          <FiHome />
                          <div>
                            <strong>{address.label} {address.isPrimary && <span>Utama</span>}</strong>
                            <p>{address.detail}</p>
                            <small>{[address.recipientName, address.phone, address.district, address.city, address.province, address.postalCode].filter(Boolean).join(" - ") || (address.isPrimary ? "Alamat utama pelanggan" : "Alamat tersimpan")}</small>
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
                  <button className="dashed-add" onClick={openAddressCreate} type="button"><FiPlus /> Tambah alamat baru</button>
                </CheckoutBlock>
                <CheckoutBlock title="2. Jadwal Pengiriman">
                  <div className="date-row">
                    {visibleDeliveryDates.map((date) => (
                      <button className={date.id === selectedDateId ? "active" : ""} key={date.id} onClick={() => {
                        const slots = availableDeliveryTimes(date.id, now);
                        setSelectedDateId(date.id);
                        setSelectedTime((current) => slots.includes(current) ? current : slots[0]);
                      }} type="button">
                        {date.label}<small>{selectedDeliveryDate(date.id, now).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}</small>
                      </button>
                    ))}
                  </div>
                  <select aria-label="Pilih jam pengiriman" onChange={(event) => setSelectedTime(event.target.value)} value={selectedTime}>
                    {availableDeliveryTimes(selectedDateId, now).map((time) => <option key={time}>{time}</option>)}
                  </select>
                </CheckoutBlock>
                <CheckoutBlock title="3. Cabang Terdekat" action="Ubah cabang" onAction={() => setBranchModalOpen(true)}>
                  <div className="branch-checkout"><Image alt="" height={48} src="/market-snap-favicon-transparent.png" width={48} /><div><h3>{store?.name ?? "Market Snap"}</h3><p>{store?.area ?? "Jakarta Selatan"}</p><span>{store?.distanceKm ? `${store.distanceKm.toFixed(1)} km dari lokasi Anda` : "Jarak belum dapat dihitung"}</span></div></div>
                  <button className="secondary-snap" onClick={syncNearestStore} type="button">Sinkronkan cabang terdekat</button>
                </CheckoutBlock>
                <CheckoutBlock title="4. Opsi Pengiriman">
                  <div className="delivery-row">
                    {deliveryOptions.map((option) => {
                      const Icon = shippingIcon(option.id);
                      return (
                        <button className={option.id === selectedDeliveryId ? "active" : ""} key={option.id} onClick={() => setSelectedDeliveryId(option.id)} type="button">
                          <Icon /> {option.label}<small>{option.description}</small><br /><strong>{option.cost ? rupiah(option.cost) : "GRATIS"}</strong>
                        </button>
                      );
                    })}
                  </div>
                </CheckoutBlock>
                <CheckoutBlock title="5. Voucher">
                  <div className="voucher-apply-row">
                    <input onChange={(event) => setVoucherCode(event.target.value)} placeholder="Masukkan kode voucher" value={voucherCode} />
                    <button onClick={() => setVoucherCode(voucherCode.trim())} type="button"><FiTag /> Gunakan</button>
                  </div>
                  {discount > 0 && <div className="voucher-success"><strong>Voucher berhasil!</strong><span>Diskon {rupiah(discount)}</span></div>}
                </CheckoutBlock>
                <CheckoutBlock title="6. Metode Pembayaran">
                  <div className="delivery-row payment-method-row">
                    {paymentMethods.map((option) => (
                      <button className={option.id === selectedPaymentId ? "active" : ""} key={option.id} onClick={() => setSelectedPaymentId(option.id)} type="button">
                        <FiLock /> {option.label}<small>{option.description}</small>
                      </button>
                    ))}
                  </div>
                  {!paymentMethods.length && <p className="summary-warning">Metode pembayaran Xendit belum tersedia. Periksa environment variable Xendit backend.</p>}
                </CheckoutBlock>
                <CheckoutBlock title="7. Catatan Pesanan">
                  <textarea onChange={(event) => setOrderNote(event.target.value)} placeholder="Catatan untuk toko atau kurir" value={orderNote} />
                </CheckoutBlock>
              </div>
              <aside className="checkout-summary">
                <article className="summary-panel">
                  <h2>Ringkasan Pesanan <small>{items.length} item</small></h2>
                  {items.map((item) => <div className="mini-order" key={item.cartId ?? item.id}><Image alt={item.name} height={52} src={item.image} width={52} /><span><strong>{item.name}</strong><small>{item.unit}</small><b>{rupiah(item.price)}</b></span><small>Qty: {item.quantity}</small></div>)}
                  <p><span>Subtotal</span><strong>{rupiah(subtotal)}</strong></p>
                  <p className="green"><span>Diskon Voucher</span><strong>- {rupiah(discount)}</strong></p>
                  <p><span>Biaya Pengiriman</span><strong>{rupiah(shipping)}</strong></p>
                  <p><span>Jadwal</span><strong>{deliveryDates.find((date) => date.id === selectedDateId)?.label}, {selectedTime || "Pilih slot"}</strong></p>
                  <p><span>Opsi</span><strong>{selectedDelivery.label}</strong></p>
                  <p><span>Pembayaran</span><strong>{selectedPayment?.label ?? "Belum tersedia"}</strong></p>
                  <hr />
                  <p className="total"><span>Total Pembayaran</span><strong>{rupiah(total)}</strong></p>
                  {orderDisabledReason && <p className="summary-warning">{orderDisabledReason}</p>}
                  <button className="primary-snap wide" disabled={Boolean(orderDisabledReason)} onClick={submitOrder} type="button"><FiLock /> {submitting ? "Membuat pesanan..." : "Buat pesanan"}</button>
                </article>
                <article className="invoice-card"><h2>Preview Invoice</h2><strong>MARKET SNAP</strong><p>Invoice dibuat setelah order tersimpan</p><hr /><p>Total <b>{rupiah(total)}</b></p></article>
              </aside>
            </section>
          </>
        )}
      </main>
      <SnapFooter />
      <BenefitStrip />
      {branchModalOpen && (
        <div className="auth-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setBranchModalOpen(false);
        }}>
          <section aria-modal="true" className="auth-modal branch-modal" role="dialog">
            <button aria-label="Tutup" className="auth-modal-close" onClick={() => setBranchModalOpen(false)} type="button"><FiX /></button>
            <h2>Pilih cabang</h2>
            <div className="branch-modal-list">
              {stores.map((item) => (
                <button className={item.id === store?.id ? "active" : ""} key={item.id} onClick={() => { setStore(item); setBranchModalOpen(false); }} type="button">
                  <strong>{item.name}</strong>
                  <span>{item.area}</span>
                  <small>{item.distanceKm === undefined ? "Jarak belum dapat dihitung" : `${item.distanceKm.toFixed(1)} km`} - estimasi {item.eta}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
      {addressModalOpen && (
        <div className="auth-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAddressModalOpen(false);
        }}>
          <section aria-modal="true" className="auth-modal address-modal" role="dialog">
            <button aria-label="Tutup" className="auth-modal-close" onClick={() => setAddressModalOpen(false)} type="button"><FiX /></button>
            <h2>Alamat pengiriman</h2>
            {addressMessage && <p className="catalog-message">{addressMessage}</p>}
            <div className="checkout-address-modal-grid">
              <div className="address-modal-list">
                <button className="dashed-add" onClick={openAddressCreate} type="button"><FiPlus /> Tambah alamat baru</button>
                {addresses.map((address) => (
                  <article className={address.id === selectedAddress?.id ? "address-modal-card active" : "address-modal-card"} key={address.id}>
                    <button onClick={() => { setSelectedAddressId(address.id); setAddressModalOpen(false); }} type="button">
                      <FiHome />
                      <span>
                        <strong>{address.label} {address.isPrimary && <em>Utama</em>}</strong>
                        <small>{address.recipientName || "Penerima belum diisi"} - {address.phone || "Nomor belum diisi"}</small>
                        <small>{[address.detail, address.district, address.city, address.province, address.postalCode].filter(Boolean).join(", ")}</small>
                      </span>
                    </button>
                    <div>
                      {!address.isPrimary && <button disabled={addressSaving} onClick={() => makeCheckoutAddressPrimary(address)} type="button"><FiCheck /> Utama</button>}
                      <button disabled={addressSaving} onClick={() => openAddressEdit(address)} type="button"><FiEdit2 /> Edit</button>
                      <button disabled={addressSaving} onClick={() => removeCheckoutAddress(address)} type="button"><FiTrash2 /> Hapus</button>
                    </div>
                  </article>
                ))}
              </div>
              <form className="account-form checkout-address-form" onSubmit={saveCheckoutAddress}>
                <h3>{addressEditingId ? "Edit alamat" : "Tambah alamat baru"}</h3>
                <label>Label alamat<input onChange={updateCheckoutAddressField("label", setAddressForm)} placeholder="Rumah / Kantor" required value={addressForm.label} /></label>
                <label>Nama penerima<input onChange={updateCheckoutAddressField("recipientName", setAddressForm)} placeholder="Nama penerima" required value={addressForm.recipientName} /></label>
                <label>Nomor telepon<input onChange={updateCheckoutAddressField("phone", setAddressForm)} placeholder="0812-3456-7890" required value={addressForm.phone} /></label>
                <label>Provinsi<input onChange={updateCheckoutAddressField("province", setAddressForm)} placeholder="Provinsi" required value={addressForm.province} /></label>
                <label>Kota/Kabupaten<input onChange={updateCheckoutAddressField("city", setAddressForm)} placeholder="Kota atau kabupaten" required value={addressForm.city} /></label>
                <label>Kecamatan<input onChange={updateCheckoutAddressField("district", setAddressForm)} placeholder="Kecamatan" required value={addressForm.district} /></label>
                <label>Kode pos<input onChange={updateCheckoutAddressField("postalCode", setAddressForm)} placeholder="Kode pos" required value={addressForm.postalCode} /></label>
                <label>Alamat lengkap<input onChange={updateCheckoutAddressField("detail", setAddressForm)} placeholder="Nama jalan, nomor rumah, kelurahan" required value={addressForm.detail} /></label>
                <label>Catatan/patokan<input onChange={updateCheckoutAddressField("note", setAddressForm)} placeholder="Patokan rumah, instruksi kurir" value={addressForm.note} /></label>
                <label>Latitude<input onChange={updateCheckoutAddressField("lat", setAddressForm)} required type="number" value={addressForm.lat} /></label>
                <label>Longitude<input onChange={updateCheckoutAddressField("lng", setAddressForm)} required type="number" value={addressForm.lng} /></label>
                <label className="account-check"><input checked={addressForm.isPrimary} onChange={(event) => setAddressForm((current) => ({ ...current, isPrimary: event.target.checked }))} type="checkbox" /> Jadikan alamat utama</label>
                <button className="primary-snap" disabled={addressSaving} type="submit"><FiCheck /> {addressSaving ? "Menyimpan..." : addressEditingId ? "Simpan alamat" : "Tambah alamat"}</button>
              </form>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function CheckoutBlock({ title, action, actionHref, children, onAction }: { title: string; action?: string; actionHref?: string; children: React.ReactNode; onAction?: () => void }) {
  return (
    <article className="checkout-block">
      <header>
        <h2>{title}</h2>
        {action && (actionHref ? <Link href={actionHref}>{action}</Link> : <button onClick={onAction} type="button">{action}</button>)}
      </header>
      {children}
    </article>
  );
}

function checkoutDisabledReason(input: { hasAddress: boolean; hasItems: boolean; hasPayment: boolean; hasSchedule: boolean; hasShipping: boolean; hasStore: boolean; requiresAddress: boolean; submitting: boolean }) {
  if (input.submitting) return "Pesanan sedang diproses.";
  if (!input.hasItems) return "Checkout membutuhkan minimal satu produk.";
  if (input.requiresAddress && !input.hasAddress) return "Pilih atau tambahkan alamat pengiriman.";
  if (!input.hasStore) return "Pilih cabang terlebih dahulu.";
  if (!input.hasSchedule) return "Pilih jadwal dan slot pengiriman.";
  if (!input.hasShipping) return "Pilih metode pengiriman.";
  if (!input.hasPayment) return "Pilih metode pembayaran.";
  return "";
}

function emptyCheckoutAddressForm(isPrimary = false): CheckoutAddressForm {
  return {
    city: "",
    detail: "",
    district: "",
    isPrimary,
    label: "",
    lat: "-6.2608",
    lng: "106.8107",
    note: "",
    phone: "",
    postalCode: "",
    province: "",
    recipientName: ""
  };
}

function formFromAddress(address: Address): CheckoutAddressForm {
  return {
    city: address.city ?? "",
    detail: address.detail,
    district: address.district ?? "",
    isPrimary: address.isPrimary,
    label: address.label,
    lat: String(address.lat),
    lng: String(address.lng),
    note: address.note ?? "",
    phone: address.phone ?? "",
    postalCode: address.postalCode ?? "",
    province: address.province ?? "",
    recipientName: address.recipientName ?? ""
  };
}

function payloadFromAddressForm(form: CheckoutAddressForm) {
  return {
    city: form.city.trim(),
    detail: form.detail.trim(),
    district: form.district.trim(),
    isPrimary: form.isPrimary,
    label: form.label.trim(),
    lat: Number(form.lat),
    lng: Number(form.lng),
    note: form.note.trim() || undefined,
    phone: form.phone.trim(),
    postalCode: form.postalCode.trim(),
    province: form.province.trim(),
    recipientName: form.recipientName.trim()
  };
}

function updateCheckoutAddressField(field: keyof CheckoutAddressForm, setForm: React.Dispatch<React.SetStateAction<CheckoutAddressForm>>) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };
}

function isSafePaymentRedirect(value?: string | null): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
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
