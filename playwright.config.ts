import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the Phoneme Activity Builder A3 tests.
 *
 * Assumes the Next.js dev server is running at http://localhost:3000.
 * To run against a production build, change `command` below to
 * `npm run build && npm start`.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Playwright will NOT auto-start the server here — you should have
  // `npm run dev` running before you run the tests.
});