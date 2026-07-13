import { apiUrl } from "./api-url";
import { apiFetch } from "./api";

export type DashboardRole = "customer" | "admin" | "adminStore";

export type DashboardRecord = Record<string, string | number | boolean | null | undefined>;

export type DashboardSnapshot = {
  products: DashboardRecord[];
  categories: DashboardRecord[];
  stores: DashboardRecord[];
  orders: DashboardRecord[];
  users: DashboardRecord[];
  discounts: DashboardRecord[];
  addresses: DashboardRecord[];
  reports: DashboardRecord[];
};

export async function fetchDashboardSnapshot(_role: DashboardRole): Promise<DashboardSnapshot> {
  void _role;
  const [products, categories, stores, orders, users, discounts, addresses, reports] = await Promise.all([
    fetchData("/products?limit=12"),
    fetchData("/categories"),
    fetchData("/admin/stores"),
    fetchData("/orders"),
    fetchData("/admin/users"),
    fetchData("/admin/discounts"),
    fetchData("/addresses"),
    fetchData("/admin/reports/sales")
  ]);

  return {
    products,
    categories: categories.map((name) => ({ name: String(name) })),
    stores,
    orders,
    users,
    discounts,
    addresses,
    reports
  };
}

async function fetchData(path: string, headers?: HeadersInit): Promise<DashboardRecord[]> {
  try {
    const response = await apiFetch(apiUrl(path), { headers, cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json() as { data?: unknown };
    return normalize(payload.data);
  } catch {
    return [];
  }
}

function normalize(data: unknown): DashboardRecord[] {
  if (Array.isArray(data)) return data.map(toRecord);
  if (data && typeof data === "object") return Object.entries(data).map(([key, value]) => toRecord({ key, value }));
  return [];
}

function toRecord(value: unknown): DashboardRecord {
  if (!value || typeof value !== "object") return { value: String(value ?? "-") };
  return value as DashboardRecord;
}
