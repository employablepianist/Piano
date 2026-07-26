import { test, expect } from '@playwright/test';

test.describe('Backlinks', () => {
  test('wiki page shows backlinks', async ({ page }) => {
    await page.goto('/w/test-note/');
    await expect(page.locator('h3:has-text("Backlinks")')).toBeVisible();
  });

  test('backlinks are clickable', async ({ page }) => {
    await page.goto('/w/test-note/');
    // Click first backlink that goes to /p/ or /w/ (not /graph/)
    const link = page.locator('.backlinks a[href*="/p/"], .backlinks a[href*="/w/"]').first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    await link.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});
