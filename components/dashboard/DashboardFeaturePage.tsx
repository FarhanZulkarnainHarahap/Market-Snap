"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArchive, FiBox, FiCheckCircle, FiDatabase, FiHome, FiPackage, FiPieChart, FiShoppingCart, FiTrendingUp, FiUsers } from "react-icons/fi";
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
  const management = props.role === "admin" || props.role === "adminStore";
  const stats = managementStats(props.resource, visibleRows, loading, props.role);

  return (
    <>
      <DashboardHeader active={props.active} role={props.role} />
      <main className={`dashboard-shell${management ? " management-content" : ""}`}>
        <section className="page-heading dashboard-heading management-hero">
          <div>
            <span className="mini-label">{props.eyebrow}</span>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
            <span className="status-pill">{loading ? "Memuat data..." : refreshing ? "Memperbarui data..." : "Data terbaru"}</span>
            {props.actions?.length ? (
              <nav className="dashboard-actions" aria-label="Aksi halaman">
                {props.actions.map((action) => <Link key={action.href} href={action.href}>{action.label}</Link>)}
              </nav>
            ) : null}
          </div>
          {management ? (
            <aside className="management-hero-card">
              <Image alt="" height={210} priority src={resourceImage(props.resource)} width={300} />
              <strong>{resourceLabel(props.resource)} Market Snap</strong>
              <span>{visibleRows.length || "Real-time"} data aktif</span>
            </aside>
          ) : null}
        </section>
        <section className={management ? "management-metric-grid" : "metric-grid"}>
          {stats.map((stat) => <Metric icon={stat.icon} key={stat.label} label={stat.label} tone={stat.tone} value={stat.value} />)}
        </section>
        <section className={management ? "management-workspace" : "admin-workspace"}>
          <article className="admin-panel dashboard-table management-table-card">
            <div className="management-panel-head">
              <div>
                <span>{resourceLabel(props.resource)}</span>
                <h2>{props.title}</h2>
              </div>
              <button type="button"><FiDatabase /> Export</button>
            </div>
            <div className="management-filter-row" aria-label="Filter cepat">
              <button className="active" type="button">Semua</button>
              <button type="button">Aktif</button>
              <button type="button">Terbaru</button>
              <button type="button">Butuh cek</button>
            </div>
            {visibleRows.length ? (
              <div className="management-record-list">
                {visibleRows.map((row, index) => <DataRow index={index} key={index} resource={props.resource} row={row} />)}
              </div>
            ) : <EmptyPanel resource={props.resource} />}
          </article>
          <article className="admin-panel management-insight-card">
            <Image alt="" height={180} src={resourceImage(props.resource)} width={260} />
            <span>Ringkasan</span>
            <h2>{resourceLabel(props.resource)} Overview</h2>
            <p className="muted-copy">{summaryText(props.resource)}</p>
            <div className="management-progress-list">
              <p><span>Data health</span><strong>{loading ? "Syncing" : "Ready"}</strong></p>
              <p><span>Role access</span><strong>{roleLabel(props.role)}</strong></p>
              <p><span>Last update</span><strong>{refreshing ? "Background" : "Live cache"}</strong></p>
            </div>
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

function Metric({ icon, label, tone, value }: { icon?: React.ReactNode; label: string; tone?: string; value: string | number }) {
  return <article className={`metric-card management-metric ${tone ?? ""}`}>{icon && <i>{icon}</i>}<span>{label}</span><strong>{value}</strong><small>Market Snap ops</small></article>;
}

function DataRow({ index, resource, row }: { index: number; resource: FeatureResource; row: DashboardRecord }) {
  const label = primaryLabel(row);
  const secondary = secondaryLabel(row, resource);
  const chips = detailChips(row).slice(0, 3);
  return (
    <div className="admin-row dashboard-row management-record">
      <Image alt="" height={54} src={recordImage(row, resource, index)} width={54} />
      <span><b>{label}</b><small>{secondary}</small></span>
      <strong>{chips.map(([key, value]) => <em key={key}>{humanKey(key)}: {formatValue(value)}</em>)}</strong>
      <mark>{statusText(row, resource)}</mark>
    </div>
  );
}

function EmptyPanel({ resource }: { resource: FeatureResource }) {
  return (
    <div className="management-empty-panel">
      <Image alt="" height={150} src={resourceImage(resource)} width={210} />
      <strong>Data {resourceLabel(resource).toLowerCase()} belum tersedia</strong>
      <span>Data cache akan muncul terlebih dahulu saat tersedia, lalu disegarkan di background.</span>
    </div>
  );
}

function formatValue(value: DashboardRecord[string]) {
  if (typeof value === "number" && value > 999) return rupiah(value);
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  const text = String(value ?? "-");
  return text.length > 34 ? `${text.slice(0, 31)}...` : text;
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

function managementStats(resource: FeatureResource, rows: DashboardRecord[], loading: boolean, role: DashboardRole) {
  return [
    { icon: iconFor(resource), label: "Total data", value: rows.length, tone: "green" },
    { icon: <FiCheckCircle />, label: "Status", value: loading ? "Memuat" : "Aktif", tone: "blue" },
    { icon: <FiUsers />, label: "Akses", value: roleLabel(role), tone: "mint" },
    { icon: <FiTrendingUp />, label: "Area", value: resourceLabel(resource), tone: "orange" }
  ];
}

function iconFor(resource: FeatureResource) {
  const icons: Record<FeatureResource, React.ReactNode> = {
    products: <FiPackage />,
    categories: <FiArchive />,
    stores: <FiHome />,
    orders: <FiShoppingCart />,
    users: <FiUsers />,
    discounts: <FiPieChart />,
    addresses: <FiHome />,
    reports: <FiTrendingUp />
  };
  return icons[resource] ?? <FiBox />;
}

function primaryLabel(row: DashboardRecord) {
  return readString(row, ["name", "title", "orderNumber", "email", "code", "label", "key"]) ?? `Market Snap ${shortId(readString(row, ["id"]) ?? "data")}`;
}

function secondaryLabel(row: DashboardRecord, resource: FeatureResource) {
  return readString(row, ["category", "city", "status", "role", "scope", "storeId", "email"]) ?? summaryText(resource);
}

function statusText(row: DashboardRecord, resource: FeatureResource) {
  return readString(row, ["status", "isActive", "verified", "type"]) ?? (resource === "orders" ? "Tracked" : "Active");
}

function detailChips(row: DashboardRecord) {
  const blocked = new Set(["id", "name", "title", "label", "key", "image", "imageUrl", "avatarUrl", "url", "description"]);
  return Object.entries(row).filter(([key, value]) => value !== undefined && value !== null && !blocked.has(key));
}

function humanKey(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function shortId(value: string) {
  return value.length > 12 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value;
}

function readString(row: DashboardRecord, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
  }
  return undefined;
}

function recordImage(row: DashboardRecord, resource: FeatureResource, index: number) {
  const src = readString(row, ["image", "imageUrl", "avatarUrl", "url"]);
  if (src?.startsWith("http") || src?.startsWith("/")) return src;
  const fallbacks = [resourceImage(resource), "/product.png", "/coupon.png", "/pineapple.png"];
  return fallbacks[index % fallbacks.length];
}

function resourceImage(resource: FeatureResource) {
  const images: Record<FeatureResource, string> = {
    products: "/product.png",
    categories: "/pineapple.png",
    stores: "/market-snap-storefront-v2.png",
    orders: "/discount-product.png",
    users: "/market-snap-favicon-transparent.png",
    discounts: "/coupon.png",
    addresses: "/market-snap-storefront-v2.png",
    reports: "/market-snap-hero-v2.png"
  };
  return images[resource];
}
