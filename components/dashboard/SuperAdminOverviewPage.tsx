"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiBell, FiBox, FiHome, FiPackage, FiRefreshCcw, FiShoppingCart, FiTag, FiTrendingUp, FiUsers } from "react-icons/fi";
import { fetchDashboardSnapshot, type DashboardRecord, type DashboardSnapshot } from "../../lib/dashboard-api";
import { rupiah } from "../../lib/format";
import { readStaleCache, writeStaleCache } from "../../lib/stale-cache";
import { ManagementHeader } from "./ManagementHeader";

const quickActions = [
  ["Tambah Produk", "/super-admin/products/new", FiPackage],
  ["Update Stok", "/super-admin/inventory", FiBox],
  ["Tambah Cabang", "/super-admin/stores/new", FiHome],
  ["Buat Voucher", "/super-admin/discounts/new", FiTag],
  ["Lihat Laporan", "/super-admin/reports", FiTrendingUp]
] as const;

const StackedSalesChart = dynamic(
  () => import("./DashboardStackedSalesChart").then((module) => module.DashboardStackedSalesChart),
  { loading: () => <div className="management-chart-skeleton" />, ssr: false }
);

export function SuperAdminOverviewPage() {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | undefined>(() => readStaleCache<DashboardSnapshot>("super-admin:overview") ?? undefined);
  const [loading, setLoading] = useState(() => !readStaleCache<DashboardSnapshot>("super-admin:overview"));
  const [refreshing, setRefreshing] = useState(() => Boolean(readStaleCache<DashboardSnapshot>("super-admin:overview")));

  useEffect(() => {
    let cancelled = false;
    async function initialLoad() {
      try {
        const data = await fetchDashboardSnapshot("admin");
        if (cancelled) return;
        setSnapshot(data);
        writeStaleCache("super-admin:overview", data, 1000 * 60);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }
    void initialLoad();
    return () => {
      cancelled = true;
    };
  }, []);

  async function load() {
    setRefreshing(Boolean(snapshot));
    try {
      const data = await fetchDashboardSnapshot("admin");
      setSnapshot(data);
      writeStaleCache("super-admin:overview", data, 1000 * 60);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const summary = useMemo(() => overviewSummary(snapshot), [snapshot]);
  const chart = useMemo(() => chartData(snapshot), [snapshot]);

  return (
    <>
      <ManagementHeader role="admin" />
      <main className="dashboard-shell management-content management-overview">
        <section className="management-dashboard-hero">
          <div>
            <span className="mini-label">SUPER ADMIN</span>
            <h1>Dashboard</h1>
            <p>Pantau performa penjualan, pesanan, stok, dan aktivitas seluruh cabang Market Snap.</p>
            <div className="management-dashboard-filters">
              <input aria-label="Rentang tanggal" type="date" />
              <select aria-label="Pilih cabang"><option>Semua Cabang</option>{summary.branchNames.map((branch) => <option key={branch}>{branch}</option>)}</select>
              <button onClick={load} type="button"><FiRefreshCcw /> Refresh</button>
              <small>{loading ? "Memuat data..." : refreshing ? "Memperbarui data..." : "Data terbaru"}</small>
            </div>
          </div>
          <Image alt="" height={260} priority src="/market-snap-hero-v2.png" width={420} />
        </section>

        <section className="management-metric-grid overview-metrics">
          <OverviewMetric icon={<FiTrendingUp />} label="Total Penjualan" value={rupiah(summary.totalSales)} />
          <OverviewMetric icon={<FiShoppingCart />} label="Total Pesanan" value={summary.orderCount} />
          <OverviewMetric icon={<FiPackage />} label="Produk Aktif" value={summary.productCount} />
          <OverviewMetric icon={<FiUsers />} label="Total Customer" value={summary.customerCount} />
          <OverviewMetric icon={<FiHome />} label="Total Cabang" value={summary.branchCount} />
          <OverviewMetric icon={<FiBell />} label="Peringatan Stok" tone="orange" value={summary.lowStockCount} />
        </section>

        <section className="management-overview-grid">
          <article className="admin-panel management-chart-card">
            <header><div><span>Analytics</span><h2>Penjualan dan Pesanan per Cabang</h2></div></header>
            <div className="management-chart-frame">
              {loading ? <div className="management-chart-skeleton" /> : <StackedSalesChart branches={chart.branches} points={chart.points} />}
            </div>
          </article>
          <article className="admin-panel management-insight-card">
            <Image alt="" height={180} src="/discount-product.png" width={260} />
            <span>Recent Orders</span>
            <h2>Pesanan Terbaru</h2>
            <div className="management-mini-list">{summary.recentOrders.map((order, index) => <MiniRow key={index} row={order} />)}</div>
          </article>
        </section>

        <section className="management-quick-actions">
          {quickActions.map(([label, href, Icon]) => <Link href={href} key={href}><Icon /> <span>{label}</span></Link>)}
        </section>
      </main>
    </>
  );
}

function OverviewMetric({ icon, label, tone, value }: { icon: React.ReactNode; label: string; tone?: string; value: string | number }) {
  return <article className={`metric-card management-metric ${tone ?? ""}`}><i>{icon}</i><span>{label}</span><strong>{value}</strong><small>Backend live data</small></article>;
}

function MiniRow({ row }: { row: DashboardRecord }) {
  const title = String(row.orderNumber ?? row.name ?? row.title ?? row.id ?? "Market Snap");
  const status = String(row.status ?? "Aktif");
  return <p><b>{title}</b><span>{status}</span><strong>{typeof row.total === "number" ? rupiah(row.total) : "-"}</strong></p>;
}

function overviewSummary(snapshot?: DashboardSnapshot) {
  const orders = snapshot?.orders ?? [];
  const products = snapshot?.products ?? [];
  const stores = snapshot?.stores ?? [];
  const users = snapshot?.users ?? [];
  return {
    branchCount: stores.length,
    branchNames: stores.map((store) => String(store.name ?? store.city ?? "Cabang")).slice(0, 6),
    customerCount: users.length,
    lowStockCount: products.filter((product) => typeof product.stock === "number" && product.stock < 10).length,
    orderCount: orders.length,
    productCount: products.length,
    recentOrders: orders.slice(0, 5),
    totalSales: orders.reduce((sum, order) => sum + (typeof order.total === "number" ? order.total : 0), 0)
  };
}

function chartData(snapshot?: DashboardSnapshot) {
  const branches = (snapshot?.stores ?? []).map((store) => String(store.name ?? store.city ?? "Cabang")).slice(0, 4);
  const safeBranches = branches.length ? branches : ["Market Snap"];
  const orders = snapshot?.orders ?? [];
  const total = orders.reduce((sum, order) => sum + (typeof order.total === "number" ? order.total : 0), 0);
  return {
    branches: safeBranches,
    points: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((label, day) => ({
      label,
      values: safeBranches.map((_, index) => Math.round((total || 1200000) / safeBranches.length / 7 * (0.72 + index * 0.12 + day * 0.04)))
    }))
  };
}
