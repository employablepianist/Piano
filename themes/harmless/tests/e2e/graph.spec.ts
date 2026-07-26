import { test, expect } from '@playwright/test';

test.describe('Graph page', () => {
  test('loads with D3 graph and SVG', async ({ page }) => {
    await page.goto('/graph/');
    await expect(page.locator('h1:has-text("Graph")')).toBeVisible();
    // D3 renders SVG inside #graph div
    await expect(page.locator('#graph svg')).toBeVisible();
  });

  test('graph has clickable nodes', async ({ page }) => {
    await page.goto('/graph/');
    // Wait for D3 to render
    await page.waitForSelector('#graph svg a.node');
    const nodes = page.locator('#graph svg a.node');
    const count = await nodes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('sitemap and backlinks are accessible', async ({ page }) => {
    const sm = await page.request.get('/sitemap.xml');
    expect(sm.ok()).toBeTruthy();
    const bl = await page.request.get('/backlinks.json');
    expect(bl.ok()).toBeTruthy();
  });
  
  test('graph nodes do not show fallback site title', async ({ page }) => {
    await page.goto('/graph/');
    await page.waitForSelector('#graph svg a.node', { timeout: 10000 });
    // Collect all node text labels
    const labels = await page.locator('#graph svg a.node').allTextContents();
    // None should be bare "— SITETITLE" (missing page title fallback)
    for (const label of labels) {
      expect(label.trim()).not.toMatch(/^—\s/);
    }
  });

  test('graph fits within viewport', async ({ page }) => {
    await page.goto('/graph/');
    await expect(page.locator('#graph svg')).toBeVisible({ timeout: 5000 });
    const box = await page.locator('#graph').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual((page.viewportSize()?.width || 1280) + 1);
  });
});
