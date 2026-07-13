import type { NextConfig } from "next";

const apiBaseUrl = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL ?? "https://api-node.market-snap.web.id");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
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
      },
      {
        source: "/admin",
        destination: "/super-admin",
        permanent: false
      },
      {
        source: "/admin/:path*",
        destination: "/super-admin",
        permanent: false
      },
      {
        source: "/admin-store",
        destination: "/store-admin",
        permanent: false
      },
      {
        source: "/admin-store/:path*",
        destination: "/store-admin",
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
        },
        {
          source: "/authjs/:path*",
          destination: `${apiBaseUrl}/authjs/:path*`
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
          source: "/:path*",
          destination: "/dashboard/customer/:path*"
        }
      ]
    };
  }
};

export default nextConfig;

function normalizeApiBase(value: string): string {
  return value.trim().replace(/\/+$/, "").replace(/\/api$/, "");
}
