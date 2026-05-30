"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "../../../../components/Header";
import { clearCart, createOrderFromCart, deleteCartItem, fetchCart, updateCartItem } from "../../../../lib/api";
import { rupiah } from "../../../../lib/format";
import type { CartItem } from "../../../../lib/types";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("Memuat cart dari API...");
  const [busyId, setBusyId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [courier, setCourier] = useState("jne");
  const [paymentMethod, setPaymentMethod] = useState<"manual_transfer" | "xendit">("xendit");
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shippingLabel = destinationId ? "Dihitung API" : "Isi destination ID";

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const cart = await fetchCart();
      setItems(cart.items);
      setMessage(cart.items.length ? "Cart tersambung ke API." : "Keranjang masih kosong.");
    } catch {
      setMessage("Gagal memuat cart dari API. Pastikan API berjalan.");
    }
  }

  async function update(id: string, quantity: number) {
    if (quantity < 1) return remove(id);
    setBusyId(id);
    try {
      const item = await updateCartItem(id, quantity);
      setItems((cart) => cart.map((cartItem) => cartItem.cartId === id ? item : cartItem));
      setMessage("Jumlah cart berhasil diupdate.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal update cart.");
    } finally {
      setBusyId("");
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      await deleteCartItem(id);
      setItems((cart) => cart.filter((item) => item.cartId !== id));
      setMessage("Produk berhasil dihapus dari cart.");
    } catch {
      setMessage("Gagal menghapus produk dari cart.");
    } finally {
      setBusyId("");
    }
  }

  async function emptyCart() {
    await clearCart();
    setItems([]);
    setMessage("Cart berhasil dikosongkan.");
  }

  async function createOrder() {
    setMessage("Membuat order...");
    try {
      const order = await createOrderFromCart(items, subtotal, { courier, destinationId: destinationId.trim() || undefined, paymentMethod });
      await clearCart();
      setItems([]);
      setMessage(`Order ${order.data.id} dibuat dengan status ${order.data.status}.`);
      if (order.payment?.invoiceUrl) window.location.href = order.payment.invoiceUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat order.");
    }
  }

  return (
    <>
      <Header cartCount={items.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="dashboard-shell">
        <section className="page-heading">
          <span className="mini-label">Checkout</span>
          <h1>Keranjang belanja</h1>
          <p>Order baru akan berstatus Menunggu Pembayaran sampai bukti bayar diupload.</p>
          <p className="api-pill is-online">{message}</p>
        </section>
        <section className="checkout-grid">
          <div className="list-card">
            {items.length === 0 && <p>Keranjang masih kosong.</p>}
            {items.map((item) => (
              <article className="cart-row" key={item.cartId ?? item.id}>
                <img alt={item.name} src={item.image} />
                <div>
                  <strong>{item.name}</strong>
                  <p>{rupiah(item.price)} / {item.unit} - stok {item.stock ?? "-"}</p>
                </div>
                <div className="cart-actions">
                  <input
                    disabled={busyId === item.cartId}
                    min="0"
                    onChange={(event) => update(String(item.cartId), Number(event.target.value))}
                    type="number"
                    value={item.quantity}
                  />
                  <button disabled={busyId === item.cartId} onClick={() => remove(String(item.cartId))}>Hapus</button>
                </div>
              </article>
            ))}
          </div>
          <aside className="summary-card">
            <h2>Ringkasan</h2>
            <p><span>Subtotal</span><strong>{rupiah(subtotal)}</strong></p>
            <p><span>Ongkir</span><strong>{shippingLabel}</strong></p>
            <p><span>Voucher</span><strong>SNAPSHIP</strong></p>
            <label>Destination ID RajaOngkir
              <input onChange={(event) => setDestinationId(event.target.value)} placeholder="Contoh: 41068" value={destinationId} />
            </label>
            <label>Courier
              <select onChange={(event) => setCourier(event.target.value)} value={courier}>
                <option value="jne">JNE</option>
                <option value="jnt">J&T</option>
                <option value="sicepat">SiCepat</option>
              </select>
            </label>
            <label>Payment
              <select onChange={(event) => setPaymentMethod(event.target.value as "manual_transfer" | "xendit")} value={paymentMethod}>
                <option value="xendit">Xendit invoice</option>
                <option value="manual_transfer">Transfer manual</option>
              </select>
            </label>
            <hr />
            <p><span>Total produk</span><strong>{rupiah(subtotal)}</strong></p>
            <button className="primary-button" disabled={!items.length} onClick={createOrder}>Buat pesanan</button>
            <button className="secondary-button danger-button" disabled={!items.length} onClick={emptyCart}>Kosongkan cart</button>
          </aside>
        </section>
      </main>
    </>
  );
}
