export type Store = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  radiusKm: number;
  eta: string;
  distanceKm?: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  image: string;
  discount?: string;
  badge?: string;
  stockByStore: Record<string, number>;
};

export type CartItem = Product & {
  cartId?: string;
  productId?: string;
  storeId?: string;
  quantity: number;
  stock?: number;
  subtotal?: number;
};

export type Address = {
  id: string;
  label: string;
  detail: string;
  lat: number;
  lng: number;
  isPrimary: boolean;
};

export type OrderItemSummary = {
  id: string;
  image: string;
  name: string;
  price: number;
  productId: string;
  quantity: number;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItemSummary[];
};

export type Voucher = {
  id: string;
  code: string;
  title: string;
  scope: "cart" | "shipping" | "product";
  type: "percentage" | "nominal";
  value: number;
  minSpend: number;
  maxDiscount: number;
  expiresAt: string;
};

export type OrderStatus =
  | "Menunggu Pembayaran"
  | "Menunggu Konfirmasi Pembayaran"
  | "Diproses"
  | "Dikirim"
  | "Pesanan Dikonfirmasi"
  | "Dibatalkan";
