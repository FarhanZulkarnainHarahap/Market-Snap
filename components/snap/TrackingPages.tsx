"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiCopy, FiHeadphones, FiMapPin, FiPackage, FiSearch, FiShoppingBag, FiTruck } from "react-icons/fi";
import { fetchOrderTracking, fetchOrders } from "@/lib/api";
import { rupiah } from "@/lib/format";
import type { OrderSummary, OrderStatusHistory } from "@/lib/types";
import { SnapFooter, SnapHeader } from "./SnapCommon";

const statusFilters = ["Semua", "Diproses", "Dikemas", "Dikirim", "Dalam Perjalanan", "Sampai Tujuan", "Selesai", "Dibatalkan"];

const trackingSteps = [
  { status: "PENDING_PAYMENT", label: "Menunggu pembayaran", text: "Pesanan dibuat dan menunggu pembayaran.", icon: FiShoppingBag },
  { status: "PAID", label: "Pembayaran berhasil", text: "Pembayaran sudah diverifikasi.", icon: FiCheckCircle },
  { status: "PROCESSING", label: "Pesanan diproses", text: "Cabang mulai memproses pesanan.", icon: FiClock },
  { status: "PICKING", label: "Produk disiapkan", text: "Produk sedang diambil dari rak.", icon: FiPackage },
  { status: "PACKED", label: "Pesanan dikemas", text: "Produk sudah selesai dikemas.", icon: FiPackage },
  { status: "READY", label: "Siap dikirim", text: "Pesanan siap diserahkan ke kurir.", icon: FiTruck },
  { status: "OUT_FOR_DELIVERY", label: "Dalam perjalanan", text: "Pesanan sedang menuju alamat penerima.", icon: FiMapPin },
  { status: "DELIVERED", label: "Pesanan sampai", text: "Pesanan sudah diterima di alamat tujuan.", icon: FiCheckCircle },
  { status: "COMPLETED", label: "Selesai", text: "Pesanan telah selesai.", icon: FiCheckCircle }
];

export function TrackingListPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Tracking belum dapat dimuat."))
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = useMemo(() => orders.filter((order) => !["COMPLETED", "CONFIRMED", "CANCELLED"].includes(order.status)), [orders]);
  const visibleOrders = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return activeOrders.filter((order) => {
      const matchesQuery = !keyword || order.orderNumber.toLowerCase().includes(keyword) || (order.trackingNumber ?? "").toLowerCase().includes(keyword);
      const matchesStatus = filter === "Semua" || statusText(order.status).toLowerCase().includes(filter.toLowerCase());
      return matchesQuery && matchesStatus;
    });
  }, [activeOrders, filter, query]);

  return (
    <>
      <SnapHeader active="orders" />
      <main className="tracking-page">
        <section className="snap-page-title compact-title">
          <span className="cart-breadcrumb">Market Snap / Lacak Paket</span>
          <h1>Lacak Paket</h1>
          <p>Pantau pesanan aktif, nomor resi, kurir, dan estimasi tiba dari data order.</p>
        </section>
        <section className="tracking-toolbar">
          <label><FiSearch /><input onChange={(event) => setQuery(event.target.value)} placeholder="Cari nomor order atau resi" value={query} /></label>
          <select aria-label="Filter status tracking" onChange={(event) => setFilter(event.target.value)} value={filter}>
            {statusFilters.map((item) => <option key={item}>{item}</option>)}
          </select>
        </section>
        {loading && <section className="tracking-grid">{Array.from({ length: 3 }, (_, index) => <article className="tracking-card skeleton-row" key={index} />)}</section>}
        {!loading && message && <section className="cart-state-card"><i><FiTruck /></i><div><h2>Tracking belum dapat dimuat</h2><p>{message}</p></div></section>}
        {!loading && !message && !visibleOrders.length && <section className="cart-state-card"><i><FiPackage /></i><div><h2>Belum ada paket aktif</h2><p>Pesanan aktif akan muncul di sini setelah checkout berhasil.</p><Link href="/catalog">Mulai Belanja</Link></div></section>}
        <section className="tracking-grid">
          {visibleOrders.map((order) => <TrackingCard key={order.id} order={order} />)}
        </section>
      </main>
      <SnapFooter />
    </>
  );
}

export function TrackingDetailPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrderTracking(orderId)
      .then(setOrder)
      .catch((error) => setMessage(error instanceof Error ? error.message : "Detail tracking belum dapat dimuat."));
  }, [orderId]);

  return (
    <>
      <SnapHeader active="orders" />
      <main className="tracking-page">
        {!order && !message && <section className="tracking-grid"><article className="tracking-card skeleton-row" /></section>}
        {message && <section className="cart-state-card"><i><FiTruck /></i><div><h2>Tracking tidak ditemukan</h2><p>{message}</p></div></section>}
        {order && (
          <section className="tracking-detail-layout">
            <article className="account-panel tracking-detail-main">
              <span className="eyebrow">Tracking</span>
              <h1>{order.orderNumber}</h1>
              <p>Status: <strong>{statusText(order.status)}</strong></p>
              <TrackingTimeline histories={order.histories ?? []} status={order.status} />
            </article>
            <aside className="account-panel tracking-side">
              <h2>Detail pengiriman</h2>
              <p><span>Nomor resi</span><strong>{order.trackingNumber ?? "Belum tersedia"}</strong></p>
              <p><span>Kurir</span><strong>{order.courierName ?? order.shippingProvider ?? "Market Snap"}</strong></p>
              <p><span>Estimasi tiba</span><strong>{order.estimatedArrival ? formatDate(order.estimatedArrival) : "Menunggu jadwal"}</strong></p>
              <p><span>Total pembayaran</span><strong>{rupiah(order.total)}</strong></p>
              <button onClick={() => navigator.clipboard?.writeText(order.trackingNumber ?? order.orderNumber)} type="button"><FiCopy /> Salin nomor resi</button>
              <Link className="secondary-snap wide" href="/contact"><FiHeadphones /> Hubungi bantuan</Link>
              <hr />
              {order.items.map((item) => <div className="mini-order" key={item.id}><Image alt={item.name} height={52} src={item.image} width={52} /><span><strong>{item.name}</strong><small>Qty: {item.quantity}</small></span><b>{rupiah(item.price)}</b></div>)}
            </aside>
          </section>
        )}
      </main>
      <SnapFooter />
    </>
  );
}

function TrackingCard({ order }: { order: OrderSummary }) {
  const firstItem = order.items[0];
  return (
    <article className="tracking-card">
      <div className="tracking-card-head">
        {firstItem ? <Image alt={firstItem.name} height={68} src={firstItem.image} width={68} /> : <span><FiPackage /></span>}
        <div><strong>{order.orderNumber}</strong><small>{formatDate(order.createdAt)}</small></div>
        <b>{statusText(order.status)}</b>
      </div>
      <p><span>Total produk</span><strong>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></p>
      <p><span>Jasa pengiriman</span><strong>{order.courierName ?? order.shippingProvider ?? "Market Snap"}</strong></p>
      <p><span>Nomor resi</span><strong>{order.trackingNumber ?? "Belum tersedia"}</strong></p>
      <p><span>Estimasi tiba</span><strong>{order.estimatedArrival ? formatDate(order.estimatedArrival) : "Menunggu update"}</strong></p>
      <div className="tracking-actions">
        <Link className="primary-snap" href={`/tracking/${order.id}`}>Lacak Paket</Link>
        <Link className="secondary-snap" href={`/dashboard/customer/profile/orders/${order.id}`}>Lihat Detail Pesanan</Link>
      </div>
    </article>
  );
}

function TrackingTimeline({ histories, status }: { histories: OrderStatusHistory[]; status: string }) {
  const activeIndex = Math.max(...trackingSteps.map((step, index) => statusRank(status) >= statusRank(step.status) ? index : -1));
  return (
    <ol className="tracking-timeline">
      {trackingSteps.map((step, index) => {
        const Icon = step.icon;
        const history = histories.find((item) => item.status === step.status);
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <li className={done ? "done" : active ? "active" : ""} key={`${step.label}-${index}`}>
            <i><Icon /></i>
            <div><strong>{step.label}</strong><p>{history?.description ?? step.text}</p><small>{history ? formatDate(history.createdAt) : done || active ? statusText(step.status) : "Belum dilakukan"}</small></div>
          </li>
        );
      })}
    </ol>
  );
}

function statusRank(status: string) {
  const ranks: Record<string, number> = {
    CANCELLED: 0,
    WAITING_PAYMENT: 1,
    PENDING_PAYMENT: 1,
    WAITING_PAYMENT_CONFIRMATION: 1,
    PAID: 2,
    PROCESSING: 3,
    PICKING: 4,
    PACKED: 5,
    READY: 6,
    SHIPPED: 7,
    OUT_FOR_DELIVERY: 7,
    DELIVERED: 8,
    CONFIRMED: 9,
    COMPLETED: 9
  };
  return ranks[status] ?? ranks[statusText(status)] ?? 0;
}

function statusText(status: string) {
  const labels: Record<string, string> = {
    CANCELLED: "Dibatalkan",
    COMPLETED: "Selesai",
    CONFIRMED: "Selesai",
    DELIVERED: "Sampai",
    OUT_FOR_DELIVERY: "Dalam Pengiriman",
    PACKED: "Dikemas",
    PAID: "Pembayaran Berhasil",
    PENDING_PAYMENT: "Menunggu Pembayaran",
    PICKING: "Disiapkan",
    PROCESSING: "Diproses",
    READY: "Siap Dikirim",
    SHIPPED: "Dikirim",
    WAITING_PAYMENT: "Menunggu Pembayaran",
    WAITING_PAYMENT_CONFIRMATION: "Menunggu Konfirmasi Pembayaran"
  };
  return labels[status] ?? status;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}
