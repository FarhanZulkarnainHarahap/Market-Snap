import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/customer",
        destination: "/",
        permanent: false
      },
      {
        source: "/dashboard/customer/:path*",
        destination: "/:path*",
        permanent: false
      },
      {
        source: "/profile",
        destination: "/account/profile",
        permanent: false
      },
      {
        source: "/profile/:path*",
        destination: "/account/:path*",
        permanent: false
      },
      {
        source: "/my-orders",
        destination: "/account/orders",
        permanent: false
      }
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/dashboard/customer"
        }
      ],
      afterFiles: [
        {
          source: "/login",
          destination: "/auth/login"
        },
        {
          source: "/register",
          destination: "/auth/register"
        },
        {
          source: "/account",
          destination: "/dashboard/customer/profile"
        },
        {
          source: "/account/profile",
          destination: "/dashboard/customer/profile"
        },
        {
          source: "/account/address",
          destination: "/dashboard/customer/profile/address"
        },
        {
          source: "/account/orders",
          destination: "/dashboard/customer/my-orders"
        },
        {
          source: "/account/notifications",
          destination: "/dashboard/customer/profile/notifications"
        },
        {
          source: "/account/vouchers",
          destination: "/dashboard/customer/profile/vouchers"
        },
        {
          source: "/account/payment",
          destination: "/dashboard/customer/profile/payment"
        },
        {
          source: "/account/security",
          destination: "/dashboard/customer/profile/security"
        },
        {
          source: "/account/help-center",
          destination: "/dashboard/customer/profile/help-center"
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
          source: "/:path*",
          destination: "/dashboard/customer/:path*"
        }
      ]
    };
  }
};

export default nextConfig;
