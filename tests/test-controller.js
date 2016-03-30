/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Controller", function( assert ) {
    /* Setup */
    assert.equal(controller.pheromoneImportance, params.pheromoneImportance);
    assert.equal(controller.distanceImportance, params.distanceImportance);
    assert.equal(controller.pheromoneDecayRate, params.pheromoneDecayRate);
    assert.equal(controller.pheromoneDepositRate, params.pheromoneDepositRate);
    assert.equal(controller.initialPheromoneLevel, params.initialPheromoneLevel);
    assert.equal(controller.colonySize, params.colonySize);
    assert.equal(controller.maximumIterations, params.maximumIterations);

    /* Test the loadNodes() function */
    var nodes = controller.loadNodes();
    assert.equal(nodes.length, 24);
    assert.equal(nodes[0].id, 1);
    assert.equal(nodes[0].x, 30);
    assert.equal(nodes[0].y, 30);
    assert.equal(nodes[3].id, 4);
    assert.equal(nodes[3].x, 160);
    assert.equal(nodes[3].y, 35);

    /* Test the createEdges() function */
    var edges = controller.createEdges(nodes);
    assert.equal(edges.length, 276); // (4 nodes) 1 + 2 + 3 = 6 edges
    assert.equal(Math.round(edges[0].distance), 45);
    assert.equal(edges[0].pheromoneLevel, controller.initialPheromoneLevel);


    /* Test the setupGraph() function */
    var graph = controller.setupGraph();
    assert.equal(graph.nodes.length, nodes.length);
    assert.equal(graph.nodes[0].id, nodes[0].id);
    assert.equal(graph.nodes[0].x, nodes[0].x);
    assert.equal(graph.nodes[0].y, nodes[0].y);
    assert.equal(graph.edges.length, edges.length);
    assert.equal(graph.edges[0].nodeA.id, edges[0].nodeA.id);
    assert.equal(graph.edges[0].nodeB.id, edges[0].nodeB.id);
    assert.equal(graph.edges[0].pheromoneLevel, edges[0].pheromoneLevel);

    /* Testing the createColony() function */
    controller.graph = graph;
    var colony = controller.createColony();
    assert.equal(colony.length, controller.colonySize);
    assert.equal(colony[0].id, 1);
    assert.notEqual(colony[0].task.unvisitedNodes, controller.graph.nodes);
    assert.equal(colony[0].task.unvisitedNodes.length, controller.graph.nodes.length);

});















