import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000', channel: 'chrome', headless: true, trace: 'retain-on-failure' },
  webServer: process.env.BASE_URL ? undefined : { command: 'npm start', url: 'http://127.0.0.1:3000/health', reuseExistingServer: !process.env.CI, timeout: 30000 },
});
