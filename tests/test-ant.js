/**
 * Created by Alex on 15/02/2016.
 */


QUnit.test("Testing the Gathering Ant class", function( assert ) {

    /* Setup */
    var nodes = createSampleNodes();
    var edges = createSampleEdges(nodes.slice());
    var nodeA = nodes[0];
    var nodeB = nodes[1];
    var nodeC = nodes[2];
    var nodeD = nodes[3];
    var edgeAB = edges[0];
    var id = "1";
    var task = new Mission(nodes.slice());
    var position = new Position(nodeA, nodeB, edgeAB, 0);

    /* Test the constructor */
    var ant = new GatheringAnt(id, task, position);
    assert.equal(ant.id, id);
    assert.equal(ant.task.nestNode.id, nodeA.id);
    assert.equal(ant.task.foodNode.id, nodeD.id);
    assert.equal(ant.task.visitedNodes.length, 0);
    assert.equal(ant.position.fromNode.id, nodeA.id);
    assert.equal(ant.position.toNode.id, nodeB.id);
    assert.equal(ant.position.alongEdge.nodeA.id, nodeA.id);
    assert.equal(ant.position.distance, 0);

    /* Test the chooseNextNode function */
    ant.task.unvisitedNodes = nodes.slice();
    assert.equal(ant.task.targetNode.id, ant.task.foodNode.id);
    var nextNode = ant.chooseNextNode();
    assert.equal(nextNode.id, nodeA.id);

    /* Test the layPheromone function */
    var currentPheromoneLevel = edgeAB.pheromoneLevel;
    ant.layPheromone();
    assert.equal(edgeAB.pheromoneLevel, (currentPheromoneLevel + controller.pheromoneDepositRate));

    /* Test the layPartialPheromone function */
    var basePheromoneLevel = edgeAB.pheromoneLevel;
    var additionalPheromone = 1.23456;
    ant.layPartialPheromone(additionalPheromone);
    assert.equal(edgeAB.pheromoneLevel, (basePheromoneLevel + additionalPheromone));

    /* Test the getXYCoordinates function */
    var antPositionAtStart = ant.getXYCoordinates();
    assert.equal(antPositionAtStart.x, 0);
    assert.equal(antPositionAtStart.y, 100);
    ant.position.distance = 50;
    var antPosAfterMovement = ant.getXYCoordinates();
    assert.equal(antPosAfterMovement.x, 50);
    assert.equal(antPosAfterMovement.y, 100);

    /* Test the moveTo function */
    controller.graph = new Graph(nodes, edges);
    controller.graph.linkNodesAndEdges();
    ant.moveTo(nodeC, 10);

    /* Test the resetPosition function */
    assert.equal(ant.position.fromNode.id, nodeB.id);
    ant.resetPosition();
    assert.notEqual(ant.position.fromNode.id, nodeB.id);

});


QUnit.test("Testing the Touring Ant class", function( assert ) {

    /* Setup */
    var nodes = createSampleNodes();
    var edges = createSampleEdges(nodes.slice());
    var nodeA = nodes[0];
    var nodeB = nodes[1];
    var nodeC = nodes[2];
    var edgeAB = edges[0];
    var id = "1";
    var task = new Tour(nodes.slice());
    var position = new Position(nodeA, nodeB, edgeAB, 0);

    /* Test the constructor */
    var ant = new TouringAnt(id, task, position);
    assert.equal(ant.id, id);
    assert.equal(ant.task.originNode, null);
    assert.equal(ant.task.visitedNodes.length, 0);
    assert.equal(ant.task.unvisitedNodes.length, nodes.length);
    assert.equal(ant.task.totalLength, 0);
    assert.equal(ant.task.isComplete, false);
    assert.equal(ant.position.fromNode.id, nodeA.id);
    assert.equal(ant.position.toNode.id, nodeB.id);
    assert.equal(ant.position.alongEdge.nodeA.id, nodeA.id);
    assert.equal(ant.position.distance, 0);
    assert.equal(ant.agentType, "redAgent");

    /* Test the getXYCoordinates function */
    var antPositionAtStart = ant.getXYCoordinates();
    assert.equal(antPositionAtStart.x, 0);
    assert.equal(antPositionAtStart.y, 100);
    ant.position.distance = 50;
    var antPosAfterMovement = ant.getXYCoordinates();
    assert.equal(antPosAfterMovement.x, 50);
    assert.equal(antPosAfterMovement.y, 100);


    /* Test the chooseNextNode function */
    controller.graph = new Graph(nodes, edges);
    controller.graph.linkNodesAndEdges();
    assert.equal(ant.position.toNode.id, nodeB.id);
    var nextNode = ant.chooseNextNode();
    assert.notEqual(ant.position.toNode.id, nextNode.id);

    /* Test the layPheromone function */
    var currentPheromoneLevel = edgeAB.pheromoneLevel;
    ant.layPheromone();
    assert.equal(edgeAB.pheromoneLevel, (currentPheromoneLevel + controller.pheromoneDepositRate));

    /* Test the layPartialPheromone function */
    var basePheromoneLevel = edgeAB.pheromoneLevel;
    var additionalPheromone = 1.23456;
    ant.layPartialPheromone(additionalPheromone);
    assert.equal(edgeAB.pheromoneLevel, (basePheromoneLevel + additionalPheromone));

    /* Test the moveTo function */
    controller.graph = new Graph(nodes, edges);
    controller.graph.linkNodesAndEdges();
    ant.moveTo(nodeC, 10);

    /* Test the resetPosition function */
    assert.equal(ant.position.fromNode.id, nodeB.id);
    ant.task.originNode = nodeA;
    ant.resetPosition();
    assert.notEqual(ant.position.fromNode.id, nodeB.id);

});