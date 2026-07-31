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
  slug?: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
  image: string;
  images?: ApiProductImage[];
  primaryImage?: ApiProductImage;
  discount: string | null;
  organic: boolean;
  stock: number;
};

export type ApiProductImage = {
  alt?: string;
  altText?: string;
  id?: string;
  position?: number;
  url: string;
};

export type ProductsResponse = {
  data: ApiProduct[];
  store: ApiStore;
  serviceable: boolean;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type ApiCartItem = {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  product?: ApiProduct;
  inventory?: { availableStock: number; status: "IN_STOCK" | "OUT_OF_STOCK" | string };
  store?: { id: string; name: string; address?: string; city?: string; isOpen?: boolean };
  stock: number;
  unitPrice?: number;
  subtotal: number;
};

export type ApiCartData = {
  id: string | null;
  store: { id: string; name: string; address?: string; city?: string; isOpen?: boolean } | null;
  items: ApiCartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  estimatedShipping: number;
  total: number;
};

export type CartResponse = {
  success?: boolean;
  data: ApiCartItem[] | ApiCartData;
  summary?: { totalItems: number; total: number };
};

export type ApiAddress = {
  id: string;
  label: string;
  recipientName?: string | null;
  phone?: string | null;
  detail: string;
  district?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  note?: string | null;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  authProvider?: string;
  canEditAvatar?: boolean;
  createdAt?: string;
  role: "customer" | "super_admin" | "store_admin" | "CUSTOMER" | "SUPER_ADMIN" | "STORE_ADMIN";
  verified?: boolean;
};

export type ApiNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  referenceId?: string | null;
  referenceType?: string | null;
  isRead: boolean;
  createdAt: string;
};

export type ApiStoreAdminRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type ApiStoreAdminRequest = {
  id: string;
  user: ApiUser;
  requestedStore?: ApiStore | null;
  assignedStore?: ApiStore | null;
  reviewedBy?: ApiUser | null;
  reason: string;
  experience?: string | null;
  status: ApiStoreAdminRequestStatus;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
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
  shippingCost?: number;
  serviceFee?: number;
  discountTotal?: number;
  voucherCode?: string | null;
  shippingMethod?: string | null;
  shippingProvider?: string | null;
  deliveryDate?: string | null;
  deliverySlot?: string | null;
  paymentMethod?: string | null;
  paymentChannel?: string | null;
  paymentInvoiceUrl?: string | null;
  trackingNumber?: string | null;
  courierName?: string | null;
  estimatedArrival?: string | null;
  orderNote?: string | null;
  addressSnapshot?: Record<string, unknown> | null;
  createdAt: string;
  items?: ApiOrderItem[];
  histories?: ApiOrderStatusHistory[];
};

export type ApiOrderStatusHistory = {
  id: string;
  status: string;
  description?: string | null;
  location?: string | null;
  createdAt: string;
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
  addressId?: string;
  courier?: string;
  destinationId?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  location?: { lat: number; lng: number };
  orderNote?: string;
  paymentChannel?: string;
  paymentMethod?: "midtrans";
  selectedCartItemIds?: string[];
  shippingMethod?: string;
  storeId?: string;
  voucherCode?: string;
};

export type CreateOrderResponse = {
  data: { id: string; status: string };
  payment?: { invoiceUrl?: string | null; method: string };
  shipping?: { cost: number; provider: string };
};

export type CheckoutOptionsResponse = {
  data: {
    paymentMethods: Array<{ id: string; label: string; provider: string; channel: string; description: string }>;
    shippingMethods: Array<{ id: string; label: string; description: string; eta: string; cost: number; requiresAddress: boolean }>;
  };
};

export type VoucherValidationResponse = {
  data: {
    discount: number;
    subtotal: number;
    totalAfterDiscount: number;
    voucher: ApiVoucher;
  };
  message: string;
};

export type OrderStatisticsResponse = {
  data: {
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
};
