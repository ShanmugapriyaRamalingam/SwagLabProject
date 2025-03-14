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
        this.removedItems = 0;
    }

    async setCount(count) {
        this.count = count;
    }    

    async clickElement(locator) {
        await locator.click();
    }

    async getTextContent(locator) {
        return await locator.textContent();
    }        

    async handleItems(action, itemsCount) {
        const productCount = await this.productsItem.count();
        for (let i = 0; i < productCount; i++) 
            {   
                const productName = await this.getTextContent(this.productsItem.nth(i).locator('.inventory_item_name'));
                if(i===itemsCount){break;}
                if (action === 'select') {
                    await this.clickElement(this.productsItem.nth(i).locator('text=Add to cart'));
                    const removeButton = this.productsItem.nth(i).locator('text=Remove');
                    await expect(removeButton).toBeVisible();
                    console.log(`Product "${productName}" is added to cart.`);
                } else if (action === 'remove') {
                    await this.clickElement(this.productsItem.nth(i).locator('text=Remove'));
                    const addToCartButton = this.productsItem.nth(i).locator('text=Add to cart');
                    await expect(addToCartButton).toBeVisible();
                    console.log(`Product "${productName}" is removed from the cart.`);
                }else if(action === 'verify'){
                    let buttonName = 'text=Remove';
                    if(this.removedItems > 0){                               
                        buttonName = 'text=Add to cart';
                        this.removedItems -= 1;
                    }
                    const verifyButton = await this.productsItem.nth(i).locator(buttonName);
                    await expect(verifyButton).toBeVisible();
                }   
            }
    }

    async selectItems() {
        await this.handleItems('select', this.count);
    }

    async removeItems(removalCount) {
        await this.setCount(this.count - removalCount);
        await this.handleItems('remove', removalCount);
        console.log(`Removed ${removalCount} items from the cart.`);
        this.removedItems = removalCount;
    }
    
    async verifyCartItems() {
        await this.handleItems('verify', this.count);
    }

    async navigateToCart() {
        await this.clickElement(this.shoppingCartLink);
        await this.waitForElement(this.cartItems.first());
    }

    async verifyCount(count) {
        const itemCount = await this.productCountInCart.textContent();
        console.log(`There are ${parseInt(itemCount)} items in the cart.`);
        expect(parseInt(itemCount)).toBe(this.count);
    }

    async clickContinueShopping() {
        await this.clickElement(this.continueShoppingLink);
        await this.waitForElement(this.productsItem.first());
        await this.verifyCartItems();
    }

    async checkOut() {
        await this.clickElement(this.checkoutButton);
        await this.waitForElement(this.checkoutPageTitle);
        await expect(this.checkoutPageTitle).toHaveText('Checkout: Your Information');
    }

    async waitForElement(locator) {
        await locator.waitFor({ state: 'visible' });
    }
    
}

module.exports = { ProductsPage };