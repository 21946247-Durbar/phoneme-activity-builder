import { test, expect } from "@playwright/test";

/**
 * Playwright test — User use case.
 *
 * Demonstrates:
 *   A teacher can open the Wordle builder, select a word,
 *   generate a standalone HTML file, and the download fires.
 *   Same for Word Search.
 *   Finally verifies the dashboard reflects the generation events.
 */
test.describe("Activity generation (user use case)", () => {
  test("teacher can generate a standalone Wordle HTML from a database word", async ({
    page,
  }) => {
    // ---------- Navigate to Wordle builder ----------
    await page.goto("/wordle");

    await expect(
      page.getByRole("heading", { name: /Wordle Activity Builder/i })
    ).toBeVisible();

    // Wait for word list to load (first list auto-selected)
    await page.waitForSelector("select#list-select", { timeout: 10_000 });

    // The grid should render — wait for a phoneme keyboard button
    await expect(page.getByText(/Phoneme Selection/i)).toBeVisible({
      timeout: 10_000,
    });

    // ---------- Trigger the download ----------
    const downloadPromise = page.waitForEvent("download", {
      timeout: 10_000,
    });

    await page
      .getByRole("button", { name: /Generate Standalone HTML/i })
      .click();

    const download = await downloadPromise;

    // ---------- Verify the downloaded file ----------
    expect(download.suggestedFilename()).toMatch(/^wordle-.+\.html$/);

    // Save the downloaded file and verify it has HTML content
    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test("teacher can generate a standalone Word Search HTML from a database word", async ({
    page,
  }) => {
    await page.goto("/word-search");

    await expect(
      page.getByRole("heading", { name: /Word Search Activity Builder/i })
    ).toBeVisible();

    // Wait for words to load
    await page.waitForTimeout(2_000);

    // Trigger download
    const downloadPromise = page.waitForEvent("download", {
      timeout: 10_000,
    });

    await page
      .getByRole("button", { name: /Generate Standalone HTML/i })
      .click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(
      /^wordsearch-\d+-words\.html$/
    );
  });

  test("dashboard reflects generation events", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: /Operations Dashboard/i })
    ).toBeVisible();

    // The HTML Generation section should be visible
    await expect(page.getByText(/HTML Generation/i)).toBeVisible();

    // Successful count should be a number
    const successfulCard = page
      .locator("div")
      .filter({ hasText: /^Successful\d+$/ })
      .first();
    await expect(successfulCard).toBeVisible({ timeout: 5_000 });

    // Alerts section should be visible
    await expect(page.getByText(/Alerts/i).first()).toBeVisible();

    // System health indicator should show
    await expect(page.getByText(/System healthy/i)).toBeVisible({
      timeout: 5_000,
    });
  });
});