import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000/api',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.spec\.ts/
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;