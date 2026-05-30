import type { CartItem, Product, Store } from "./types";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4100/api";

type ApiStore = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  radiusKm: number;
  distanceKm?: number;
};

type ApiProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  discount: string | null;
  organic: boolean;
  stock: number;
};

type ProductsResponse = {
  data: ApiProduct[];
  store: ApiStore;
  serviceable: boolean;
};

type ApiCartItem = {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  product?: ApiProduct;
  stock: number;
  subtotal: number;
};

type CartResponse = {
  data: ApiCartItem[];
  summary: { totalItems: number; total: number };
};

const customerHeaders = { "x-user-id": "u-user" };

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${apiBase}/categories`);
  if (!response.ok) throw new Error("Gagal memuat kategori");
  const payload = await response.json() as { data: string[] };
  return ["Semua", ...payload.data];
}

export async function fetchProducts(params: URLSearchParams) {
  const response = await fetch(`${apiBase}/products?${params.toString()}`);
  if (!response.ok) throw new Error("Gagal memuat produk");
  const payload = await response.json() as ProductsResponse;
  const store = mapStore(payload.store);
  return {
    products: payload.data.map((product) => mapProduct(product, store.id)),
    store,
    serviceable: payload.serviceable,
    distanceKm: payload.store.distanceKm ?? 0
  };
}

export async function fetchCart() {
  const response = await fetch(`${apiBase}/cart`, { headers: customerHeaders, cache: "no-store" });
  if (!response.ok) throw new Error("Gagal memuat cart");
  const payload = await response.json() as CartResponse;
  return { items: payload.data.map(mapCartItem), summary: payload.summary };
}

export async function addCartItem(productId: string, storeId: string, quantity = 1) {
  const response = await fetch(`${apiBase}/cart`, {
    method: "POST",
    headers: { ...customerHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ productId, storeId, quantity })
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal menambahkan cart"));
  const payload = await response.json() as { data: ApiCartItem };
  return mapCartItem(payload.data);
}

export async function updateCartItem(cartId: string, quantity: number) {
  const response = await fetch(`${apiBase}/cart/${cartId}`, {
    method: "PATCH",
    headers: { ...customerHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ quantity })
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal update cart"));
  const payload = await response.json() as { data: ApiCartItem };
  return mapCartItem(payload.data);
}

export async function deleteCartItem(cartId: string) {
  const response = await fetch(`${apiBase}/cart/${cartId}`, { method: "DELETE", headers: customerHeaders });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal hapus cart"));
}

export async function clearCart() {
  const response = await fetch(`${apiBase}/cart`, { method: "DELETE", headers: customerHeaders });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal kosongkan cart"));
}

export async function createOrderFromCart(items: CartItem[], total: number) {
  const response = await fetch(`${apiBase}/orders`, {
    method: "POST",
    headers: { ...customerHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      total,
      items: items.map((item) => ({ productId: item.productId ?? item.id, quantity: item.quantity, price: item.price })),
      location: { lat: -6.2608, lng: 106.8107 }
    })
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal membuat order"));
  return response.json() as Promise<{ data: { id: string; status: string } }>;
}

function mapStore(store: ApiStore): Store {
  return {
    id: store.id,
    name: store.name,
    area: store.city,
    lat: store.lat,
    lng: store.lng,
    radiusKm: store.radiusKm,
    eta: store.distanceKm ? `${Math.max(12, Math.round(store.distanceKm * 3))} min` : "18-28 min"
  };
}

function mapProduct(product: ApiProduct, storeId: string): Product {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    unit: product.unit,
    image: product.image,
    discount: product.discount ?? undefined,
    badge: product.organic ? "Pilihan" : undefined,
    stockByStore: { [storeId]: product.stock }
  };
}

function mapCartItem(item: ApiCartItem): CartItem {
  const product = item.product ?? fallbackProduct(item.productId);
  return {
    ...mapProduct({ ...product, stock: item.stock }, item.storeId),
    id: item.id,
    cartId: item.id,
    productId: item.productId,
    storeId: item.storeId,
    quantity: item.quantity,
    stock: item.stock,
    subtotal: item.subtotal
  };
}

function fallbackProduct(productId: string): ApiProduct {
  return { id: productId, name: "Produk", category: "Grocery", price: 0, unit: "item", image: "/product.png", discount: null, organic: false, stock: 0 };
}

async function responseMessage(response: Response, fallback: string) {
  const payload = await response.json().catch(() => null) as { message?: string } | null;
  return payload?.message ?? fallback;
}
