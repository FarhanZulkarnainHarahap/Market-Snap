import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "./providers";
import { PwaRegistration } from "@/components/PwaRegistration";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: "Market Snap", template: "%s | Market Snap" },
  description: "Online grocery web app dengan toko terdekat, stok cabang, promo, dan order tracking.",
  applicationName: "Market Snap",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Market Snap",
    title: "Market Snap",
    description: "Belanja grocery dari cabang terdekat dengan stok dan status pesanan yang transparan.",
    images: [{ url: "/brand/og-image.svg", width: 1200, height: 630, alt: "Market Snap" }]
  },
  twitter: { card: "summary_large_image", title: "Market Snap", description: "Grocery dari cabang terdekat.", images: ["/brand/og-image.svg"] },
  icons: { apple: "/brand/apple-touch-icon.svg", icon: "/market-snap-favicon-transparent.png" }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
        <PwaRegistration />
        <div id="main-content"><AppProviders>{children}</AppProviders></div>
      </body>
    </html>
  );
}
