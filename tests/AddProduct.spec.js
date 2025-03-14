const {test, expect}=require("@playwright/test");
const { only } = require("node:test");
const {LoginPage} = require('../pageobjects/LoginPage');
const {ProductsPage} = require('../pageobjects/ProductsPage');
const fs = require('fs');

test("Add 5 products in a cart", async({page})=>{
    const username = "standard_user";
    const password = "secret_sauce";
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.validLogin(username,password);
    const count = 5;
    const productsPage = new ProductsPage(page);
    await productsPage.setCount(count);
    await productsPage.selectItems();
    await productsPage.verifyCount();
    await productsPage.navigateToCart();
    await productsPage.clickContinueShopping(); 
    await productsPage.navigateToCart();
    await productsPage.checkOut();
})

test("Add 3 products in a cart", async({page})=>{
    const username = "standard_user";
    const password = "secret_sauce";
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.validLogin(username,password);
    const productsPage = new ProductsPage(page);
    let productsCount = 3;
    await productsPage.setCount(productsCount);
    await productsPage.selectItems();
    await productsPage.verifyCount();
    await productsPage.removeItems(2);
    await productsPage.verifyCount();
    await productsPage.navigateToCart();
    await productsPage.clickContinueShopping(); 
    await productsPage.navigateToCart();
    await productsPage.checkOut();
})