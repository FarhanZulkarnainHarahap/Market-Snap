<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:14532d,100:facc15&height=180&section=header&text=Market%20Snap%20Web&fontColor=ffffff&fontSize=42&animation=twinkling&fontAlignY=36" alt="Market Snap Web banner" />

  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=22&duration=2600&pause=800&color=15803D&center=true&vCenter=true&width=820&lines=Fresh+Grocery+Shopping+Experience;Customer+%2B+Admin+%2B+Admin+Store+Dashboard;Connected+to+Market+Snap+Express+API" alt="Typing animation" />

  <p>
    <img src="./public/market-snap.png" width="96" alt="Market Snap logo" />
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-111827?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=111827" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/TypeScript-ready-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

## About

Market Snap Web adalah frontend mobile-first untuk online grocery web app. Aplikasi ini menampilkan landing page grocery, login/register, middleware role, dan dashboard untuk `customer`, `admin`, serta `adminStore`.

Web ini terhubung ke Market Snap API melalui `NEXT_PUBLIC_API_URL`.

## Preview Theme

<div align="center">
  <img src="./public/product.png" width="140" alt="Product icon" />
  <img src="./public/coupon.png" width="140" alt="Coupon icon" />
  <img src="./public/discount-product.png" width="140" alt="Discount product icon" />
  <img src="./public/pineapple.png" width="140" alt="Pineapple icon" />
</div>

## Main Features

- Landing page grocery dengan hero, promo, kategori, toko terdekat, dan product list.
- Location-based product display dari API Express.
- Login demo dengan role `customer`, `admin`, dan `adminStore`.
- Middleware route guard untuk dashboard role.
- Customer dashboard: catalog, cart, checkout, address, orders, product detail, store detail.
- Admin dashboard: store, product, category, inventory report, user, store admin.
- Admin Store dashboard: product, category, discount, inventory, manage order, store detail.
- Favicon dan asset grocery Market Snap.
- Siap deploy Vercel sebagai repo web terpisah.

## Tech Stack

| Area | Stack |
| --- | --- |
| Framework | Next.js App Router |
| UI | React |
| Styling | Tailwind CSS + custom CSS |
| Language | TypeScript |
| State | React hooks + local storage |
| API | Market Snap Express API |

## Folder Structure

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
│   └── dashboard
├── lib
├── public
├── scripts
├── styles
├── middleware.ts
├── package.json
└── vercel.json
```

## Getting Started

```bash
npm install
npm run dev
```

Default URL:

```txt
http://localhost:3000
```

Jika port `3000` penuh:

```bash
npm run dev -- -p 3200
```

Untuk connect ke API lokal:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:4100/api npm run dev -- -p 3200
```

## Environment

Buat file `.env.local`.

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:4100/api
```

Untuk production Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-market-snap-api.vercel.app/api
```

## Scripts

```bash
npm run dev      # start development server
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

## Demo Login Roles

Login page menyimpan cookie `market-snap-role` untuk middleware.

| Web Role | Dashboard | API Demo User |
| --- | --- | --- |
| `customer` | `/dashboard/customer` | `u-user` |
| `admin` | `/dashboard/admin` | `u-super` |
| `adminStore` | `/dashboard/adminStore` | `u-store-1` |

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page, location request, nearest store, products, promo |
| `/login` | Demo login by role |
| `/register` | Registration page |
| `/dashboard/customer` | Customer dashboard |
| `/dashboard/customer/catalog` | Customer product catalog |
| `/dashboard/customer/cart` | Shopping cart |
| `/dashboard/customer/checkout` | Checkout and shipping address |
| `/dashboard/customer/my-orders` | Customer order tracking |
| `/dashboard/customer/profile` | Customer profile |
| `/dashboard/customer/profile/address` | Customer address management |
| `/dashboard/customer/product/[productId]` | Product detail |
| `/dashboard/customer/product-store/[storeId]` | Store detail |
| `/dashboard/admin` | Super admin dashboard |
| `/dashboard/admin/store` | Store management |
| `/dashboard/admin/product` | Product management |
| `/dashboard/admin/product/create` | Create product |
| `/dashboard/admin/category` | Category management |
| `/dashboard/admin/user` | User management |
| `/dashboard/admin/user-store` | Store admin management |
| `/dashboard/admin/inventory-history` | Inventory report |
| `/dashboard/adminStore` | Store admin dashboard |
| `/dashboard/adminStore/product` | Store product list |
| `/dashboard/adminStore/category` | Store category list |
| `/dashboard/adminStore/discount` | Discount management |
| `/dashboard/adminStore/inventory-management` | Inventory management |
| `/dashboard/adminStore/manage-order` | Order management |
| `/dashboard/adminStore/store` | Assigned store |

## API Connection

Dashboard pages memakai helper:

```txt
lib/dashboard-api.ts
```

Landing page product list memakai:

```txt
lib/api.ts
```

Saat API tidak aktif, beberapa halaman tetap menampilkan fallback data agar UI bisa dilihat.

## Deploy to Vercel

Folder `web` bisa dijadikan repository GitHub terpisah.

1. Push isi folder `web` ke repo, misalnya `market-snap-web`.
2. Import repo web di Vercel.
3. Framework preset: `Next.js`.
4. Install command: `npm install`.
5. Build command: `npm run build`.
6. Tambahkan Environment Variable:

```env
NEXT_PUBLIC_API_URL=https://your-market-snap-api.vercel.app/api
```

Pastikan API sudah deploy lebih dulu, lalu isi `NEXT_PUBLIC_API_URL` dengan domain API Vercel.

## Design Notes

- Visual mobile-first bertema grocery hijau.
- Header dua tingkat untuk navigasi cepat.
- Promo card memakai warna hijau, kuning, cyan, dan putih.
- Product card menampilkan stok, badge, harga, dan diskon.
- Dashboard memakai layout ringkas supaya mudah dibaca customer, admin, dan store admin.

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:facc15,100:14532d&height=110&section=footer" alt="footer wave" />
</div>
