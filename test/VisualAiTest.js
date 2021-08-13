'use strict';
require('chromedriver');
const { beforeEach, before, describe, it, after, afterEach } = require('mocha');
const { Builder, By}  = require("selenium-webdriver");
const { Eyes, Target, Configuration, DeviceName, BatchInfo, BrowserType, ClassicRunner, RectangleSize, ScreenOrientation, VisualGridRunner  } = require('@applitools/eyes-selenium');
const baseUrl = process.env.BASE_URL;

// set these values
const batchName = "[Team Name] Javascript Selenium Batch";
const appName = "[Team Name] Javascript Selenium App";
const apiKey = process.env.APPLITOOLS_API_KEY || 'your APPLITOOLS_API_KEY';
const batchInfo =  new BatchInfo(batchName);

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
        //eyes.setLogHandler(new StdoutLogHandler(true));

        // Add browsers with different viewports
        conf.addBrowser(800, 600, BrowserType.CHROME);
        conf.addBrowser(700, 500, BrowserType.FIREFOX);
        conf.addBrowser(1600, 1200, BrowserType.IE_11);
        conf.addBrowser(1024, 768, BrowserType.EDGE_CHROMIUM);
        conf.addBrowser(800, 600, BrowserType.SAFARI);

        // Add mobile emulation devices in Portrait mode
        conf.addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT);
        conf.addDeviceEmulation(DeviceName.Pixel_2, ScreenOrientation.PORTRAIT);
        eyes.setConfiguration(conf);
        // Initialize a test session
        await eyes.open(driver, appName, this.currentTest.title, new RectangleSize(800,600));
        // browser, OS, AppName, TestName, ViewportSize
    })

    it('Display Elements of Authentication Page', async () => {
        // Add visual validation here
    })

    it('Both Username and Password must be present', async () => {
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        // Add visual validation here
    })

    it('Username must be present', async () => {
        await driver.findElement(By.css('#username')).sendKeys("John Smith")
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        // Add visual validation here
    })

    it('Password must be present', async () => {
        await driver.findElement(By.css('#password')).sendKeys("ABC$1@");
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        // Add visual validation here
    })

    it('Should log you in', async () => {
        await driver.findElement(By.css('#username')).sendKeys("John Smith");
        await driver.findElement(By.css('#password')).sendKeys("ABC$1@");
        // submit the form
        await driver.findElement(By.css("#log-in")).click();
        // Add visual validation here
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