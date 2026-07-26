import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('has single h1 per page', async ({ page }) => {
    await page.goto('/w/test-note/');
    const count = await page.locator('h1').count();
    expect(count).toBe(1);
  });

  test('nav links have text', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('nav a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });

  test('graph page has SVG with content', async ({ page }) => {
    await page.goto('/graph/');
    // Graph SVG — check it exists and has clickable nodes
    const svg = page.locator('#graph svg');
    await expect(svg).toBeVisible();
    const nodes = page.locator('#graph svg a.node');
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);
  });
});
