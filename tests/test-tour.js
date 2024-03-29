/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Tour class", function( assert ) {

    /* Setup */
    var nodes = [];
    var nodeA = new Node(1, 100, 100, 10);
    var nodeB = new Node(2, 0, 50, 5);
    var nodeC = new Node(3, 50, 75, 1);
    nodes.push(nodeA, nodeB, nodeC);

    /* Test the constructor */
    var tour = new Tour(nodes.slice());

    assert.equal(tour.unvisitedNodes.length, 3);
    assert.notEqual(tour.unvisitedNodes, nodes);
    assert.equal(tour.visitedNodes.length, 0);
    assert.equal(tour.originNode, null);
    assert.equal(tour.isComplete, false);

    /* Test the nodeVisited() function */
    tour.nodeVisited(nodeA);
    assert.equal(tour.unvisitedNodes.length, 2);
    assert.equal(tour.unvisitedNodes[0].id, nodeB.id);
    assert.equal(tour.unvisitedNodes[1].id, nodeC.id);
    assert.equal(tour.visitedNodes.length, 1);
    assert.equal(tour.visitedNodes[0].id, nodeA.id);


    /* Test the beginNewTour function */
    tour.originNode = nodeA;
    tour.nodeVisited(nodeB);
    tour.nodeVisited(nodeC);
    tour.visitedNodes.push(tour.originNode);
    assert.equal(tour.visitedNodes.length, 4);
    assert.equal(tour.unvisitedNodes.length, 0);
    tour.resetTour();
    assert.equal(tour.unvisitedNodes.length, 2);


});