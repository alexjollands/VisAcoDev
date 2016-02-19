/**
 * Created by Alex on 17/02/2016.
 */

QUnit.test("Testing the Colony class", function( assert ) {

    /* Setup */
    controller = new Controller(params);
    controller.setupGraph();
    controller.createColony();
    var colony = controller.colony;
    
    /* Testing the disperseAnts() function */
    assert.equal(colony.ants[0].position.fromNode, undefined);
    assert.equal(colony.ants[0].position.toNode, undefined);
    colony.disperseAnts();
    assert.notEqual(colony.ants[0].position.fromNode, undefined);
    assert.notEqual(colony.ants[0].position.toNode, undefined);
    assert.equal(colony.ants[0].position.distance, 0);

    /* Test the updateAnts() function */
    colony.updateAnts();

});