var url = "http://localhost:50008/VisAcoDev/";

/*
 * Testing the functionality of the Natural scenario.
*/
module.exports = {

    beforeEach : function(browser) {
        browser
            .url( url + 'index.html')
            .waitForElementVisible('body', 5000)
            .waitForElementVisible('#uit-controls', 10000)
            .pause(1000)
    },

    'Change demonstration speed using slider' : function (browser) {
        browser
            .pause(1000)
            .click('#demoSpeedSlider')
            .pause(3000)
            .verify.attributeEquals('#demoSpeedSlider', 'value', '2.5')
    },

    'Switch to advanced controls and information tabs' : function (browser) {
        browser
            .pause(1000)
            .click('a[href="#uit-advanced"')
            .pause(3000)
            .assert.elementPresent('#parameters')
            .click('a[href="#uit-info"]')
            .pause(2000)
            .assert.containsText('div[id="uit-info"]', "Here ants have one mission: find food and return to the nest.")
    },

    'Modify parameters in advanced controls tab' : function (browser) {
        browser
            .pause(1000)
            .click('a[href="#uit-advanced"')
            .pause(2000)
            .assert.elementPresent('#parameters')

            .assert.elementPresent('input[name=colonySize]')
            .clearValue('input[name=colonySize]')
            .setValue('input[name=colonySize]', '100')
            .pause(500)
            .verify.attributeEquals('input[name=colonySize]', 'value', '100')
            .pause(1000)

            .assert.elementPresent('input[name=antReleaseSpeed]')
            .clearValue('input[name=antReleaseSpeed]')
            .setValue('input[name=antReleaseSpeed]', '1')
            .pause(500)
            .verify.attributeEquals('input[name=antReleaseSpeed]', 'value', '1')
            .pause(1000)

            .assert.elementPresent('input[name=depositRate]')
            .clearValue('input[name=depositRate]')
            .setValue('input[name=depositRate]', '0.3')
            .pause(500)
            .verify.attributeEquals('input[name=depositRate]', 'value', '0.3')
            .pause(1000)

            .assert.elementPresent('input[name=initialPheromone]')
            .clearValue('input[name=initialPheromone]')
            .setValue('input[name=initialPheromone]', '0.011')
            .pause(500)
            .verify.attributeEquals('input[name=initialPheromone]', 'value', '0.011')
            .pause(1000)

            .assert.elementPresent('input[name=pathRandomness]')
            .clearValue('input[name=pathRandomness]')
            .setValue('input[name=pathRandomness]', '4')
            .pause(500)
            .verify.attributeEquals('input[name=pathRandomness]', 'value', '4')
            .pause(1000)
    },

    'Edit a parameter and restart the scenario' : function (browser) {
        browser
            .pause(1000)
            .click('a[href="#uit-advanced"')
            .pause(1000)
            .assert.elementPresent('#parameters')
            .assert.elementPresent('input[name=antReleaseSpeed]')
            .clearValue('input[name=antReleaseSpeed]')
            .setValue('input[name=antReleaseSpeed]', '3')
            .pause(500)
            .verify.attributeEquals('input[name=antReleaseSpeed]', 'value', '3')
            .pause(1000)
            .click('input[name="restartScene"')
            .pause(3000)
            .verify.attributeEquals('input[name=antReleaseSpeed]', 'value', '3')
            .end();
    }
};