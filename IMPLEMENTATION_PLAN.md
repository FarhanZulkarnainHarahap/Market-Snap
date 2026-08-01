# Market Snap Implementation Plan

## Audit Baseline

- [x] Read frontend and backend structure.
- [x] Read README, AGENTS, CLAUDE, package scripts, env examples, Prisma schema, API client, route guards, active customer components.
- [x] Verified active homepage uses `CustomerHomePage` from `web/components/snap`.
- [x] Ran baseline frontend lint.
- [x] Ran baseline frontend build.
- [x] Ran baseline backend build.
- [x] Ran baseline backend payment test.
- [x] Checked production web HTTP response.
- [x] Checked production API health, stores, categories, and products response.

## Phase 1 - Stabilization

- [x] Keep public customer routes mapped to `/`, `/catalog`, `/products/:slug`, `/cart`, `/checkout`, `/profile`.
- [x] Preserve Xendit redirect handling through `payment.redirectUrl` or `payment.invoiceUrl`.
- [x] Preserve backend role/object authorization on order/payment reads.
- [x] Improve catalog URL state, debounce, and API-backed filter parameters.
- [ ] Full browser console and network audit with Playwright across all critical flows.
- [ ] Auth cookie hardening review beyond current `credentials: "include"` flow.

## Phase 2 - Design System and Assets

- [x] Added local organized public asset folders.
- [x] Generated local brand, category, banner, illustration, placeholder, and product SVG assets.
- [x] Added 20 category assets.
- [x] Added 87 product assets, one per seed product.
- [x] Extended customer header with announcement, search, wishlist, notification, cart, location, and mobile drawer.
- [x] Added richer homepage sections powered by API data.
- [ ] Replace all legacy/public remote product images in production data after migration + seed deployment.
- [ ] Add raster WebP/AVIF variants for final production asset pipeline.

## Phase 3 - Customer Experience

- [x] Homepage now includes quick categories, product rails, promo banner, shopping flow, PWA/voucher CTA, loading and error copy.
- [x] Product cards now include brand/SKU, stock status, discount indicator, stable CTA, and quick-add feedback.
- [x] Product detail now shows SKU, brand, weight, storage info, gallery, stock, and related products.
- [x] Cart and checkout were audited and already include selected items, vouchers, address handling, schedule, shipping method, and Xendit handoff.
- [ ] Mini cart drawer.
- [ ] True wishlist API and UI.
- [ ] Recently viewed and buy-again persistence.

## Phase 4 - Dashboard

- [x] Existing customer, store-admin, and super-admin route inventory audited.
- [ ] Full dashboard table feature parity review.
- [ ] Homepage banner/section admin UI.
- [ ] Audit log UI.

## Phase 5 - Backend and Data

- [x] Added product merchandising fields: SKU, brand, short info, storage info, weight, active status.
- [x] Added migration for product merchandising fields.
- [x] Updated catalog API to return merchandising fields and hide inactive products.
- [x] Updated product create/update controller to write merchandising fields.
- [x] Expanded seed to 20 categories and 87 realistic products.
- [ ] Add `Brand`, `Banner`, `Campaign`, and `HomepageSection` models only with full controller/UI implementation.
- [ ] Add request ID middleware and structured API envelope across all endpoints.

## Phase 6 - Verification

- [x] `api npm run prisma:generate`
- [x] `api npm run build`
- [x] `api npm test`
- [x] `web npm run lint`
- [x] `web npm run build`
- [x] Local dev smoke test for `/`, `/catalog`, and `/products/:slug` using production API.
- [ ] Apply product metadata migration to configured remote database after explicit approval.
- [ ] Full checkout with real Xendit test credentials.
- [ ] RajaOngkir live quote with valid API key.
