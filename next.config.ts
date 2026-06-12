import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/login",
        destination: "/auth/login"
      },
      {
        source: "/register",
        destination: "/auth/register"
      },
      {
        source: "/admin",
        destination: "/dashboard/admin"
      },
      {
        source: "/admin/:path*",
        destination: "/dashboard/admin/:path*"
      },
      {
        source: "/admin-store",
        destination: "/dashboard/admin-store"
      },
      {
        source: "/admin-store/:path*",
        destination: "/dashboard/admin-store/:path*"
      },
      {
        source: "/adminStore",
        destination: "/dashboard/admin-store"
      },
      {
        source: "/adminStore/:path*",
        destination: "/dashboard/admin-store/:path*"
      },
      {
        source: "/customer",
        destination: "/dashboard/customer"
      },
      {
        source: "/customer/:path*",
        destination: "/dashboard/customer/:path*"
      }
    ];
  }
};

export default nextConfig;
