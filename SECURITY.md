# Security Policy

Laporkan vulnerability secara privat ke alamat keamanan operator. Jangan memasukkan credential, data akun, token OAuth, OTP, atau data payment ke issue publik.

Frontend tidak menyimpan access/refresh token di localStorage. Cookie auth dimiliki API dan HttpOnly; data browser hanya profil tampilan, preferensi lokasi, guest cart, serta selection checkout. Service worker tidak menangani route auth, cart, checkout, dashboard, payment, profile, atau tracking.

Sebelum production, uji CSP, CORS, cookie lintas-origin, safe payment redirect, noindex route privat, dependency advisory, dan kebocoran source map/log.
