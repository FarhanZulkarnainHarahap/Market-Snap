import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:3300" },
  webServer: {
    command: "npm run start -- -p 3300 --hostname 127.0.0.1",
    port: 3300,
    reuseExistingServer: false,
    timeout: 60_000
  }
});
