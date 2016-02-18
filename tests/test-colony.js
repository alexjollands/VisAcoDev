/**
 * Created by Alex on 17/02/2016.
 */

QUnit.test("Testing the Colony class", function( assert ) {
    /* Setup */
    /* Setup */
    var nodes = [];
    var nodeA = new Node(1,0,100,[]);
    var nodeB = new Node(2,50,100,[]);
    var nodeC = new Node(3,100,150,[]);
    var nodeD = new Node(4,0,50,[]);
    nodes.push(nodeA, nodeB, nodeC, nodeD);

    var edges = [];
    var edgeAB = new Edge(nodeA, nodeB, 5);
    var edgeAC = new Edge(nodeA, nodeC, 0);
    var edgeAD = new Edge(nodeD, nodeA, 25);
    var edgeBC = new Edge(nodeB, nodeC, 0);
    var edgeBD = new Edge(nodeD, nodeB, 5);
    var edgeCD = new Edge(nodeC, nodeD, 10);
    edges.push(edgeAB, edgeBC, edgeCD, edgeAC, edgeAD, edgeBD);

    nodeA.edges.push(edgeAB, edgeAC, edgeAD);
    nodeB.edges.push(edgeAB, edgeBC, edgeBD);
    nodeC.edges.push(edgeBC, edgeCD, edgeAC);
    nodeD.edges.push(edgeCD, edgeAD, edgeBD);

    var ants = [];
    var antA = new Ant(1, new Tour(nodes.slice()), new Position(nodeA, nodeB, edgeAB, 0));
    var antB = new Ant(2, new Tour(nodes.slice()), new Position(nodeB, nodeC, edgeBC, 0));
    var antC = new Ant(3, new Tour(nodes.slice()), new Position(nodeC, nodeD, edgeCD, 0));
    ants.push(antA, antB, antC);

    /* Test the constructor */
    var colony = new Colony(ants);
    assert.equal(colony.ants.length, 3);
    assert.equal(colony.ants[0], antA);

    /* Test the updateAnts() function */
    colony.updateAnts();

});