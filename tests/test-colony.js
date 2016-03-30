/**
 * Created by Alex on 17/02/2016.
 */

QUnit.test("Testing the Colony class", function( assert ) {

    var ants = createSampleAnts(10);

    /* Test the constructor */
    var colony = new Colony(ants);
    assert.equal(colony.ants.length, ants.length);
    assert.equal(colony.ants[0].id, ants[0].id);
    assert.equal(colony.numActiveAnts, 0);
    assert.equal(colony.deployingAnts, true);

    /* Unable to test disperseAnts() due to too many dependencies */
    /* Unable to test updateAnts() and updateAnt() due to too many dependencies */

});