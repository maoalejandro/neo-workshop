import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

interface HeaderElements {
    logo: Locator;
    menu: Locator;
    helpLink: Locator;
}

export class HeaderPage extends BasePage {
    private readonly elements: HeaderElements;
    private readonly DEFAULT_TIMEOUT = 10000;

    constructor(page: Page) {
        super(page);
        this.elements = this.initializeElements();
    }

    private initializeElements(): HeaderElements {
        return {
            logo: this.page.locator('#logo-header'),
            menu: this.page.locator('#header-menu'),
            helpLink: this.page.locator('#header-itemList a[href="/help"]')
        };
    }

    private get headerContainer(): Locator {
        return this.page.locator('#header-container-logoMenu');
    }

    // Actions
    public async navigateToHome(): Promise<void> {
        try {
            await this.click(this.elements.logo);
            await this.waitForNavigationComplete();
        } catch (error) {
            await this.handleError(error as Error);
        }
    }

    public async openHelpPage(): Promise<void> {
        try {
            await this.click(this.elements.helpLink);
            await this.waitForNavigationComplete();
        } catch (error) {
            await this.handleError(error as Error);
        }
    }

    // Verifications
    public async verifyHeaderIsVisible(): Promise<void> {
        await this.waitForElement(this.headerContainer, this.DEFAULT_TIMEOUT);
        await Promise.all([
            this.expectToBeVisible(this.elements.logo)
        ]);
    }

    // Helper Methods
    private async waitForNavigationComplete(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }
}