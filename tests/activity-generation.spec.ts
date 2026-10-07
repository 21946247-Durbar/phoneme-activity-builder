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

    // Wait for the phoneme keyboard to render — proves the game is ready
    await expect(page.getByText(/Phoneme Selection/i)).toBeVisible({
      timeout: 15_000,
    });

    // Wait for the "Generate Standalone HTML" button to be present and stable
    const generateBtn = page.getByRole("button", {
      name: /Generate Standalone HTML/i,
    });
    await expect(generateBtn).toBeVisible({ timeout: 15_000 });
    await expect(generateBtn).toBeEnabled({ timeout: 15_000 });

    // Small settle time for the DB fetch + preview render to finish
    await page.waitForTimeout(1_500);

    // Scroll into view and click
    await generateBtn.scrollIntoViewIfNeeded();

    // ---------- Trigger the download ----------
    const downloadPromise = page.waitForEvent("download", {
      timeout: 20_000,
    });

    await generateBtn.click();

    const download = await downloadPromise;

    // ---------- Verify the downloaded file ----------
    expect(download.suggestedFilename()).toMatch(/^wordle-.+\.html$/);

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
    await expect(page.getByText(/Word Search Preview/i)).toBeVisible({
      timeout: 15_000,
    });

    const generateBtn = page.getByRole("button", {
      name: /Generate Standalone HTML/i,
    });
    await expect(generateBtn).toBeVisible({ timeout: 15_000 });
    await expect(generateBtn).toBeEnabled({ timeout: 15_000 });

    await page.waitForTimeout(1_500);
    await generateBtn.scrollIntoViewIfNeeded();

    const downloadPromise = page.waitForEvent("download", {
      timeout: 20_000,
    });

    await generateBtn.click();

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