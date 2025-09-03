import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { credentials, validateCredentials } from '../utils/credentials';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/');
    validateCredentials();
  });

  // Success Tests
  test('should login successfully with valid credentials', async () => {
    await loginPage.login({ email: credentials.userEmail, password: credentials.userPassword });
    // Add assertion for successful login (e.g., check dashboard URL or element)
  });

  // Negative Tests
  test('should show error with invalid email format', async () => {
    await loginPage.login({ email: 'invalidemail', password: 'password' });
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeTruthy();
  });

});