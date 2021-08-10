'use strict';
require('chromedriver');
const { beforeEach, before, describe, it, after, afterEach } = require('mocha');
const { Builder, By}  = require("selenium-webdriver");
const { Eyes, Target, Configuration, BatchInfo, ClassicRunner, RectangleSize, VisualGridRunner  } = require('@applitools/eyes-selenium');
const baseUrl = process.env.BASE_URL;

// set these values
const batchName = "[Team Name] Testcafe Batch";
const appName = "[Team Name] Testcafe App";
const apiKey = process.env.APPLITOOLS_API_KEY || 'your APPLITOOLS_API_KEY';

console.log("Using url: " + baseUrl);

describe('Visual Tests', async function() {
    let driver, eyes;

    //Initialize the Runner
    //runner = new ClassicRunner();
    const runner = new VisualGridRunner(10);
    // Initialize BatchInfo
    const batchInfo =  new BatchInfo(batchName);

    beforeEach( async function() {

        driver = await new Builder()
        .forBrowser('chrome')
        .build();
        await driver.get(baseUrl);

        // Initialize the eyes SDK
        eyes = new Eyes(runner);

        // Initialize the eyes configuration
        let conf = eyes.getConfiguration();

        conf.setBatch(batchInfo);

        conf.setApiKey(apiKey);
        // conf.setServerUrl("SET_YOUR_DEDICATED_CLOUD_URL")

        // set the configuration to eyes
        eyes.setConfiguration(conf);
        //eyes.setLogHandler(new StdoutLogHandler(true));

        // Initialize a test session
        await eyes.open(driver, appName, this.currentTest.title, new RectangleSize(800,600));
        // browser, OS, AppName, TestName, ViewportSize
    })

    it('Display Elements of Authentication Page', async () => {
        await eyes.check("Login Page", Target.window().fully());
    })

    it('Both Username and Password must be present', async () => {
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        await eyes.check("Username and password must be present", Target.window().fully());
    })

    it('Username must be present', async () => {
        await driver.findElement(By.css('#username')).sendKeys("John Smith")
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        await eyes.check("Username must be present", Target.window().fully());
    })

    it('Password must be present', async () => {
        await driver.findElement(By.css('#password')).sendKeys("ABC$1@");
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        await eyes.check("Password must be present", Target.window().fully());
    })

    it('Should log you in', async () => {
        await driver.findElement(By.css('#username')).sendKeys("John Smith");
        await driver.findElement(By.css('#password')).sendKeys("ABC$1@");
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        await eyes.check("Successful Login", Target.window().fully());

    })

    afterEach(async function() {
        try {
            // close the browser
            await driver.quit();
            // end the eyes test... no need to await
            eyes.close();
        } catch(err) {
            // if tests were aborted before eyes.close() was called, this ends the test as aborted, if the test had been successfully closed, this has no effect
            await eyes.abort()
        }

    })
    after(async function() {

        // pass false to suppress the exception that is thrown
        const allTestResults = await runner.getAllTestResults(false);
        console.log(allTestResults);
    })

})