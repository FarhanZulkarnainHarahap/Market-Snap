"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ManagementHeader } from "./ManagementHeader";
import { SnapHeader } from "../snap/SnapCommon";
import { fetchDashboardSnapshot, type DashboardRecord, type DashboardRole } from "../../lib/dashboard-api";
import { rupiah } from "../../lib/format";
import { readStaleCache, writeStaleCache } from "../../lib/stale-cache";

type FeatureResource = "products" | "categories" | "stores" | "orders" | "users" | "discounts" | "addresses" | "reports";

type FeaturePageProps = {
  role: DashboardRole;
  active: string;
  eyebrow: string;
  title: string;
  description: string;
  resource: FeatureResource;
  actions?: { label: string; href: string }[];
  detailId?: string;
};

export function DashboardFeaturePage(props: FeaturePageProps) {
  const cacheKey = useMemo(() => `dashboard:${props.role}:${props.resource}:${props.detailId ?? "all"}`, [props.detailId, props.resource, props.role]);
  const [rows, setRows] = useState<DashboardRecord[]>(() => readStaleCache<DashboardRecord[]>(cacheKey) ?? []);
  const [loading, setLoading] = useState(() => !readStaleCache<DashboardRecord[]>(cacheKey));
  const [refreshing, setRefreshing] = useState(() => Boolean(readStaleCache<DashboardRecord[]>(cacheKey)));

  useEffect(() => {
    let mounted = true;
    fetchDashboardSnapshot(props.role).then((snapshot) => {
      const data = snapshot[props.resource];
      if (mounted) {
        setRows(data);
        writeStaleCache(cacheKey, data, 1000 * 60);
      }
    }).finally(() => {
      if (mounted) {
        setLoading(false);
        setRefreshing(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [cacheKey, props.resource, props.role]);

  const visibleRows = useMemo(() => {
    if (!props.detailId) return rows.slice(0, 8);
    return rows.filter((row) => Object.values(row).some((value) => String(value) === props.detailId)).slice(0, 8);
  }, [props.detailId, rows]);

  return (
    <>
      <DashboardHeader active={props.active} role={props.role} />
      <main className="dashboard-shell">
        <section className="page-heading dashboard-heading">
          <span className="mini-label">{props.eyebrow}</span>
          <h1>{props.title}</h1>
          <p>{props.description}</p>
          <span className="status-pill">{loading ? "Memuat data..." : refreshing ? "Memperbarui data..." : "Data terbaru"}</span>
        </section>
        {props.actions?.length ? (
          <nav className="dashboard-actions" aria-label="Aksi halaman">
            {props.actions.map((action) => <Link key={action.href} href={action.href}>{action.label}</Link>)}
          </nav>
        ) : null}
        <section className="metric-grid">
          <Metric label="Total data" value={visibleRows.length} />
          <Metric label="Status" value={loading ? "Memuat" : "Aktif"} />
          <Metric label="Akses" value={roleLabel(props.role)} />
          <Metric label="Area" value={resourceLabel(props.resource)} />
        </section>
        <section className="admin-workspace">
          <article className="admin-panel dashboard-table">
            <h2>{props.title}</h2>
            {visibleRows.length ? visibleRows.map((row, index) => <DataRow key={index} row={row} />) : <p>Data belum tersedia.</p>}
          </article>
          <article className="admin-panel">
            <h2>Ringkasan</h2>
            <p className="muted-copy">{summaryText(props.resource)}</p>
            <DataRow row={{ area: resourceLabel(props.resource), akses: roleLabel(props.role), status: loading ? "Memuat" : "Siap digunakan" }} />
          </article>
        </section>
      </main>
    </>
  );
}

function DashboardHeader({ active, role }: { active: string; role: DashboardRole }) {
  if (role === "admin" || role === "adminStore") return <ManagementHeader role={role} />;
  return <SnapHeader active={snapActive(active)} />;
}

function snapActive(active: string): "home" | "catalog" | "about" | "contact" {
  if (active === "catalog") return "catalog";
  if (active === "about") return "about";
  if (active === "contact") return "contact";
  return "home";
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong></article>;
}

function DataRow({ row }: { row: DashboardRecord }) {
  const entries = Object.entries(row).filter(([, value]) => value !== undefined).slice(0, 4);
  const label = String(row.name ?? row.title ?? row.label ?? row.id ?? row.key ?? "Market Snap");
  return (
    <div className="admin-row dashboard-row">
      <span>{label}</span>
      <strong>{entries.map(([key, value]) => `${key}: ${formatValue(value)}`).join(" / ")}</strong>
    </div>
  );
}

function formatValue(value: DashboardRecord[string]) {
  if (typeof value === "number" && value > 999) return rupiah(value);
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  return String(value ?? "-");
}

function roleLabel(role: DashboardRole) {
  return role === "adminStore" ? "Store Admin" : role === "admin" ? "Super Admin" : "Customer";
}

function resourceLabel(resource: FeatureResource) {
  const labels: Record<FeatureResource, string> = {
    products: "Produk",
    categories: "Kategori",
    stores: "Cabang",
    orders: "Pesanan",
    users: "Pengguna",
    discounts: "Promo",
    addresses: "Alamat",
    reports: "Laporan"
  };
  return labels[resource];
}

function summaryText(resource: FeatureResource) {
  return `${resourceLabel(resource)} dapat dipantau dan dikelola dari halaman ini. Gunakan menu yang tersedia untuk melanjutkan pekerjaan.`;
}
