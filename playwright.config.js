// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config =  defineConfig({
  testDir: './tests',
  timeout: 40 * 1000,
  expect:{
    timeout: 5000
    },
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: 'chromium',
    headless: false,
    screenshot:'on'
    // trace: 'on-first-retry',
  }
});

module.exports = config;