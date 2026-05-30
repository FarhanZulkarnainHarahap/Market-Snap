"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Header } from "../Header";
import { fetchDashboardSnapshot, type DashboardRecord, type DashboardRole } from "../../lib/dashboard-api";
import { rupiah } from "../../lib/format";

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

const fallback: Record<FeatureResource, DashboardRecord[]> = {
  products: [
    { name: "Apel Fuji Snap Pack", category: "Buah", price: 42000, stock: 24 },
    { name: "Bayam Organik", category: "Sayur", price: 14000, stock: 19 }
  ],
  categories: [{ name: "Buah" }, { name: "Sayur" }, { name: "Dairy" }],
  stores: [{ name: "Market Snap Kemang", city: "Jakarta Selatan", radiusKm: 12 }],
  orders: [{ id: "ORD-260530-001", status: "Diproses", total: 223000 }],
  users: [{ name: "Naya Customer", email: "naya@marketsnap.test", role: "user" }],
  discounts: [{ title: "Referral Fresh Start", code: "SNAPWELCOME", value: 15 }],
  addresses: [{ label: "Rumah", detail: "Jl. Kemang Raya No. 12", isPrimary: true }],
  reports: [{ key: "totalSales", value: 223000 }, { key: "orders", value: 1 }]
};

export function DashboardFeaturePage(props: FeaturePageProps) {
  const [rows, setRows] = useState<DashboardRecord[]>(fallback[props.resource]);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchDashboardSnapshot(props.role).then((snapshot) => {
      const data = snapshot[props.resource];
      if (mounted && data.length) {
        setRows(data);
        setOnline(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [props.resource, props.role]);

  const visibleRows = useMemo(() => {
    if (!props.detailId) return rows.slice(0, 8);
    return rows.filter((row) => Object.values(row).some((value) => String(value) === props.detailId)).slice(0, 8);
  }, [props.detailId, rows]);

  return (
    <>
      <Header active={props.active} />
      <main className="dashboard-shell">
        <section className="page-heading dashboard-heading">
          <span className="mini-label">{props.eyebrow}</span>
          <h1>{props.title}</h1>
          <p>{props.description}</p>
          <span className={online ? "api-pill is-online" : "api-pill"}>{online ? "API connected" : "Fallback data"}</span>
        </section>
        {props.actions?.length ? (
          <nav className="dashboard-actions" aria-label="Aksi halaman">
            {props.actions.map((action) => <Link key={action.href} href={action.href}>{action.label}</Link>)}
          </nav>
        ) : null}
        <section className="metric-grid">
          <Metric label="Data tampil" value={visibleRows.length} />
          <Metric label="Source" value={online ? "API" : "Local"} />
          <Metric label="Role" value={roleLabel(props.role)} />
          <Metric label="Module" value={props.resource} />
        </section>
        <section className="admin-workspace">
          <article className="admin-panel dashboard-table">
            <h2>{props.title}</h2>
            {visibleRows.length ? visibleRows.map((row, index) => <DataRow key={index} row={row} />) : <p>Data belum tersedia.</p>}
          </article>
          <article className="admin-panel">
            <h2>Integrasi API</h2>
            <p className="muted-copy">Halaman ini membaca data dari API Express memakai Bearer token dari sesi login.</p>
            <DataRow row={{ endpoint: endpointLabel(props.resource), role: roleLabel(props.role) }} />
          </article>
        </section>
      </main>
    </>
  );
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
  return role === "adminStore" ? "Admin Store" : role === "admin" ? "Admin" : "Customer";
}

function endpointLabel(resource: FeatureResource) {
  const labels: Record<FeatureResource, string> = {
    products: "/products",
    categories: "/categories",
    stores: "/admin/stores",
    orders: "/orders",
    users: "/admin/users",
    discounts: "/admin/discounts",
    addresses: "/addresses",
    reports: "/admin/reports/sales"
  };
  return labels[resource];
}
