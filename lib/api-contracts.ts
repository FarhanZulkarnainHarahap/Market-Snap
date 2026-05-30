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

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin" | "store_admin";
};

export type LoginResponse = {
  token: string;
  user: ApiUser;
};

export type CreateOrderOptions = {
  courier?: string;
  destinationId?: string;
  paymentMethod?: "manual_transfer" | "xendit";
};

export type CreateOrderResponse = {
  data: { id: string; status: string };
  payment?: { invoiceUrl?: string | null; method: string };
  shipping?: { cost: number; provider: string };
};
