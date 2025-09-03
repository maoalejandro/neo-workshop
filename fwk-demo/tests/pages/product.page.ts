// product.page.ts - PROBLEMATIC VERSION (doesn't follow framework standards)
import { Page } from '@playwright/test';

export class ProductPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async addToCart(quantity: any) {
        await this.page.click('button.add-to-cart');
        await this.page.fill('input[name="qty"]', quantity);
        await this.page.click('//button[text()="Add to Cart"]');
        await this.page.waitForTimeout(2000);
    }

    async selectSize(size: any) {
        await this.page.click('.size-' + size);
    }

    async getPrice() {
        return await this.page.textContent('.price');
    }

    async isInStock() {
        const element = await this.page.$('.in-stock');
        return element !== null;
    }

    async goToCheckout() {
        await this.page.click('a[href="/checkout"]');
        await this.page.waitForURL('**/checkout');
    }
}