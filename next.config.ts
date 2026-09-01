import type { NextConfig } from "next";

const apiBaseUrl = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL ?? "https://api-node.market-snap.web.id");

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' ${apiBaseUrl} https://*.ingest.sentry.io; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests` },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
      ]
    }];
  },
  async redirects() {
    return [
      {
        source: "/dashboard/customer",
        destination: "/",
        permanent: false
      },
      {
        source: "/dashboard/customer/catalog",
        destination: "/catalog",
        permanent: false
      },
      {
        source: "/dashboard/customer/cart",
        destination: "/cart",
        permanent: false
      },
      {
        source: "/dashboard/customer/checkout",
        destination: "/checkout",
        permanent: false
      },
      {
        source: "/dashboard/customer/checkout/payment/:orderId",
        destination: "/checkout/payment/:orderId",
        permanent: false
      },
      {
        source: "/dashboard/customer/checkout/success/:orderId",
        destination: "/checkout/success/:orderId",
        permanent: false
      },
      {
        source: "/dashboard/customer/about",
        destination: "/about",
        permanent: false
      },
      {
        source: "/dashboard/customer/contact",
        destination: "/contact",
        permanent: false
      },
      {
        source: "/dashboard/customer/contact-us",
        destination: "/contact",
        permanent: false
      },
      {
        source: "/dashboard/customer/product/:slug",
        destination: "/products/:slug",
        permanent: false
      },
      {
        source: "/dashboard/customer/products/:slug",
        destination: "/products/:slug",
        permanent: false
      },
      {
        source: "/dashboard/customer/profile",
        destination: "/profile",
        permanent: false
      },
      {
        source: "/dashboard/customer/profile/:path*",
        destination: "/profile/:path*",
        permanent: false
      },
      {
        source: "/dashboard/customer/tracking",
        destination: "/tracking",
        permanent: false
      },
      {
        source: "/dashboard/customer/tracking/:orderId",
        destination: "/tracking/:orderId",
        permanent: false
      },
      {
        source: "/product/:slug",
        destination: "/products/:slug",
        permanent: false
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: false
      },
      {
        source: "/my-orders",
        destination: "/profile/orders",
        permanent: false
      },
      {
        source: "/notifications",
        destination: "/profile/notifications",
        permanent: false
      },
      {
        source: "/admin",
        destination: "/dashboard/super-admin",
        permanent: false
      },
      {
        source: "/admin/:path*",
        destination: "/dashboard/super-admin/:path*",
        permanent: false
      },
      {
        source: "/admin-store",
        destination: "/dashboard/store-admin",
        permanent: false
      },
      {
        source: "/admin-store/:path*",
        destination: "/dashboard/store-admin/:path*",
        permanent: false
      },
      {
        source: "/adminStore",
        destination: "/dashboard/store-admin",
        permanent: false
      },
      {
        source: "/adminStore/:path*",
        destination: "/dashboard/store-admin/:path*",
        permanent: false
      },
      {
        source: "/dashboard/admin",
        destination: "/dashboard/super-admin",
        permanent: false
      },
      {
        source: "/dashboard/admin/:path*",
        destination: "/dashboard/super-admin/:path*",
        permanent: false
      },
      {
        source: "/dashboard/admin-store",
        destination: "/dashboard/store-admin",
        permanent: false
      },
      {
        source: "/dashboard/admin-store/:path*",
        destination: "/dashboard/store-admin/:path*",
        permanent: false
      },
      {
        source: "/super-admin",
        destination: "/dashboard/super-admin",
        permanent: false
      },
      {
        source: "/super-admin/:path*",
        destination: "/dashboard/super-admin/:path*",
        permanent: false
      },
      {
        source: "/store-admin",
        destination: "/dashboard/store-admin",
        permanent: false
      },
      {
        source: "/store-admin/:path*",
        destination: "/dashboard/store-admin/:path*",
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
          source: "/catalog",
          destination: "/dashboard/customer/catalog"
        },
        {
          source: "/cart",
          destination: "/dashboard/customer/cart"
        },
        {
          source: "/checkout",
          destination: "/dashboard/customer/checkout"
        },
        {
          source: "/checkout/payment/:orderId",
          destination: "/dashboard/customer/checkout/payment/:orderId"
        },
        {
          source: "/checkout/success/:orderId",
          destination: "/dashboard/customer/checkout/success/:orderId"
        },
        {
          source: "/about",
          destination: "/dashboard/customer/about"
        },
        {
          source: "/contact",
          destination: "/dashboard/customer/contact"
        },
        {
          source: "/products/:slug",
          destination: "/dashboard/customer/product/:slug"
        },
        {
          source: "/profile",
          destination: "/dashboard/customer/profile"
        },
        {
          source: "/profile/:path*",
          destination: "/dashboard/customer/profile/:path*"
        },
        {
          source: "/tracking",
          destination: "/dashboard/customer/tracking"
        },
        {
          source: "/tracking/:orderId",
          destination: "/dashboard/customer/tracking/:orderId"
        },
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
          destination: "/profile"
        },
        {
          source: "/account/profile",
          destination: "/profile"
        },
        {
          source: "/account/address",
          destination: "/profile/addresses"
        },
        {
          source: "/account/orders",
          destination: "/profile/orders"
        },
        {
          source: "/account/notifications",
          destination: "/profile/notifications"
        },
        {
          source: "/account/vouchers",
          destination: "/profile/vouchers"
        },
        {
          source: "/account/payment",
          destination: "/profile/payment-methods"
        },
        {
          source: "/account/security",
          destination: "/profile/security"
        },
        {
          source: "/account/help-center",
          destination: "/profile/help-center"
        },
        {
          source: "/dashboard/super-admin/:path*",
          destination: "/super-admin/:path*"
        },
        {
          source: "/dashboard/store-admin/:path*",
          destination: "/store-admin/:path*"
        }
      ]
    };
  }
};

export default nextConfig;

function normalizeApiBase(value: string): string {
  return value.trim().replace(/\/+$/, "").replace(/\/api$/, "");
}
