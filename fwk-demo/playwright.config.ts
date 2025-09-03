import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 3,
  use: {
    baseURL: 'https://cloud.magnifai.es',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    // Add viewport size if needed
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
        headless: true
      },
    },
  ],
};

export default config;