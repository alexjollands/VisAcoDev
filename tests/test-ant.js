/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Ant class", function( assert ) {
    /* Setup */
    controller = new Controller(params);
    controller.setupGraph();
    controller.createColony();
    controller.colony.disperseAnts();

    var nodeA = controller.graph.nodes[0];
    var nodeB = controller.graph.nodes[1];
    var nodeC = controller.graph.nodes[2];

    var id = 1;
    var tour = new Tour(controller.graph.nodes.slice());
    var fromNode = nodeA;
    var toNode = nodeB;
    var alongEdge = controller.graph.findEdge(nodeA, nodeB);
    var distance = 0;
    var position = new Position(fromNode, toNode, alongEdge, distance);
    tour.nodeVisited(fromNode);
    tour.nodeVisited(toNode);
    tour.originNode = fromNode;

    /* Test the constructor */
    var ant = new TouringAnt(id, tour, position);
    assert.equal(ant.id, 1);
    assert.equal(ant.task, tour);
    assert.equal(ant.position, position);

    /* Test the chooseNextNode() function */
    var nextChosenNode = ant.chooseNextNode();
    assert.notEqual(nextChosenNode, ant.position.fromNode);
    assert.notEqual(nextChosenNode, ant.position.toNode);

    /* Test the moveTo() function */
    var distanceMoved = 10;
    ant.moveTo(nodeC, distanceMoved);
    assert.equal(ant.position.fromNode.id, nodeB.id);
    assert.equal(ant.position.toNode.id, nodeC.id);
    assert.equal(ant.position.distance, distanceMoved);

    /* Test the layPheromone() function */
    var startingPheromoneLevel = ant.position.alongEdge.pheromoneLevel;
    ant.layPheromone();
    assert.equal(ant.position.alongEdge.pheromoneLevel, startingPheromoneLevel + controller.pheromoneDepositRate);

    /* Test the resetPosition() function */
    assert.notEqual(ant.position.fromNode, ant.task.originNode);
    assert.notEqual(ant.position.toNode, ant.task.originNode);
    ant.resetPosition();
    assert.equal(ant.position.fromNode, ant.task.originNode);

});
