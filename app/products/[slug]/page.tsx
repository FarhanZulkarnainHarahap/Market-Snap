import { SnapProductPage } from "@/components/snap/SnapProductPage";
import type { Metadata } from "next";
import { apiUrl } from "@/lib/api-url";
import { siteConfig } from "@/lib/site-config";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

type PublicProduct = { id: string; slug?: string; name: string; description?: string; shortInfo?: string; price: number; unit: string; category: string; image?: string; primaryImage?: { url?: string } };

async function productData(slug: string): Promise<PublicProduct | null> {
  try {
    const response = await fetch(apiUrl(`/products/${encodeURIComponent(slug)}`), { next: { revalidate: 300 } });
    if (!response.ok) return null;
    const payload = await response.json() as { data?: PublicProduct };
    return payload.data ?? null;
  } catch { return null; }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productData(slug);
  if (!product) return { title: "Produk tidak ditemukan", robots: { index: false, follow: false } };
  const canonical = `/products/${product.slug || slug}`;
  const description = product.shortInfo || product.description || `${product.name} tersedia melalui Market Snap.`;
  const image = product.primaryImage?.url || product.image || "/brand/og-image.svg";
  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: { title: product.name, description, type: "website", url: canonical, images: [image] },
    twitter: { card: "summary_large_image", title: product.name, description, images: [image] }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productData(slug);
  const jsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortInfo || product.description,
    image: product.primaryImage?.url || product.image,
    category: product.category,
    offers: { "@type": "Offer", priceCurrency: "IDR", price: product.price, url: `${siteConfig.siteUrl}/products/${product.slug || slug}`, availability: "https://schema.org/InStock" }
  } : null;
  return <>{jsonLd && <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} type="application/ld+json" />}<SnapProductPage productId={slug} /></>;
}
