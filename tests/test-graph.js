/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Graph class", function( assert ) {
    /* Setup */
    var nodeA = new Node(1,0,100,[]);
    var nodeB = new Node(2,50,100,[]);
    var nodeC = new Node(3,100,50,[]);
    var nodeD = new Node(4,200,0,[]);
    var nodes = [];
    nodes.push(nodeA, nodeB, nodeC, nodeD);
    var edges = [];
    edges.push(new Edge(nodeA, nodeB, 0), new Edge(nodeB, nodeC, 0), new Edge(nodeC, nodeD, 0), new Edge(nodeD, nodeA, 0));

    /* Test the constructor */
    var graph = new Graph(nodes, edges);
    assert.equal(graph.nodes.length, 4);
    assert.equal(graph.edges.length, 4);
    edges.push(new Edge(nodeA, nodeC, 0));
    assert.equal(graph.edges.length, 5);

    /* Test the setupGraph() function */



});