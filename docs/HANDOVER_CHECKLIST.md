# Buyer Handover Checklist

- [ ] Ganti nama legal, kontak, alamat, social link, logo, dan asset yang lisensinya belum dibuktikan.
- [ ] Minta penasihat hukum meninjau LICENSE dan seluruh halaman legal.
- [ ] Buat database, email, upload, ongkir, OAuth, Sentry, dan akun Xendit milik pembeli.
- [ ] Rotasi seluruh secret; jangan mewarisi credential penjual.
- [ ] Jalankan migration dari database kosong dan seed hanya di demo/development.
- [ ] Buat super admin production melalui prosedur terkontrol, bukan password seed.
- [ ] Jalankan test/lint/type-check/build kedua repo dan simpan hasil CI.
- [ ] Uji RBAC customer/store-admin/super-admin, IDOR order/invoice, guest cart, voucher, stok, serta webhook duplicate/out-of-order.
- [ ] Uji backup/restore dan rollback artifact.
- [ ] Verifikasi domain, HTTPS, CORS, CSP, cookie, legal, SEO, PWA, Lighthouse, accessibility, dan monitoring.
- [ ] Lakukan Xendit sandbox penuh; live smoke payment hanya dengan izin pemilik.
