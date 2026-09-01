import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/catalog", "/contact", "/products/", "/terms", "/privacy", "/shipping-policy", "/refund-policy", "/cancellation-policy", "/payment-policy", "/cookie-policy"],
      disallow: ["/api/", "/auth/", "/cart", "/checkout", "/dashboard/", "/payment/", "/profile/", "/store-admin/", "/super-admin/", "/tracking/"]
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl
  };
}
