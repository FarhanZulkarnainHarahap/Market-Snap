const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4100/api";

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

export async function fetchDashboardSnapshot(role: DashboardRole): Promise<DashboardSnapshot> {
  const headers = authHeaders();
  const [products, categories, stores, orders, users, discounts, addresses, reports] = await Promise.all([
    fetchData("/products?limit=12"),
    fetchData("/categories"),
    fetchData("/admin/stores", headers),
    fetchData("/orders", headers),
    fetchData("/admin/users", headers),
    fetchData("/admin/discounts", headers),
    fetchData("/addresses", headers),
    fetchData("/admin/reports/sales", headers)
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

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("market-snap-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchData(path: string, headers?: HeadersInit): Promise<DashboardRecord[]> {
  try {
    const response = await fetch(`${apiBase}${path}`, { headers, cache: "no-store" });
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
