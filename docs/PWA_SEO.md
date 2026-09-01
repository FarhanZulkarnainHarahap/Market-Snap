# SEO dan PWA

`NEXT_PUBLIC_SITE_URL` harus canonical origin production tanpa trailing slash. `robots.ts` memblokir route privat, `sitemap.ts` memuat halaman publik dan produk aktif, dan halaman produk menghasilkan metadata server-side serta Product JSON-LD.

Manifest menyediakan icon 192/512/maskable. Service worker hanya cache shell/asset publik; route auth, cart, checkout, dashboard, payment, profile, tracking, dan API tidak diintersepsi. Setiap release mengubah `CACHE_NAME` bila asset shell berubah signifikan. Uji `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, installability, offline fallback, update worker, dan Lighthouse homepage/catalog/product.
