'use strict';
require('chromedriver');
const { assert } = require('chai');
const { beforeEach, before, describe, it, after, afterEach } = require('mocha');
const {Builder,By} = require("selenium-webdriver");
const errorLocator = By.css(".alert.alert-warning");
const baseUrl = process.env.BASE_URL;
console.log("Using url: " + baseUrl);

describe('Traditional Tests', function() {
    let driver;

    beforeEach(async () => {
        driver = await new Builder()
        .forBrowser('chrome')
        .build();
        await driver.get(baseUrl);
    })
    it('Validate Labels', async () => {
        // Assert Text of Login Form
        await driver.findElement(By.css('.auth-header')).getText().then(textValue => {
            assert.equal('Login Form', textValue)
        });
        assert.ok(await driver.findElement(By.css('.auth-header')).isDisplayed());


        // Assert Text of Username Label
        await driver.findElement(By.css('form > div:nth-child(1) > label')).getText().then(textValue => {
            assert.equal('Username', textValue)
        });
        assert.ok(await driver.findElement(By.css('form > div:nth-child(1) > label')).isDisplayed());

        // ****Assert Text of Username Element
        await driver.findElement(By.css('#username')).getAttribute("placeholder").then(textValue => {
            assert.equal('Enter your username', textValue)
        });
        assert.ok(await driver.findElement(By.css('#username')).isDisplayed());

        // Assert Text of Password Label
        await driver.findElement(By.css('form > div:nth-child(2) > label')).getText().then(textValue => {
            assert.equal('Password', textValue)
        });
        assert.ok(await driver.findElement(By.css('form > div:nth-child(2) > label')).isDisplayed());

        // Assert Text of Password Element
        await driver.findElement(By.css('#password')).getAttribute("placeholder").then(textValue => {
            assert.equal('Enter your password', textValue)
        });
        assert.ok(await driver.findElement(By.css('#password')).isDisplayed());

        // Assert text of Login Element
        await driver.findElement(By.css('#log-in')).getText().then(textValue => {
            assert.equal('Log In', textValue)
        });
        assert.ok(await driver.findElement(By.css('#log-in')).isDisplayed());

        // Asssert Text of Remember Me Element
        await driver.findElement(By.css('.form-check-label')).getText().then(textValue => {
            assert.equal('Remember Me', textValue)
        });
        assert.ok(await driver.findElement(By.css('.form-check-label')).isDisplayed());
    })

    it('Validate Images', async () =>{
        // Assert Logo Icon is Visible
        assert.ok(await driver.findElement(By.css('.logo-w>a>img')).isDisplayed());

        // Assert User Icon is Visible
        assert.ok(await driver.findElement(By.css('.pre-icon.os-icon.os-icon-user-male-circle')).isDisplayed());

        // Assert Fingerprint Icon is Visible
        assert.ok(await driver.findElement(By.css('.pre-icon.os-icon.os-icon-fingerprint')).isDisplayed());

        // Assert Twitter Icon is Visible
        assert.ok(await driver.findElement(By.css('a:nth-child(1) > img')).isDisplayed());

        // Assert Facebook Icon is Visible
        assert.ok(await driver.findElement(By.css('a:nth-child(2) > img')).isDisplayed());

        // Assert LinkedIn Icon is Visible
        assert.ok(await driver.findElement(By.css('a:nth-child(3) > img')).isDisplayed());
    })

    it('Vallidate Checkbox', async () => {
        assert.notOk(await driver.findElement(By.css('.form-check-input')).isSelected());
    })

    // Both username and pssword must be present
    it('Both Username and Password must be present', async () => {
        // click log in
        await driver.findElement(By.css("#log-in")).click();
        assert.ok(await driver.findElement(errorLocator).isDisplayed());
        await driver.findElement(errorLocator).getText().then(textValue => {
            assert.equal('Both Username and Password must be present', textValue)
        });

    })

    // Password must be present
    it('Password must be present', async () => {
        await driver.findElement(By.css('#username')).sendKeys("John Smith");
        // submit form
        await driver.findElement(By.css("#log-in")).click();
        assert.ok(await driver.findElement(errorLocator).isDisplayed());
        await driver.findElement(errorLocator).getText().then(textValue => {
            assert.equal('Password must be present', textValue)
        });
    })

    // Username must be present
    it('Username must be present', async () => {
        await driver.findElement(By.css('#password')).sendKeys("JABC$1@");
        // submit form
        await driver.findElement(By.css("#log-in")).click();
        assert.ok(await driver.findElement(errorLocator).isDisplayed());
        await driver.findElement(errorLocator).getText().then(textValue => {
            assert.equal('Username must be present', textValue)
        });
    })

    // Successful Login
    it('Should log you in', async () =>{
        await driver.findElement(By.css('#username')).sendKeys("John Smith");
        await driver.findElement(By.css('#password')).sendKeys("JABC$1@");
        // submit form
        await driver.findElement(By.css("#log-in")).click();
        await driver.getTitle().then(textValue => {
            assert.strictEqual('ACME demo app', textValue)
        });
    })

    afterEach(async () => {
        await driver.quit();
    })

})