/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Ant class", function( assert ) {
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


    var id = 1;
    var tour = new Tour(nodes.slice());
    var fromNode = nodeA;
    var toNode = nodeB;
    var alongEdge = edgeAB;
    var distance = 0;
    var position = new Position(fromNode, toNode, alongEdge, distance);
    tour.nodeVisited(fromNode);
    tour.nodeVisited(toNode);

    /* Test the constructor */
    var ant = new Ant(id, tour, position);
    assert.equal(ant.id, 1);
    assert.equal(ant.tour, tour);
    assert.equal(ant.position, position);

    /* Test the chooseNextNode() function */
    var nextChosenNode = ant.chooseNextNode();
    assert.notEqual(nextChosenNode, ant.position.fromNode);
    assert.notEqual(nextChosenNode, ant.position.toNode);

    /* Test the moveTo() function */
    var nextChosenNode = nodeD;
    var distanceMoved = 10;
    ant.moveTo(nodeD, distanceMoved);
    assert.equal(ant.position.fromNode.id, nodeB.id);
    assert.equal(ant.position.toNode.id, nodeD.id);
    assert.equal(ant.position.distance, distanceMoved);



});