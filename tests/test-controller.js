/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Controller", function( assert ) {
    /* Setup */
    var params = {
        pheromoneImportance: 0.7,      // Alpha
        distanceImportance: 5,         // Beta
        pheromoneDecayRate: 0.1,       // Rho
        pheromoneDepositRate: 1,
        initialPheromoneLevel: 1,
        colonySize: 30,
        maximumIterations: 500
    };

    /* Test */
    var controller = new Controller(params);
    assert.equal(controller.pheromoneImportance, params.pheromoneImportance);
    assert.equal(controller.distanceImportance, params.distanceImportance);
    assert.equal(controller.pheromoneDecayRate, params.pheromoneDecayRate);
    assert.equal(controller.pheromoneDepositRate, params.pheromoneDepositRate);
    assert.equal(controller.initialPheromoneLevel, params.initialPheromoneLevel);
    assert.equal(controller.colonySize, params.colonySize);
    assert.equal(controller.maximumIterations, params.maximumIterations);
});
