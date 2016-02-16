/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Controller", function( assert ) {
    /* Setup */
    var params = {
        pheromoneImportance: 0.7,      // Alpha
        distanceImportance: 5,         // Beta
        pheromoneDecayRate: 0.1,       // Rho
        pheromoneDepositRate: 1,
        initialPheromoneLevel: 1,
        colonySize: 30,
        maximumIterations: 500
    };

    /* Test the constructor */
    var controller = new Controller(params);
    assert.equal(controller.pheromoneImportance, params.pheromoneImportance);
    assert.equal(controller.distanceImportance, params.distanceImportance);
    assert.equal(controller.pheromoneDecayRate, params.pheromoneDecayRate);
    assert.equal(controller.pheromoneDepositRate, params.pheromoneDepositRate);
    assert.equal(controller.initialPheromoneLevel, params.initialPheromoneLevel);
    assert.equal(controller.colonySize, params.colonySize);
    assert.equal(controller.maximumIterations, params.maximumIterations);

    /* Test the loadNodes() function */
    var nodes = controller.loadNodes();
    assert.equal(nodes.length, 20);
    assert.equal(nodes[0].id, 1);
    assert.equal(nodes[0].x, 10);
    assert.equal(nodes[0].y, 20);
    assert.equal(nodes[19].id, 20);
    assert.equal(nodes[19].x, 25);
    assert.equal(nodes[19].y, 75);

    /* Test the createEdges() function */
    var edges = controller.createEdges(nodes);
    assert.equal(edges.length, 190); // (20 nodes) 1 + 2 + 3 +...+ 17 + 18 + 19 = 190
    assert.equal(edges[0].distance, 50);
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

});
