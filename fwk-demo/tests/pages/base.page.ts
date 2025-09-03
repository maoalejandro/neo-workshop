import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    // Navigation methods
    async navigateTo(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    // Element interaction methods
    protected async click(locator: string | Locator) {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.waitFor({ state: 'visible' });
        await element.click();
    }

    protected async fill(locator: string | Locator, text: string) {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.waitFor({ state: 'visible' });
        await element.fill(text);
    }

    // Wait methods
    protected async waitForElement(locator: string | Locator, timeout = 5000) {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.waitFor({ state: 'visible', timeout });
    }

    protected async waitForElementToBeHidden(locator: string | Locator, timeout = 5000) {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await element.waitFor({ state: 'hidden', timeout });
    }

    // Verification methods
    protected async isElementVisible(locator: string | Locator): Promise<boolean> {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        return await element.isVisible();
    }

    protected async expectToBeVisible(locator: string | Locator) {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toBeVisible();
    }

    // Screenshot methods
    protected async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `./screenshots/${name}.png` });
    }

    // URL verification
    protected async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    // Error handling
    protected async handleError(error: Error) {
        console.error(`Error in BasePage: ${error.message}`);
        await this.takeScreenshot(`error-${Date.now()}`);
        throw error;
    }
}