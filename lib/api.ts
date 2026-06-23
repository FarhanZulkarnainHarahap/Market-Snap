import type { ApiAddress, ApiCartItem, ApiProduct, ApiStore, ApiUser, ApiVoucher, CartResponse, CreateOrderOptions, CreateOrderResponse, LoginResponse, ProductsResponse, RegisterResponse } from "./api-contracts";
import { apiUrl } from "./api-url";
import type { Address, CartItem, Product, Store, Voucher } from "./types";

export async function loginUser(email: string, password: string) {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Login gagal"));
  const payload = await response.json() as LoginResponse;
  saveSession(payload);
  return payload;
}

export function googleAuthUrl() {
  return apiUrl("/auth/google");
}

export function facebookAuthUrl() {
  return apiUrl("/auth/facebook");
}

export async function registerUser(payload: { name: string; email: string; password: string; referralCode?: string }) {
  const response = await fetch(apiUrl("/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Registrasi gagal"));
  return response.json() as Promise<RegisterResponse>;
}

export async function fetchCurrentUser() {
  const response = await fetch(apiUrl("/auth/me"), { headers: currentUserHeaders(), cache: "no-store" });
  if (!response.ok) throw new Error(await responseMessage(response, "Profil belum dapat dimuat"));
  const payload = await response.json() as { data: ApiUser };
  return payload.data;
}

export function saveSession(payload: LoginResponse) {
  const role = webRole(payload.user.role);
  document.cookie = `market-snap-role=${role}; path=/; max-age=86400; SameSite=Lax`;
  window.localStorage.setItem("market-snap-token", payload.token);
  window.localStorage.setItem("market-snap-user-id", payload.user.id);
  window.localStorage.setItem("market-snap-user-name", payload.user.name);
  window.localStorage.setItem("market-snap-user-email", payload.user.email);
  window.localStorage.setItem("market-snap-role", role);
}

export function currentUserHeaders(): Record<string, string> {
  const token = currentToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type WebRole = "admin" | "adminStore" | "customer";

export function webRole(role: ApiUser["role"]): WebRole {
  const normalized = String(role).toLowerCase();
  if (normalized === "super_admin" || normalized === "admin") return "admin";
  if (normalized === "store_admin") return "adminStore";
  return "customer";
}

function currentToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("market-snap-token") ?? "";
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(apiUrl("/categories"));
  if (!response.ok) throw new Error("Gagal memuat kategori");
  const payload = await response.json() as { data: string[] };
  return ["Semua", ...payload.data];
}

export async function fetchProducts(params: URLSearchParams) {
  const response = await fetch(apiUrl(`/products?${params.toString()}`));
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

export async function fetchStores(): Promise<Store[]> {
  const response = await fetch(apiUrl("/stores"), { cache: "no-store" });
  if (!response.ok) throw new Error("Gagal memuat cabang");
  const payload = await response.json() as { data: ApiStore[] };
  return payload.data.map(mapStore);
}

export async function fetchNearestStore(params: URLSearchParams = new URLSearchParams()) {
  const response = await fetch(apiUrl(`/stores/nearest?${params.toString()}`), { cache: "no-store" });
  if (!response.ok) throw new Error("Gagal memuat cabang terdekat");
  const payload = await response.json() as { store: ApiStore; serviceable: boolean; inRange?: boolean };
  return { store: mapStore(payload.store), serviceable: payload.serviceable ?? payload.inRange ?? true };
}

export async function fetchProductDetail(productId: string, params: URLSearchParams = new URLSearchParams()) {
  const response = await fetch(apiUrl(`/products/${productId}?${params.toString()}`), { cache: "no-store" });
  if (!response.ok) throw new Error(await responseMessage(response, "Produk tidak ditemukan"));
  const payload = await response.json() as { data: ApiProduct; store: ApiStore };
  const store = mapStore(payload.store);
  return { product: mapProduct(payload.data, store.id), store };
}

export async function fetchCart() {
  const response = await fetch(apiUrl("/cart"), { headers: currentUserHeaders(), cache: "no-store" });
  if (!response.ok) throw new Error("Gagal memuat cart");
  const payload = await response.json() as CartResponse;
  return { items: payload.data.map(mapCartItem), summary: payload.summary };
}

export async function fetchAddresses(): Promise<Address[]> {
  const response = await fetch(apiUrl("/addresses"), { headers: currentUserHeaders(), cache: "no-store" });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal memuat alamat"));
  const payload = await response.json() as { data: ApiAddress[] };
  return payload.data.map(mapAddress);
}

export async function fetchVouchers(): Promise<Voucher[]> {
  const response = await fetch(apiUrl("/vouchers"), { cache: "no-store" });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal memuat voucher"));
  const payload = await response.json() as { data: ApiVoucher[] };
  return payload.data.map(mapVoucher);
}

export async function addCartItem(productId: string, storeId: string, quantity = 1) {
  const response = await fetch(apiUrl("/cart"), {
    method: "POST",
    headers: { ...currentUserHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ productId, storeId, quantity })
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal menambahkan cart"));
  const payload = await response.json() as { data: ApiCartItem };
  return mapCartItem(payload.data);
}

export async function updateCartItem(cartId: string, quantity: number) {
  const response = await fetch(apiUrl(`/cart/${cartId}`), {
    method: "PATCH",
    headers: { ...currentUserHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ quantity })
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal update cart"));
  const payload = await response.json() as { data: ApiCartItem };
  return mapCartItem(payload.data);
}

export async function deleteCartItem(cartId: string) {
  const response = await fetch(apiUrl(`/cart/${cartId}`), { method: "DELETE", headers: currentUserHeaders() });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal hapus cart"));
}

export async function clearCart() {
  const response = await fetch(apiUrl("/cart"), { method: "DELETE", headers: currentUserHeaders() });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal kosongkan cart"));
}

export async function createOrderFromCart(items: CartItem[], total: number, options: CreateOrderOptions = {}) {
  const response = await fetch(apiUrl("/orders"), {
    method: "POST",
    headers: { ...currentUserHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      total,
      items: items.map((item) => ({ productId: item.productId ?? item.id, quantity: item.quantity, price: item.price })),
      location: options.location ?? { lat: -6.2608, lng: 106.8107 },
      courier: options.courier,
      destinationId: options.destinationId,
      paymentMethod: options.paymentMethod
    })
  });
  if (!response.ok) throw new Error(await responseMessage(response, "Gagal membuat order"));
  return response.json() as Promise<CreateOrderResponse>;
}

function mapStore(store: ApiStore): Store {
  return {
    id: store.id,
    name: store.name,
    area: store.city,
    lat: store.lat,
    lng: store.lng,
    radiusKm: store.radiusKm,
    eta: store.distanceKm ? `${Math.max(12, Math.round(store.distanceKm * 3))} min` : "18-28 min",
    distanceKm: store.distanceKm
  };
}

function mapProduct(product: ApiProduct, storeId: string): Product {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    unit: product.unit,
    description: product.description,
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

function mapAddress(address: ApiAddress): Address {
  return {
    id: address.id,
    label: address.label,
    detail: address.detail,
    lat: address.latitude,
    lng: address.longitude,
    isPrimary: address.isPrimary
  };
}

function mapVoucher(voucher: ApiVoucher): Voucher {
  return {
    id: voucher.id,
    code: voucher.code,
    title: voucher.title,
    scope: String(voucher.scope).toLowerCase() as Voucher["scope"],
    type: String(voucher.type).toLowerCase() as Voucher["type"],
    value: voucher.value,
    minSpend: voucher.minSpend ?? 0,
    maxDiscount: voucher.maxDiscount ?? 0,
    expiresAt: voucher.expiresAt
  };
}

function fallbackProduct(productId: string): ApiProduct {
  return { id: productId, name: "Produk", category: "Grocery", price: 0, unit: "item", image: "/product.png", discount: null, organic: false, stock: 0 };
}

async function responseMessage(response: Response, fallback: string) {
  const payload = await response.json().catch(() => null) as { message?: string } | null;
  return payload?.message ?? fallback;
}
