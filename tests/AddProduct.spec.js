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
    const data = fs.readFileSync('DataSets/Products.json', 'utf8');	
    const products= JSON.parse(data);
    const count = products.length;
    const productsPage = new ProductsPage(page);
    await productsPage.selectItems(products);
    await productsPage.navigateToCart(count);
    await productsPage.clickContinueShopping(products); 
    await productsPage.navigateToCart(count);
    await productsPage.checkOut();
})

test("Add 3 products in a cart", async({page})=>{
    const username = "standard_user";
    const password = "secret_sauce";
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.validLogin(username,password);
    let products= ["Sauce Labs Backpack","Sauce Labs Bike Light","Sauce Labs Bolt T-Shirt"];   
    const productsPage = new ProductsPage(page);
    await productsPage.selectItems(products);
    await productsPage.verifyCount(products.length);
    const itemsToRemove = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];
    products = products.filter(product => !itemsToRemove.includes(product));
    await productsPage.removeItems(itemsToRemove);
    const count = products.length;
    await productsPage.verifyCount(count);
    await productsPage.navigateToCart(count);
    await productsPage.clickContinueShopping(products); 
    await productsPage.navigateToCart(count);
    await productsPage.checkOut();
})