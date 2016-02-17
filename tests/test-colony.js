/**
 * Created by Alex on 17/02/2016.
 */

QUnit.test("Testing the Colony class", function( assert ) {
    /* Setup */
    var ants = [];
    var antA = new Ant(1, new Tour(), new Position());
    var antB = new Ant(2, new Tour(), new Position());
    var antC = new Ant(3, new Tour(), new Position());
    ants.push(antA, antB, antC);

    /* Test */
    var colony = new Colony(ants);
    assert.equal(colony.ants.length, 3);
    assert.equal(colony.ants[0], antA);

});