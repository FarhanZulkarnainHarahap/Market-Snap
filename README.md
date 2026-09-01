<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:052e16,45:16a34a,100:facc15&height=210&section=header&text=Market%20Snap%20Web&fontColor=ffffff&fontSize=46&fontAlignY=34&desc=Fresh%20Grocery%20Commerce%20Experience&descAlignY=54&descSize=17&animation=twinkling" alt="Market Snap Web animated banner" />

  <img src="./public/market-snap.png" width="108" alt="Market Snap logo" />

  <br />
  <br />

  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=23&duration=2200&pause=700&color=15803D&center=true&vCenter=true&width=820&lines=Mobile-first+online+grocery+web+app;Nearest+branch+product+discovery;JWT+role-based+customer+and+admin+dashboards;RajaOngkir+shipping+and+Xendit+checkout" alt="Market Snap animated typing intro" />

  <p>
    A mobile-first grocery commerce frontend with role-based dashboards, location-aware product discovery, cart checkout, RajaOngkir shipping, and Xendit payment handoff.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2-111827?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=111827" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vercel-ready-000000?style=for-the-badge&logo=vercel" alt="Vercel ready" />
  </p>

  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:f7fee7,50:dcfce7,100:fef08a&height=3&section=footer" alt="Market Snap animated divider" />
</div>

## Overview

Market Snap Web adalah frontend untuk aplikasi online grocery berbasis cabang toko. Customer melihat produk dari toko terdekat, mengelola cart, membuat order, memilih kurir, dan diarahkan ke invoice pembayaran. Admin dan admin store memiliki dashboard terpisah untuk operasional toko, produk, order, diskon, inventory, dan laporan.

Project ini dibuat sebagai repo frontend terpisah dan terhubung ke Market Snap API melalui `NEXT_PUBLIC_API_URL`.

> Production handover: salin `.env.example`, isi identitas bisnis milik pembeli, lalu baca `SECURITY.md`, `THIRD_PARTY_NOTICES.md`, `docs/DEPLOYMENT.md`, `docs/PWA_SEO.md`, `docs/TROUBLESHOOTING.md`, dan `docs/HANDOVER_CHECKLIST.md`. Mode demo aktif secara default agar source code tidak mengarang identitas atau statistik bisnis.

## Table of Contents

- [Preview Assets](#preview-assets)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Available Scripts](#available-scripts)
- [Deploy to Vercel](#deploy-to-vercel)
- [Production Checklist](#production-checklist)

## Preview Assets

<div align="center">
  <img src="./public/product.png" width="130" alt="Product asset" />
  <img src="./public/coupon.png" width="130" alt="Coupon asset" />
  <img src="./public/discount-product.png" width="130" alt="Discount product asset" />
  <img src="./public/pineapple.png" width="130" alt="Pineapple asset" />
</div>

## Features

### Customer

- Mobile-first grocery landing page with hero, category, promo, nearest store, and product sections.
- Location-aware catalog powered by the backend nearest-store API.
- Product listing, product detail, store detail, and stock visibility by selected branch.
- Guest cart persisten di browser, merge ke cart akun setelah login/OAuth, dan secure HttpOnly session untuk fitur akun.
- Checkout form with RajaOngkir destination ID, courier selection, and payment method.
- Xendit payment redirect when the API returns `payment.redirectUrl`.
- Customer profile, address page, checkout page, and order tracking pages.

### Admin

- Protected admin dashboard for `admin` and `super_admin`.
- Store management, product management, category page, inventory report, user list, and store admin creation page.
- API-backed create forms for admin resources.

### Admin Store

- Protected dashboard for `store_admin`.
- Store product view, category view, discount management, inventory management, order management, and assigned store page.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js App Router |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 and custom CSS modules |
| Routing Guard | Next proxy |
| State | React hooks and local storage |
| API | Market Snap Express API |
| Deployment | Vercel |

## User Roles

Login response dari API menentukan dashboard tujuan user. JWT sesi hanya berada di cookie HttpOnly milik API; local storage menyimpan profil non-sensitif untuk tampilan, sedangkan cookie `market-snap-role` dipakai sebagai guard UI optimistis. Semua otorisasi sensitif tetap diverifikasi backend.

| API Role | Web Role | Redirect |
| --- | --- | --- |
| `user` | `customer` | `/dashboard/customer` |
| `admin` | `admin` | `/dashboard/admin` |
| `super_admin` | `admin` | `/dashboard/admin` |
| `store_admin` | `adminStore` | `/dashboard/adminStore` |

## Project Structure

```txt
web
├── app
│   ├── dashboard
│   │   ├── admin
│   │   ├── adminStore
│   │   └── customer
│   ├── login
│   ├── register
│   ├── favicon.ico
│   ├── globals.css
│   ├── icon.png
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── dashboard
│   └── forms
├── lib
│   ├── api-contracts.ts
│   ├── api.ts
│   ├── dashboard-api.ts
│   └── types.ts
├── public
├── scripts
├── styles
├── proxy.ts
├── package.json
└── vercel.json
```

## Getting Started

Clone the repository and install dependencies.

```bash
npm install
```

Run the development server.

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

If port `3000` is already used:

```bash
npm run dev -- -p 3200
```

## Environment Variables

Create `.env.local` in the web project and point `NEXT_PUBLIC_API_URL` to your Market Snap API base URL. In production, set the same variable in Vercel and make sure the API `WEB_ORIGIN` matches the deployed web domain.

## API Integration

Main frontend helpers:

| File | Responsibility |
| --- | --- |
| `lib/api.ts` | Auth, catalog, cart, and checkout API client |
| `lib/api-contracts.ts` | API response and request contracts |
| `lib/dashboard-api.ts` | Dashboard snapshot fetcher |

Protected browser requests use the API session cookie with `credentials: "include"`.

```txt
Cookie: market_snap_session=<httpOnly>
```

### Checkout Payload

`/dashboard/customer/cart` creates an order by sending this payload to `POST /orders`:

```json
{
  "total": 150000,
  "destinationId": "41068",
  "courier": "jne",
  "paymentMethod": "xendit",
  "location": { "lat": -6.2608, "lng": 106.8107 },
  "items": [
    { "productId": "PRODUCT_ID", "quantity": 2, "price": 50000 }
  ]
}
```

Expected API behavior:

- Use `location` to select the nearest branch.
- Use `destinationId` and `courier` to calculate shipping through RajaOngkir.
- Use `paymentMethod: "xendit"` to create a Xendit payment link.
- Return `payment.redirectUrl` so the web can redirect the customer to payment.

## Available Scripts

```bash
npm run dev      # Start local development server
npm run build    # Build production assets
npm run start    # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript without emitting files
npm test         # Run unit tests
npm run test:e2e # Run Playwright route/E2E smoke tests after build
```

## Local Brand Assets

Market Snap keeps stable local assets under `public/brand`, `public/banners`, `public/categories`, `public/products`, `public/illustrations`, and `public/placeholders`.

Regenerate the SVG asset set after changing seed product/category names:

```bash
node scripts/generate-market-assets.mjs
```

## Deploy to Vercel

This folder can be deployed as a standalone frontend repository.

1. Push the `web` folder contents to a GitHub repository, for example `market-snap-web`.
2. Import the repository in Vercel.
3. Use the `Next.js` framework preset.
4. Set install command to `npm install`.
5. Set build command to `npm run build`.
6. Add `NEXT_PUBLIC_API_URL` in Vercel Environment Variables.
7. Deploy the API first, then use the API deployment URL in this web project.

## Production Checklist

- `NEXT_PUBLIC_API_URL` points to the deployed API domain.
- API `WEB_ORIGIN` points to the deployed web domain.
- API has valid `JWT_SECRET`, database URL, RajaOngkir key, and Xendit key.
- Customer, admin, and store admin accounts exist in the database.
- Product, store, inventory, and category data exist before testing checkout.
- Vercel build passes with `npm run build`.

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:facc15,100:14532d&height=110&section=footer" alt="Market Snap footer wave" />
</div>
