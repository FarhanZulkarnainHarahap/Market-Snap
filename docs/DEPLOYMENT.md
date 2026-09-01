# Deployment Frontend

Gunakan Node.js 20+, `npm ci`, `npm test`, `npm run lint`, `npx tsc --noEmit`, lalu `npm run build`. Isi seluruh variabel `.env.example`; identitas kosong memunculkan placeholder profesional dan mode demo, bukan data bisnis fiktif.

Deploy API lebih dahulu. Pastikan `NEXT_PUBLIC_API_URL` menuju origin API, `NEXT_PUBLIC_SITE_URL` menuju canonical frontend, dan API `WEB_ORIGIN` memuat frontend yang sama. Setelah deploy periksa headers/CSP, cookie session, OAuth, guest-cart merge, checkout sandbox, payment return, legal routes, robots/sitemap/manifest/icon/service worker, mobile 320 px, keyboard, dan console error.
