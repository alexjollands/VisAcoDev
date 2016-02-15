/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Edge class", function( assert ) {
    /* Setup */
    var nodeA = new Node(1,0,100,[]);
    var nodeB = new Node(2,0,0,[]);
    var pheromoneLevel = 10;

    /* Test */
    var edge = new Edge(nodeA, nodeB, pheromoneLevel);
    assert.equal(edge.nodeA, nodeA);
    assert.equal(edge.nodeB, nodeB);
    assert.equal(edge.pheromoneLevel, 10);
    assert.equal(edge.distance, 100);
});



