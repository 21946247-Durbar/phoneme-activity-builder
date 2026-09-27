import { test, expect } from "@playwright/test";

/**
 * Playwright test — Builder use case.
 *
 * Demonstrates:
 *   CREATE a word list
 *   READ the list appears in the sidebar
 *   CREATE a word in that list
 *   UPDATE the list name (inline edit)
 *   DELETE the word (via modal)
 *   DELETE the list
 */
test.describe("Word List CRUD (builder use case)", () => {
  test("teacher can create, read, update and delete a word list and word", async ({
    page,
  }) => {
    const unique = Date.now();
    const listName = `PW List ${unique}`;
    const renamedList = `PW List ${unique} Renamed`;
    const englishWord = `pw${unique}`;
    const phonemes = "p w t e s t";

    // ---------- Navigate ----------
    await page.goto("/word-lists");
    await expect(
      page.getByRole("heading", { name: /Word List Manager/i })
    ).toBeVisible();

    // ---------- CREATE LIST ----------
    await page.getByPlaceholder("Name").fill(listName);
    await page
      .getByPlaceholder("Description (optional)")
      .fill("Created by Playwright test");
    await page.getByRole("button", { name: /Create List/i }).click();

    // Sidebar item visible
    const sidebarList = page
      .locator("p.font-medium")
      .filter({ hasText: listName })
      .first();
    await expect(sidebarList).toBeVisible({ timeout: 5_000 });

    // Click to select
    await sidebarList.click();

    // ---------- CREATE WORD ----------
    await page.getByPlaceholder(/English word/i).fill(englishWord);
    await page
      .getByPlaceholder(/Phonemes separated by spaces/i)
      .fill(phonemes);
    await page.getByRole("button", { name: /Add Word/i }).click();

    // Wait for the word row to appear
    const wordText = page
      .locator("span.font-medium")
      .filter({ hasText: englishWord })
      .first();
    await expect(wordText).toBeVisible({ timeout: 5_000 });

    // ---------- UPDATE LIST NAME ----------
    const sidebarWrapper = page
      .locator("div")
      .filter({ has: sidebarList })
      .first();
    await sidebarWrapper.locator("button[title='Rename']").first().click();

    const renameInput = page.locator("input[type='text']").first();
    await renameInput.fill(renamedList);
    await page
      .locator("button")
      .filter({ hasText: /^Save$/ })
      .first()
      .click();

    await expect(
      page.locator("p.font-medium").filter({ hasText: renamedList }).first()
    ).toBeVisible({ timeout: 5_000 });

    // ---------- DELETE WORD ----------
    const wordRow = page
      .locator("div")
      .filter({ has: page.locator(`span:has-text("${englishWord}")`) })
      .filter({ has: page.locator("button[title='Delete']") })
      .last();

    await wordRow.locator("button[title='Delete']").first().click();

    // Word-delete modal
    const wordDialog = page.getByRole("dialog");
    await expect(wordDialog).toBeVisible({ timeout: 5_000 });
    await wordDialog.getByRole("button", { name: /^Delete word$/ }).click();

    // Word gone
    await expect(
      page.locator("span.font-medium").filter({ hasText: englishWord })
    ).toHaveCount(0, { timeout: 5_000 });

    // ---------- DELETE LIST ----------
    const renamedSidebar = page
      .locator("p.font-medium")
      .filter({ hasText: renamedList })
      .first();
    const renamedWrapper = page
      .locator("div")
      .filter({ has: renamedSidebar })
      .first();
    await renamedWrapper.locator("button[title='Delete']").first().click();

    // List-delete modal
    const listDialog = page.getByRole("dialog");
    await expect(listDialog).toBeVisible({ timeout: 5_000 });
    await listDialog.getByRole("button", { name: /^Delete list$/ }).click();

    await expect(
      page.locator("p.font-medium").filter({ hasText: renamedList })
    ).toHaveCount(0, { timeout: 5_000 });
  });
});