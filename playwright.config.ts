import { defineConfig, devices } from '@playwright/test';

const iphone14 = devices['iPhone 14'];
const iphoneSE = devices['iPhone SE'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  timeout: 60_000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'Mobile iPhone 14',
      use: {
        browserName: 'chromium',
        ...iphone14,
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'Mobile iPhone SE',
      use: {
        browserName: 'chromium',
        ...iphoneSE,
        viewport: { width: 375, height: 667 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
