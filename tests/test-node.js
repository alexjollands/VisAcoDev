/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Node class", function( assert ) {
    /* Setup */
    var nodes = [];
    var nodeA = new Node(1,0,100,[]);
    var nodeB = new Node(2,50,100,[]);
    var nodeC = new Node(3,100,50,[]);
    var nodeD = new Node(4,200,0,[]);
    nodes.push(nodeA, nodeB, nodeC, nodeD);

    var edges = [];
    var edgeAB = new Edge(nodeA, nodeB, 0);
    var edgeAC = new Edge(nodeA, nodeC, 0);
    var edgeAD = new Edge(nodeA, nodeD, 0);
    edges.push(edgeAB, edgeAC, edgeAD);

    var id = 42;
    var x = 10;
    var y = 20;

    /* Test the constructor*/
    var node = new Node(id, x, y);
    node.edges = edges;
    assert.equal(node.id, 42);
    assert.equal(node.x, 10);
    assert.equal(node.y, 20);
    assert.equal(node.edges.length, 3);

    /* Test the getEdgeTo() function */
    var edge1 = node.getEdgeTo(nodeB);
    assert.equal(edge1, edgeAB);
    var edge2 = node.getEdgeTo(nodeC);
    assert.equal(edge2, edgeAC);
    var edge3 = node.getEdgeTo(node);
    assert.equal(edge3, null);

});