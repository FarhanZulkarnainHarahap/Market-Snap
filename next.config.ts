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
        source: "/",
        destination: "/dashboard/customer",
        permanent: false
      },
      {
        source: "/catalog",
        destination: "/dashboard/customer/catalog",
        permanent: false
      },
      {
        source: "/cart",
        destination: "/dashboard/customer/cart",
        permanent: false
      },
      {
        source: "/checkout",
        destination: "/dashboard/customer/checkout",
        permanent: false
      },
      {
        source: "/about",
        destination: "/dashboard/customer/about",
        permanent: false
      },
      {
        source: "/contact",
        destination: "/dashboard/customer/contact",
        permanent: false
      },
      {
        source: "/contact-us",
        destination: "/dashboard/customer/contact",
        permanent: false
      },
      {
        source: "/product/:slug",
        destination: "/dashboard/customer/product/:slug",
        permanent: false
      },
      {
        source: "/profile",
        destination: "/dashboard/customer/profile",
        permanent: false
      },
      {
        source: "/profile/:path*",
        destination: "/dashboard/customer/profile/:path*",
        permanent: false
      },
      {
        source: "/my-orders",
        destination: "/dashboard/customer/profile/orders",
        permanent: false
      },
      {
        source: "/notifications",
        destination: "/dashboard/customer/profile/notifications",
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
          destination: "/dashboard/customer/profile/addresses"
        },
        {
          source: "/account/orders",
          destination: "/dashboard/customer/profile/orders"
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
          destination: "/dashboard/customer/profile/payment-methods"
        },
        {
          source: "/account/security",
          destination: "/dashboard/customer/profile/security"
        },
        {
          source: "/account/help-center",
          destination: "/dashboard/customer/profile/help-center"
        }
      ]
    };
  }
};

export default nextConfig;

function normalizeApiBase(value: string): string {
  return value.trim().replace(/\/+$/, "").replace(/\/api$/, "");
}
