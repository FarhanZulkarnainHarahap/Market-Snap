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
  slug?: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  image: string;
  images: ProductImage[];
  discount?: string;
  badge?: string;
  stockByStore: Record<string, number>;
};

export type ProductImage = {
  alt: string;
  id: string;
  position: number;
  url: string;
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
  recipientName?: string;
  phone?: string;
  detail: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  note?: string;
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
  shippingCost?: number;
  serviceFee?: number;
  discountTotal?: number;
  voucherCode?: string;
  shippingMethod?: string;
  shippingProvider?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  paymentMethod?: string;
  paymentProvider?: string;
  paymentChannel?: string;
  paymentStatus?: string;
  paymentRedirectUrl?: string;
  paymentInvoiceUrl?: string;
  trackingNumber?: string;
  courierName?: string;
  estimatedArrival?: string;
  addressSnapshot?: Record<string, unknown>;
  createdAt: string;
  items: OrderItemSummary[];
  histories?: OrderStatusHistory[];
};

export type OrderStatusHistory = {
  id: string;
  status: string;
  description?: string;
  location?: string;
  createdAt: string;
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

export type CheckoutOption = {
  id: string;
  label: string;
  description: string;
  eta?: string;
  cost?: number;
  requiresAddress?: boolean;
  provider?: string;
  channel?: string;
};

export type OrderStatistics = {
  averageOrderValue: number;
  cancelledOrders: number;
  completedOrders: number;
  monthlyOrders: Array<{ label: string; value: number }>;
  monthlySpending: Array<{ label: string; value: number }>;
  ordersByStatus: Array<{ label: string; value: number }>;
  productsByCategory: Array<{ label: string; value: number }>;
  totalOrders: number;
  totalSavings: number;
  totalSpent: number;
};
