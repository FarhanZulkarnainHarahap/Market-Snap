import type { MetadataRoute } from "next";
import { apiUrl } from "@/lib/api-url";
import { siteConfig } from "@/lib/site-config";

type SitemapProduct = { slug?: string; id: string; updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ["", "/catalog", "/about", "/contact", "/terms", "/privacy", "/shipping-policy", "/refund-policy", "/cancellation-policy", "/payment-policy", "/cookie-policy"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    changeFrequency: path === "" || path === "/catalog" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.5
  }));
  try {
    const response = await fetch(apiUrl("/products?limit=100&inStock=true"), { next: { revalidate: 3600 } });
    if (!response.ok) return entries;
    const payload = await response.json() as { data?: SitemapProduct[] };
    for (const product of payload.data ?? []) {
      entries.push({
        url: `${siteConfig.siteUrl}/products/${encodeURIComponent(product.slug || product.id)}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
        changeFrequency: "daily",
        priority: 0.7
      });
    }
  } catch {}
  return entries;
}
