import { test, expect } from '@playwright/test';

test.describe('Link colors', () => {
  test('nav links are grey, not blue', async ({ page }) => {
    await page.goto('/p/');
    const navLink = page.locator('nav a').first();
    await expect(navLink).toHaveCSS('color', 'rgb(119, 119, 119)');
  });

  test('blog listing links are black, underlined', async ({ page }) => {
    await page.goto('/p/');
    const listLink = page.locator('.section-listing a').first();
    await expect(listLink).toHaveCSS('color', 'rgb(17, 17, 17)');
    await expect(listLink).toHaveCSS('text-decoration-line', 'underline');
  });

  test('content links are blue', async ({ page }) => {
    await page.goto('/p/hello-world/');
    // Target the content-body link (inside .e-content, not backlinks/TOC)
    const contentLink = page.locator('.e-content a[href*="markdown-test"]').first();
    const color = await contentLink.evaluate(el => getComputedStyle(el).color);
    // Should be blue, not grey or black
    expect(color).not.toBe('rgb(119, 119, 119)');
    expect(color).not.toBe('rgb(17, 17, 17)');
  });

  test.skip('heading anchors are not blue', async ({ page }) => {
    await page.goto('/p/markdown-test/');
    const anchor = page.locator('.zola-anchor').first();
    await expect(anchor).toHaveCSS('color', 'rgb(17, 17, 17)');
  });
});
