import { NextResponse, type NextRequest } from "next/server";

const roleHome = {
  customer: "/dashboard/customer",
  admin: "/dashboard/admin",
  adminStore: "/dashboard/adminStore"
} as const;

type Role = keyof typeof roleHome;

export function middleware(request: NextRequest) {
  const role = request.cookies.get("market-snap-role")?.value as Role | undefined;
  const path = request.nextUrl.pathname;

  if (path === "/dashboard") {
    return redirect(request, role ? roleHome[role] : "/login");
  }

  if (path.startsWith("/dashboard/customer")) return guard(request, role, "customer");
  if (path.startsWith("/dashboard/adminStore")) return guard(request, role, "adminStore");
  if (path.startsWith("/dashboard/admin")) return guard(request, role, "admin");

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};

function guard(request: NextRequest, role: Role | undefined, expected: Role) {
  if (!role) return redirect(request, "/login");
  if (role !== expected) return redirect(request, roleHome[role]);
  return NextResponse.next();
}

function redirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}
