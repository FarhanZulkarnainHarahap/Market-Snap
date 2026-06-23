export type ApiStore = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  radiusKm: number;
  distanceKm?: number;
};

export type ApiProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  image: string;
  discount: string | null;
  organic: boolean;
  stock: number;
};

export type ProductsResponse = {
  data: ApiProduct[];
  store: ApiStore;
  serviceable: boolean;
};

export type ApiCartItem = {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  product?: ApiProduct;
  stock: number;
  subtotal: number;
};

export type CartResponse = {
  data: ApiCartItem[];
  summary: { totalItems: number; total: number };
};

export type ApiAddress = {
  id: string;
  label: string;
  detail: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
  role: "user" | "admin" | "super_admin" | "store_admin" | "USER" | "ADMIN" | "SUPER_ADMIN" | "STORE_ADMIN";
};

export type ApiOrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: ApiProduct & { images?: { url: string }[] };
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items?: ApiOrderItem[];
};

export type ApiVoucher = {
  id: string;
  code: string;
  title: string;
  scope: "CART" | "SHIPPING" | "PRODUCT" | "cart" | "shipping" | "product";
  type: "PERCENTAGE" | "NOMINAL" | "percentage" | "nominal";
  value: number;
  minSpend?: number | null;
  maxDiscount?: number | null;
  expiresAt: string;
};

export type LoginResponse = {
  token: string;
  user: ApiUser;
};

export type RegisterResponse = {
  data: ApiUser;
  verificationExpiresInMinutes?: number;
};

export type CreateOrderOptions = {
  courier?: string;
  destinationId?: string;
  location?: { lat: number; lng: number };
  paymentMethod?: "manual_transfer" | "xendit";
};

export type CreateOrderResponse = {
  data: { id: string; status: string };
  payment?: { invoiceUrl?: string | null; method: string };
  shipping?: { cost: number; provider: string };
};
