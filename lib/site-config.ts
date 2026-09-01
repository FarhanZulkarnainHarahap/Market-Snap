const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME?.trim() || "Market Snap",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME?.trim() || "Market Snap (Demo)",
  siteUrl: configuredUrl || "https://market-snap.web.id",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@example.com",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || "+62 000 0000 0000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS?.trim() || "Alamat bisnis belum dikonfigurasi",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false"
} as const;

export const legalUpdatedAt = "1 September 2026";

export function whatsappUrl() {
  return siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp}` : "";
}
