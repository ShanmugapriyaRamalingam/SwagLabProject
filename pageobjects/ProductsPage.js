const { expect } = require('@playwright/test');

class ProductsPage {
    constructor(page) {
        this.page = page;
        this.productsItem = page.locator('.inventory_item');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
        this.productCountInCart = page.locator('.shopping_cart_badge');
        this.checkoutButton = page.locator('#checkout');
        this.checkoutPageTitle = page.locator('.title');
        this.cartItems = page.locator('.cart_item');
        this.continueShoppingLink = page.locator('#continue-shopping');
    }

    async handleItems(products, action) {
        for (const productName of products) {
            const productCount = await this.productsItem.count();
            for (let i = 0; i < productCount; i++) {
                const productTitle = await this.productsItem.nth(i).locator('.inventory_item_name').textContent();
                if (productTitle.trim() === productName) {
                    if (action === 'select') {
                        await this.productsItem.nth(i).locator('text=Add to cart').click();
                        const removeButton = this.productsItem.nth(i).locator('text=Remove');
                        console.log("Product - " + productName + " added to cart");
                        await removeButton.waitFor({ state: 'visible' });
                    } else if (action === 'remove') {
                        await this.productsItem.nth(i).locator('text=Remove').click();
                        const addToCartButton = this.productsItem.nth(i).locator('text=Add to cart');
                        await addToCartButton.waitFor({ state: 'visible' });
                        await expect(addToCartButton).toBeVisible();
                        console.log("Product - " + productName + " removed from cart");
                    }else if(action === 'verify'){
                        const removeButton = this.productsItem.nth(i).locator('text=Remove');
                        await expect(removeButton).toBeVisible();
                    }
                    break; 
                }
            }
        }
    }

    async selectItems(products) {
        await this.handleItems(products, 'select');
    }

    async removeItems(products) {
        await this.handleItems(products, 'remove');
    }
    
    async verifyCartItems(products) {
        await this.handleItems(products, 'verify');
    }

    async navigateToCart(count) {
        await this.shoppingCartLink.click();
        const itemCount = await this.productCountInCart.textContent();
        expect(parseInt(itemCount)).toBe(count);
    }

    async verifyCount(count) {
        const itemCount = await this.productCountInCart.textContent();
        expect(parseInt(itemCount)).toBe(count);
    }

    async clickContinueShopping(products) {
        await this.continueShoppingLink.click();
        await this.page.waitForLoadState('networkidle');
        await this.verifyCartItems(products);
    }

    async checkOut() {
        await this.checkoutButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.checkoutPageTitle.waitFor({ state: 'visible' });
        await expect(this.checkoutPageTitle).toHaveText('Checkout: Your Information');
    }
    
}

module.exports = { ProductsPage };