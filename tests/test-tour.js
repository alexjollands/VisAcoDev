/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Tour class", function( assert ) {
    /* Setup */
    var nodes = [];
    var nodeA = new Node(1,0,100,[]);
    var nodeB = new Node(2,0,100,[]);
    var nodeC = new Node(3,100,100,[]);
    nodes.push(nodeA, nodeB, nodeC);

    /* Test */
    var tour = new Tour(nodes.slice());
    assert.equal(tour.unvisitedNodes.length, 3);
    assert.notEqual(tour.unvisitedNodes, nodes);
    assert.equal(tour.visitedNodes.length, 0);
    assert.equal(tour.originNode, null);
    assert.equal(tour.isComplete, false);
});