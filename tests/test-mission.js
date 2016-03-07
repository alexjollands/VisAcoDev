/**
 * Created by Alex on 07/03/2016.
 */

QUnit.test("Testing the Mission class", function( assert ) {
    /* Setup */
    controller = new Controller(params);

    var nodes = [];
    var nodeA = new Node(1, 100, 100, 10);
    var nodeB = new Node(2, 0, 50, 5);
    var nodeC = new Node(3, 50, 75, 1);
    nodes.push(nodeA, nodeB, nodeC);

    /* Test the constructor */
    var mission = new Mission(nodes.slice());

    assert.equal(mission.unvisitedNodes.length, 3);
    assert.notEqual(mission.unvisitedNodes, nodes);
    assert.equal(mission.visitedNodes.length, 0);
    assert.equal(mission.nestNode, nodes[0]);
    assert.equal(mission.foodNode, nodes[2]);

    /* Test the nodeVisited() function */
    mission.nodeVisited(nodeA);
    assert.equal(mission.unvisitedNodes.length, 2);
    assert.equal(mission.unvisitedNodes[0].id, nodeB.id);
    assert.equal(mission.unvisitedNodes[1].id, nodeC.id);
    assert.equal(mission.visitedNodes.length, 1);
    assert.equal(mission.visitedNodes[0].id, nodeA.id);


    /* Test the reverseMission function */
    assert.equal(mission.targetNode, nodes[2]);
    assert.notEqual(mission.visitedNodes, 0);
    mission.reverseMission();
    assert.equal(mission.targetNode, nodes[0]);
    assert.equal(mission.visitedNodes, 0);

});