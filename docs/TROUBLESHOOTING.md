# Troubleshooting

- Cart guest hilang: periksa localStorage `market-snap-guest-cart-v1`, quota browser, dan mode private.
- Cart tidak tergabung: pastikan login cookie valid dan endpoint `/cart/items` dapat diakses; item gagal stok tetap dipertahankan agar tidak hilang diam-diam.
- OAuth putih/error: callback backend harus menuju `/auth/callback`; periksa state cookie dan CORS/cookie HTTPS.
- Build metadata gagal: pastikan API publik dapat diakses atau biarkan fallback metadata/noindex; sitemap tetap mengembalikan static URLs.
- PWA tidak installable: jalankan production build melalui HTTPS, verifikasi icon PNG, manifest, service worker, dan DevTools Application.
- Payment return pending: frontend sengaja membaca status backend; tunggu webhook atau rekonsiliasi, jangan mengubah UI menjadi paid secara lokal.
