import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/", "/catalog", "/about", "/contact", "/terms", "/privacy", "/shipping-policy",
  "/refund-policy", "/cancellation-policy", "/payment-policy", "/cookie-policy", "/robots.txt",
  "/sitemap.xml", "/manifest.webmanifest", "/offline"
];

for (const route of publicRoutes) {
  test(`${route} returns a successful response`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status(), await response.text()).toBe(200);
  });
}

test("robots excludes private commerce routes", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Disallow: /checkout");
  expect(body).toContain("Disallow: /dashboard/");
  expect(body).toContain("Sitemap:");
});

test("manifest is installable and points to PNG icons", async ({ request }) => {
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons).toEqual(expect.arrayContaining([expect.objectContaining({ sizes: "192x192", type: "image/png" }), expect.objectContaining({ sizes: "512x512", type: "image/png" })]));
});

test("unknown route uses the custom 404", async ({ request }) => {
  const response = await request.get("/route-yang-tidak-ada-market-snap");
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain("Halaman tidak ditemukan");
});

test("legal page has a keyboard skip link and no horizontal overflow", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByRole("heading", { level: 1, name: "Syarat & Ketentuan" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Lewati ke konten utama" })).toBeFocused();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("guest can add a product and cart survives refresh", async ({ page }) => {
  const product = {
    id: "product-guest-test",
    slug: "apel-demo",
    name: "Apel Demo",
    category: "Buah",
    price: 25000,
    unit: "kg",
    image: "/products/apel-fuji-premium.svg",
    images: [{ id: "image-1", url: "/products/apel-fuji-premium.svg", position: 0, altText: "Apel Demo" }],
    primaryImage: { id: "image-1", url: "/products/apel-fuji-premium.svg", position: 0, altText: "Apel Demo" },
    stock: 8,
    organic: false
  };
  const store = { id: "store-demo", name: "Cabang Demo", city: "Jakarta", lat: -6.2, lng: 106.8, radiusKm: 10, isMain: true };

  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === "http://127.0.0.1:3300") return route.continue();
    if (!url.hostname.includes("market-snap") && !url.hostname.includes("localhost") && url.hostname !== "127.0.0.1") return route.continue();
    if (url.pathname.endsWith("/cart") || url.pathname.endsWith("/cart/items")) return route.fulfill({ status: 401, json: { message: "Login required" } });
    if (url.pathname.endsWith(`/products/${product.id}`)) return route.fulfill({ json: { data: product, store } });
    if (url.pathname.endsWith("/products")) return route.fulfill({ json: { data: [product], store, serviceable: true, meta: { page: 1, limit: 48, total: 1, totalPages: 1 } } });
    if (url.pathname.endsWith("/categories")) return route.fulfill({ json: { data: ["Buah"] } });
    if (url.pathname.endsWith("/stores")) return route.fulfill({ json: { data: [store] } });
    if (url.pathname.endsWith("/stores/nearest")) return route.fulfill({ json: { store, serviceable: true } });
    return route.continue();
  });

  await page.goto("/");
  const add = page.getByRole("button", { name: /Tambah Apel Demo/ }).first();
  await expect(add).toBeVisible();
  await add.click();
  await expect(page.getByText("Apel Demo masuk ke keranjang.")).toBeVisible();
  await page.reload();
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Apel Demo" })).toBeVisible();
  await expect(page.getByText("Stok: 8")).toBeVisible();
});
