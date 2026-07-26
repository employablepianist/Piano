import { test, expect } from '@playwright/test';

test.describe('Blog section', () => {
  test('lists all posts', async ({ page }) => {
    await page.goto('/p/');
    await expect(page.locator('h1:has-text("Blog")')).toBeVisible();
    const posts = page.locator('article a');
    const count = await posts.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('individual post renders correctly', async ({ page }) => {
    // Pick a known post that should exist in demo content
    await page.goto('/p/hello-world/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('time')).toBeVisible();
  });
});
