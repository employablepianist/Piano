import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  snapshotDir: './tests/screenshots',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || `http://127.0.0.1:${process.env.DEV_PORT || 1111}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `make build && python3 -m http.server ${process.env.DEV_PORT || 1111} --directory public`,
    url: `http://127.0.0.1:${process.env.DEV_PORT || 1111}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
