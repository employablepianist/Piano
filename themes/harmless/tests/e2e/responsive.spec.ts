import { test, expect } from '@playwright/test';

test.describe('Responsive design', () => {
  test('mobile renders navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a:has-text("blog")')).toBeVisible();
  });

  test('content does not overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/p/hello-world/');
    const main = page.locator('main');
    const box = await main.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });

  test('desktop layout fits content', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    const container = page.locator('body');
    const box = await container.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(1920);
  });
});
