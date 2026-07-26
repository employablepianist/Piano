import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/4779/);
  });

  test('has navigation to sections', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a:has-text("blog")')).toBeVisible();
    await expect(page.locator('nav a:has-text("notes")')).toBeVisible();
    await expect(page.locator('nav a:has-text("graph")')).toBeVisible();
  });

  test('nav links work', async ({ page }) => {
    await page.goto('/');
    await page.click('nav a:has-text("blog")');
    await expect(page).toHaveURL(/\/p\//);
    await page.goto('/');
    await page.click('nav a:has-text("notes")');
    await expect(page).toHaveURL(/\/w\//);
    await page.goto('/');
    await page.click('nav a:has-text("graph")');
    await expect(page).toHaveURL(/\/graph\//);
  });
});
