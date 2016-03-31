var url = "http://localhost:50008/VisAcoDev/";

/*
 * Testing the functionality of the Advanced scenario.
 */
module.exports = {

    beforeEach : function(browser) {
        browser
            .url( url + 'index.html')
            .waitForElementVisible('body', 5000)
            .waitForElementVisible('#uit-controls', 10000)
            .click('a[id="advanced"]')
            .pause(1000)
            .assert.containsText('body', "Display city graphics?")
    },

    'Change demonstration speed using slider' : function (browser) {
        browser
            .pause(500)
            .click('#demoSpeedSlider')
            .pause(1000)
            .verify.attributeEquals('#demoSpeedSlider', 'value', '50')
    },

    'Toggle display city graphics' : function (browser) {
        browser
            .pause(500)
            .click('#showCitySpriteCheckboxLabel')
            .pause(1000)
            .expect.element('#showCitySpriteCheckbox').to.not.be.selected
    },

    'Toggle display shortest route' : function (browser) {
        browser
            .pause(500)
            .click('#showShortestRouteCheckboxLabel')
            .pause(1000)
            .expect.element('#showShortestRouteCheckbox').to.not.be.selected
    },

    'Switch to advanced controls and information tabs' : function (browser) {
        browser
            .pause(500)
            .click('a[href="#uit-advanced"]')
            .pause(1000)
            .assert.elementPresent('#parameters')
            .click('a[href="#uit-info"]')
            .pause(1000)
            .assert.containsText('div[id="uit-info"]', "This scenario shows a simple ant colony optimisation (ACO)")
    },

    'Modify parameters in advanced controls tab' : function (browser) {
        browser
            .pause(500)
            .click('a[href="#uit-advanced"]')
            .pause(2000)
            .assert.elementPresent('#parameters')

            .assert.elementPresent('input[name=colonySize]')
            .clearValue('input[name=colonySize]')
            .setValue('input[name=colonySize]', '12')
            .pause(500)
            .verify.attributeEquals('input[name=colonySize]', 'value', '12')
            .pause(500)

            .assert.elementPresent('input[name=alpha]')
            .clearValue('input[name=alpha]')
            .setValue('input[name=alpha]', '1.3')
            .pause(500)
            .verify.attributeEquals('input[name=alpha]', 'value', '1.3')
            .pause(500)

            .assert.elementPresent('input[name=beta]')
            .clearValue('input[name=beta]')
            .setValue('input[name=beta]', '2.5')
            .pause(500)
            .verify.attributeEquals('input[name=beta]', 'value', '2.5')
            .pause(500)

            .assert.elementPresent('input[name=rho]')
            .clearValue('input[name=rho]')
            .setValue('input[name=rho]', '0.01')
            .pause(500)
            .verify.attributeEquals('input[name=rho]', 'value', '0.01')
            .pause(500)

            .assert.elementPresent('input[name=depositRate]')
            .clearValue('input[name=depositRate]')
            .setValue('input[name=depositRate]', '0.75')
            .pause(500)
            .verify.attributeEquals('input[name=depositRate]', 'value', '0.75')
            .pause(500)

            .assert.elementPresent('input[name=initialPheromone]')
            .clearValue('input[name=initialPheromone]')
            .setValue('input[name=initialPheromone]', '1.25')
            .pause(500)
            .verify.attributeEquals('input[name=initialPheromone]', 'value', '1.25')
            .pause(500)
    },

    'Edit a parameter and restart the scenario' : function (browser) {
        browser
            .pause(500)
            .click('a[href="#uit-advanced"')
            .pause(500)
            .assert.elementPresent('#parameters')
            .assert.elementPresent('input[name=initialPheromone]')
            .clearValue('input[name=initialPheromone]')
            .setValue('input[name=initialPheromone]', '6')
            .pause(500)
            .verify.attributeEquals('input[name=initialPheromone]', 'value', '6')
            .pause(500)
            .click('input[name="restartScene"')
            .pause(5000)
            .verify.attributeEquals('input[name=initialPheromone]', 'value', '6')
            .end();
    }
};