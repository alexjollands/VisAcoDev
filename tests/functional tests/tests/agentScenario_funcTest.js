var url = "http://users.aber.ac.uk/arj24/visaco/";

/*
 * Testing the functionality of the Agents scenario.
*/
module.exports = {

    beforeEach : function(browser) {
        browser
            .url( url + 'index.html')
            .waitForElementVisible('body', 5000)
            .waitForElementVisible('#uit-controls', 10000)
            .click('a[id="agents"]')
            .pause(3000)
            .assert.containsText('body', "Display city graphics?")
    },

    'Change demonstration speed using slider' : function (browser) {
        browser
            .pause(1000)
            .click('#demoSpeedSlider')
            .pause(3000)
            .verify.attributeEquals('#demoSpeedSlider', 'value', '5.25')
    },

     'Toggle display city graphics' : function (browser) {
        browser
             .pause(1000)
             .click('#showCitySpriteCheckboxLabel')
             .pause(2000)
             .expect.element('#showCitySpriteCheckbox').to.not.be.selected
     },

    'Switch to advanced controls and information tabs' : function (browser) {
        browser
            .pause(1000)
            .click('a[href="#uit-advanced"]')
            .pause(2000)
            .assert.elementPresent('#parameters')
            .click('a[href="#uit-info"]')
            .pause(2000)
            .assert.containsText('div[id="uit-info"]', "Travelling ants: this scenario shows artificial agents")
    },

    'Modify parameters in advanced controls tab' : function (browser) {
        browser
            .pause(1000)
            .click('a[href="#uit-advanced"]')
            .pause(2000)
            .assert.elementPresent('#parameters')

            .assert.elementPresent('input[name=agentNumber]')
            .clearValue('input[name=agentNumber]')
            .setValue('input[name=agentNumber]', '12')
            .pause(500)
            .verify.attributeEquals('input[name=agentNumber]', 'value', '12')
            .pause(1000)

            .assert.elementPresent('input[name=depositRate]')
            .clearValue('input[name=depositRate]')
            .setValue('input[name=depositRate]', '0.3')
            .pause(500)
            .verify.attributeEquals('input[name=depositRate]', 'value', '0.3')
            .pause(1000)

            .assert.elementPresent('input[name=rho]')
            .clearValue('input[name=rho]')
            .setValue('input[name=rho]', '0.01')
            .pause(500)
            .verify.attributeEquals('input[name=rho]', 'value', '0.01')
            .pause(1000)
    },

    'Edit a parameter and restart the scenario' : function (browser) {
        browser
            .pause(1000)
            .click('a[href="#uit-advanced"')
            .pause(1000)
            .assert.elementPresent('#parameters')
            .assert.elementPresent('input[name=agentNumber]')
            .clearValue('input[name=agentNumber]')
            .setValue('input[name=agentNumber]', '6')
            .pause(500)
            .verify.attributeEquals('input[name=agentNumber]', 'value', '6')
            .pause(1000)
            .click('input[name="restartScene"')
            .pause(5000)
            .verify.attributeEquals('input[name=agentNumber]', 'value', '6')
            .end();
    }
};