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

  if (path === "/dashboard") return redirect(request, role ? roleHome[role] : "/login");
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
  matcher: ["/admin/:path*", "/admin-store/:path*", "/adminStore/:path*", "/dashboard/:path*", "/store-admin/:path*", "/super-admin/:path*"]
};

function guard(request: NextRequest, role: Role | undefined, expected: Role) {
  if (!role) return redirect(request, "/login");
  if (role !== expected) return redirect(request, roleHome[role]);
  return NextResponse.next();
}

function redirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}
