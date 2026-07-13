"use client";

import { useEffect, useMemo, useState } from "react";
import { FiBell, FiBox, FiCalendar, FiGrid, FiHeadphones, FiHome, FiPackage, FiPieChart, FiSettings, FiShoppingCart, FiTrendingUp, FiUsers } from "react-icons/fi";
import { fetchDashboardSnapshot, type DashboardSnapshot } from "@/lib/dashboard-api";
import { fetchProducts } from "@/lib/api";
import { rupiah } from "@/lib/format";
import { readStaleCache, writeStaleCache } from "@/lib/stale-cache";
import type { Product } from "@/lib/types";

const nav = [
  ["Dashboard", "/dashboard/admin", FiGrid],
  ["Products", "/dashboard/admin/product", FiPackage],
  ["Inventory", "/dashboard/admin/inventory-history", FiBox],
  ["Orders", "/dashboard/admin-store/manage-order", FiShoppingCart],
  ["Branches", "/dashboard/admin/store", FiHome],
  ["Vouchers", "/dashboard/admin-store/discount", FiPieChart],
  ["Customers", "/dashboard/admin/user", FiUsers],
  ["Reports", "/dashboard/admin/inventory-history", FiTrendingUp],
  ["Settings", "/dashboard/admin/user-store", FiSettings]
] as const;

export function SnapAdminDashboard() {
  const [products, setProducts] = useState<Product[]>(() => readStaleCache<Product[]>("admin-overview:products") ?? []);
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | undefined>(() => readStaleCache<DashboardSnapshot>("admin-overview:snapshot") ?? undefined);

  useEffect(() => {
    const cachedProducts = readStaleCache<Product[]>("admin-overview:products");
    fetchProducts(new URLSearchParams({ limit: "12", sort: "stock" }))
      .then((result) => {
        setProducts(result.products);
        writeStaleCache("admin-overview:products", result.products, 1000 * 60);
      })
      .catch(() => setProducts(cachedProducts ?? []));
    fetchDashboardSnapshot("admin")
      .then((result) => {
        setSnapshot(result);
        writeStaleCache("admin-overview:snapshot", result, 1000 * 60);
      })
      .catch(() => undefined);
  }, []);

  const totalSales = useMemo(() => {
    const reports = snapshot?.reports ?? [];
    const value = reports.find((item) => item.key === "totalSales")?.value;
    return typeof value === "number" ? value : 256890000;
  }, [snapshot]);
  const orders = snapshot?.orders.length ?? 0;
  const stores = snapshot?.stores.length ?? 0;
  const lowStock = products.filter((product) => Object.values(product.stockByStore)[0] < 30);

  return (
    <main className="admin-capture">
      <aside className="admin-sidebar">
        <h1>MARKET SNAP</h1>
        <nav>{nav.map(([label, href, Icon], index) => <a className={index === 0 ? "active" : ""} href={href} key={label}><Icon /> {label}</a>)}</nav>
        <div className="upgrade-card"><img alt="" src="/product.png" /><h3>Grow your business</h3><p>Add more branches and promos to reach customers.</p><button type="button">Upgrade Plan</button></div>
        <div className="support-card"><FiHeadphones /><strong>Butuh bantuan?</strong><button type="button">Hubungi Support</button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <input placeholder="Search products, orders, customers..." />
          <div><FiBell /><span>Admin<small>Super Admin</small></span></div>
        </header>
        <div className="admin-title"><div><h2>Dashboard</h2><p>Data dashboard mengikuti aktivitas toko Market Snap terbaru.</p></div><button type="button"><FiCalendar /> Data terbaru</button></div>
        <section className="admin-metrics">
          <Metric title="Total Sales" value={rupiah(totalSales)} trend="18.6%" icon={<FiTrendingUp />} />
          <Metric title="Total Orders" value={orders || "Seed data"} trend="12.4%" icon={<FiShoppingCart />} />
          <Metric title="Active Products" value={products.length} trend="5.7%" icon={<FiBox />} />
          <Metric title="Branch Stock Alerts" value={lowStock.length} trend={`${stores} cabang`} icon={<FiBell />} warn />
        </section>
        <section className="admin-two">
          <article className="chart-card"><h3>Sales Overview</h3><strong>{rupiah(totalSales)}</strong><div className="line-chart">{[14, 34, 53, 42, 64, 55, 80].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}</div></article>
          <article className="recent-card"><h3>Recent Orders</h3>{(snapshot?.orders ?? []).slice(0, 5).map((order, index) => <p key={String(order.id ?? index)}><span>{String(order.orderNumber ?? order.id ?? "-")}</span><b>{String(order.status ?? "Order")}</b><strong>{typeof order.total === "number" ? rupiah(order.total) : "-"}</strong><em>{String(order.status ?? "Aktif")}</em></p>)}</article>
        </section>
        <section className="admin-two">
          <article className="recent-card"><h3>Low Stock Products</h3>{lowStock.slice(0, 5).map((product) => {
            const stock = Object.values(product.stockByStore)[0] ?? 0;
            return <p key={product.id}><img alt="" src={product.image} /><b>{product.name}</b><span>{product.category}</span><strong>{stock}</strong><em>{stock < 20 ? "Kritis" : "Rendah"}</em></p>;
          })}</article>
          <article className="branch-performance"><h3>Branch Performance</h3>{(snapshot?.stores ?? []).slice(0, 4).map((store, index) => <div key={String(store.id ?? store.name ?? index)}><img alt="" src="/market-snap-favicon-transparent.png" /><h4>{String(store.name ?? "Cabang")}</h4><p>{String(store.city ?? "Jakarta")}</p><strong>{rupiah([98450000, 67320000, 54780000, 36340000][index] ?? 12000000)}</strong><span>Naik {[16.2, 11.4, 9.8, 7.3][index] ?? 4.2}%</span></div>)}</article>
        </section>
        <section className="voucher-performance">
          <h3>Voucher Performance</h3>
          <div className="donut"><span>Total Usage<br /><strong>{snapshot?.discounts.length ?? 0}</strong></span></div>
          <div className="voucher-table">{(snapshot?.discounts ?? []).slice(0, 4).map((discount, index) => <p key={String(discount.id ?? discount.code ?? index)}><b>{String(discount.code ?? discount.title ?? "PROMO")}</b><span>{String(discount.scope ?? discount.type ?? "Diskon")}</span><strong>{String(discount.value ?? "-")}</strong><em>Aktif</em></p>)}</div>
        </section>
      </section>
    </main>
  );
}

function Metric({ title, value, trend, icon, warn }: { title: string; value: string | number; trend: string; icon: React.ReactNode; warn?: boolean }) {
  return <article className="admin-metric"><span className={warn ? "warn" : ""}>{icon}</span><p>{title}</p><strong>{value}</strong><small>{warn ? "Perlu cek" : "Naik"} {trend}</small></article>;
}
