import { NextResponse, type NextRequest } from "next/server";

const roleHome = {
  customer: "/",
  admin: "/dashboard/super-admin",
  adminStore: "/dashboard/store-admin"
} as const;

type Role = keyof typeof roleHome;

export function proxy(request: NextRequest) {
  const role = request.cookies.get("market-snap-role")?.value as Role | undefined;
  const path = request.nextUrl.pathname;

  if (path === "/login") return redirect(request, "/auth/login");
  if (path === "/register") return redirect(request, "/auth/register");
  if (isPublicCustomerPath(path)) return NextResponse.next();
  if (path.startsWith("/account")) return redirectLegacyAccount(request, role);
  if (isLegacyCustomerPath(path)) return redirectLegacyCustomer(request, role);
  if (isProtectedCustomerPath(path)) return guard(request, role, "customer");
  if (path === "/dashboard") return redirect(request, role ? roleHome[role] : "/auth/login");
  if (path === "/admin" || path.startsWith("/admin/")) return redirect(request, "/dashboard/super-admin");
  if (path === "/admin-store" || path === "/adminStore" || path.startsWith("/admin-store/") || path.startsWith("/adminStore/")) return redirect(request, "/dashboard/store-admin");
  if (path.startsWith("/super-admin")) return redirect(request, path.replace("/super-admin", "/dashboard/super-admin"));
  if (path.startsWith("/store-admin")) return redirect(request, path.replace("/store-admin", "/dashboard/store-admin"));
  if (path.startsWith("/dashboard/super-admin")) return guard(request, role, "admin");
  if (path.startsWith("/dashboard/store-admin")) return guard(request, role, "adminStore");
  if (path.startsWith("/dashboard/admin-store")) return redirect(request, path.replace("/dashboard/admin-store", "/dashboard/store-admin"));
  if (path.startsWith("/dashboard/admin")) return redirect(request, path.replace("/dashboard/admin", "/dashboard/super-admin"));
  if (path.startsWith("/dashboard/customer")) return guard(request, role, "customer");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/account/:path*",
    "/admin/:path*",
    "/admin-store/:path*",
    "/adminStore/:path*",
    "/cart",
    "/catalog",
    "/checkout",
    "/contact",
    "/contact-us",
    "/dashboard/:path*",
    "/login",
    "/my-orders",
    "/notifications",
    "/product/:path*",
    "/products/:path*",
    "/profile/:path*",
    "/register",
    "/store-admin/:path*",
    "/super-admin/:path*"
  ]
};

function guard(request: NextRequest, role: Role | undefined, expected: Role) {
  if (!role) return redirect(request, "/auth/login");
  if (role !== expected) return redirect(request, `/auth/unauthorized?from=${encodeURIComponent(request.nextUrl.pathname)}`);
  return NextResponse.next();
}

function redirectLegacyAccount(request: NextRequest, role: Role | undefined) {
  if (!role) return redirect(request, "/auth/login");
  if (role !== "customer") return redirect(request, roleHome[role]);

  const path = request.nextUrl.pathname;
  const accountMap: Record<string, string> = {
    "/account/address": "/profile/addresses",
    "/account/help-center": "/profile/help-center",
    "/account/notifications": "/profile/notifications",
    "/account/orders": "/profile/orders",
    "/account/payment": "/profile/payment-methods",
    "/account/profile": "/profile",
    "/account/security": "/profile/security",
    "/account/vouchers": "/profile/vouchers"
  };

  return redirect(request, accountMap[path] ?? "/profile");
}

function isLegacyCustomerPath(path: string) {
  return path === "/contact-us" ||
    path === "/my-orders" ||
    path === "/notifications" ||
    path.startsWith("/product/");
}

function isPublicCustomerPath(path: string) {
  return path === "/" ||
    path === "/about" ||
    path === "/cart" ||
    path === "/catalog" ||
    path === "/contact" ||
    path === "/dashboard/customer" ||
    path === "/dashboard/customer/about" ||
    path === "/dashboard/customer/catalog" ||
    path === "/dashboard/customer/contact" ||
    path.startsWith("/products/") ||
    path.startsWith("/dashboard/customer/product/") ||
    path.startsWith("/dashboard/customer/products/");
}

function isProtectedCustomerPath(path: string) {
  return path === "/checkout" ||
    path.startsWith("/checkout/") ||
    path === "/profile" ||
    path.startsWith("/profile/") ||
    path === "/tracking" ||
    path.startsWith("/tracking/");
}

function redirectLegacyCustomer(request: NextRequest, role: Role | undefined) {
  const path = request.nextUrl.pathname;
  if (path === "/contact-us") return redirect(request, "/contact");
  if (path.startsWith("/product/")) return redirect(request, path.replace("/product/", "/products/"));
  if (!role) return redirect(request, "/auth/login");
  if (role !== "customer") return redirect(request, `/auth/unauthorized?from=${encodeURIComponent(path)}`);
  if (path === "/my-orders") return redirect(request, "/profile/orders");
  if (path === "/notifications") return redirect(request, "/profile/notifications");
  return redirect(request, "/");
}

function redirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}
