import { NextResponse, type NextRequest } from "next/server";

const roleHome = {
  customer: "/",
  admin: "/super-admin",
  adminStore: "/store-admin"
} as const;

type Role = keyof typeof roleHome;

export function proxy(request: NextRequest) {
  const role = request.cookies.get("market-snap-role")?.value as Role | undefined;
  const path = request.nextUrl.pathname;

  if (path === "/login") return redirect(request, "/auth/login");
  if (path === "/register") return redirect(request, "/auth/register");
  if (path.startsWith("/account")) return redirectLegacyAccount(request, role);
  if (path === "/dashboard") return redirect(request, role ? roleHome[role] : "/auth/login");
  if (path === "/admin" || path.startsWith("/admin/")) return redirect(request, "/super-admin");
  if (path === "/admin-store" || path === "/adminStore" || path.startsWith("/admin-store/") || path.startsWith("/adminStore/")) return redirect(request, "/store-admin");
  if (path.startsWith("/super-admin")) return guard(request, role, "admin");
  if (path.startsWith("/store-admin")) return guard(request, role, "adminStore");
  if (path.startsWith("/dashboard/customer")) return guard(request, role, "customer");
  if (path.startsWith("/dashboard/admin-store")) return guard(request, role, "adminStore");
  if (path.startsWith("/dashboard/admin")) return guard(request, role, "admin");
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/admin-store/:path*", "/adminStore/:path*", "/dashboard/:path*", "/login", "/register", "/store-admin/:path*", "/super-admin/:path*"]
};

function guard(request: NextRequest, role: Role | undefined, expected: Role) {
  if (!role) return redirect(request, "/auth/login");
  if (role !== expected) return redirect(request, roleHome[role]);
  return NextResponse.next();
}

function redirectLegacyAccount(request: NextRequest, role: Role | undefined) {
  if (!role) return redirect(request, "/auth/login");
  if (role !== "customer") return redirect(request, roleHome[role]);

  const path = request.nextUrl.pathname;
  const accountMap: Record<string, string> = {
    "/account/address": "/dashboard/customer/profile/address",
    "/account/help-center": "/dashboard/customer/profile/help-center",
    "/account/notifications": "/dashboard/customer/profile/notifications",
    "/account/orders": "/dashboard/customer/my-orders",
    "/account/profile": "/dashboard/customer/profile",
    "/account/security": "/dashboard/customer/profile/security",
    "/account/vouchers": "/dashboard/customer/profile/vouchers"
  };

  return redirect(request, accountMap[path] ?? "/dashboard/customer/profile");
}

function redirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}
