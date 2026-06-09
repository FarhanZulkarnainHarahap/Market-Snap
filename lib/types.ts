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

export type OrderStatus =
  | "Menunggu Pembayaran"
  | "Menunggu Konfirmasi Pembayaran"
  | "Diproses"
  | "Dikirim"
  | "Pesanan Dikonfirmasi"
  | "Dibatalkan";
