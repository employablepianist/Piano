import { test, expect } from '@playwright/test';

test.describe('Wiki section', () => {
  test('lists all notes', async ({ page }) => {
    await page.goto('/w/');
    await expect(page.locator('h1')).toBeVisible();
    const notes = page.locator('article a');
    const count = await notes.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('individual note renders correctly', async ({ page }) => {
    await page.goto('/w/test-note/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('time')).toBeVisible();
  });

  test('note has backlinks', async ({ page }) => {
    await page.goto('/w/test-note/');
    await expect(page.locator('h3:has-text("Backlinks")')).toBeVisible();
  });
});
