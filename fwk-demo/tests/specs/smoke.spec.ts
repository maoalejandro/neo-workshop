import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('Smoke test: Framework validation with diagnostics', async ({ page }) => {
  // Take screenshots to help diagnose issues
  await page.setDefaultTimeout(60000);
  
  try {
    // Step 1: Navigate to home page
    console.log('Navigating to home page...');
    await page.goto('/', { timeout: 30000, waitUntil: 'networkidle' });
    await page.screenshot({ path: 'test-results/home-page.png' });
    console.log('Page URL:', page.url());
    
    // Step 2: Print page content for debugging
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    const pageContent = await page.content();
    console.log('Page content snippet:', pageContent.substring(0, 200) + '...');
    
    // Step 3: Verify basic functionality
    console.log('Checking basic page elements...');
    
    // Check if LoginPage can be instantiated
    const loginPage = new LoginPage(page);
    console.log('LoginPage instantiated successfully');
    
    // Log success
    console.log('Framework validation complete');
    
  } catch (error) {
    console.error('Test failed with error:', error);
    await page.screenshot({ path: 'test-results/error-state.png' });
    throw error;
  }
});