import { BasePage } from './base.page';
import { Page, Locator, APIResponse } from '@playwright/test';

interface LoginCredentials {
    email: string;
    password: string;
}

export class LoginPage extends BasePage {
    // Locators using data-testid
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly forgotPasswordLink: Locator;
    private readonly signAsGloberButton: Locator;
    private readonly errorMessage: Locator;

    private readonly DEFAULT_TIMEOUT = 30000;
    private readonly RETRY_OPTIONS = { retries: 3, delay: 1000 };

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator('[data-testid="login-email-input"]');
        this.passwordInput = page.locator('[data-testid="login-password-input"]');
        this.signInButton = page.locator('[data-testid="login-submit-button"]');
        this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
        this.signAsGloberButton = page.locator('[data-testid="sign-as-glober-button"]');
        this.errorMessage = page.locator('[data-testid="login-error-message"]');
    }

    // Element state validations
    async isEmailInputVisible(): Promise<boolean> {
        return await this.isElementVisible(this.emailInput);
    }

    async isLoginButtonEnabled(): Promise<boolean> {
        return await this.signInButton.isEnabled();
    }

    // Basic actions with error handling
    async enterEmail(email: string): Promise<void> {
        try {
            await this.emailInput.fill(email, { timeout: this.DEFAULT_TIMEOUT });
        } catch (error) {
            throw new Error(`Failed to enter email: ${error.message}`);
        }
    }

    async enterPassword(password: string): Promise<void> {
        try {
            await this.passwordInput.fill(password, { timeout: this.DEFAULT_TIMEOUT });
        } catch (error) {
            throw new Error(`Failed to enter password: ${error.message}`);
        }
    }

    async clickSignIn(): Promise<void> {
        try {
            await this.signInButton.click({ timeout: this.DEFAULT_TIMEOUT });
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            throw new Error(`Failed to click sign in button: ${error.message}`);
        }
    }

    async clickForgotPassword(): Promise<void> {
        try {
            await this.forgotPasswordLink.click({ timeout: this.DEFAULT_TIMEOUT });
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            throw new Error(`Failed to click forgot password link: ${error.message}`);
        }
    }

    async clickSignAsGlober(): Promise<void> {
        try {
            await this.signAsGloberButton.click({ timeout: this.DEFAULT_TIMEOUT });
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            throw new Error(`Failed to click sign as glober button: ${error.message}`);
        }
    }

    // Complex workflows with retry logic
    async login(credentials: LoginCredentials): Promise<void> {
        let attempts = 0;
        while (attempts < this.RETRY_OPTIONS.retries) {
            try {
                await this.enterEmail(credentials.email);
                await this.enterPassword(credentials.password);
                await this.clickSignIn();
                return;
            } catch (error) {
                attempts++;
                if (attempts === this.RETRY_OPTIONS.retries) {
                    throw new Error(`Login failed after ${attempts} attempts: ${error.message}`);
                }
                await this.page.waitForTimeout(this.RETRY_OPTIONS.delay);
            }
        }
    }

    // Getters with proper typing
    async getErrorMessage(): Promise<string> {
        try {
            await this.errorMessage.waitFor({ state: 'visible', timeout: this.DEFAULT_TIMEOUT });
            return await this.errorMessage.textContent() || '';
        } catch (error) {
            throw new Error(`Failed to get error message: ${error.message}`);
        }
    }

    // Helper methods
    private async isElementVisible(locator: Locator): Promise<boolean> {
        try {
            await locator.waitFor({ state: 'visible', timeout: this.DEFAULT_TIMEOUT });
            return true;
        } catch {
            return false;
        }
    }
}