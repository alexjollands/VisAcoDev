/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Ant class", function( assert ) {
    /* Setup */
    var id = 1;
    var tour = new Tour([]);
    var fromNode = new Node(1,0,100,[]);
    var toNode = new Node(2,0,0,[]);
    var alongEdge = new Edge(fromNode, toNode, 10);
    var distance = 0;
    var position = new Position(fromNode, toNode, alongEdge, distance);

    /* Test */
    var ant = new Ant(id, tour, position);
    assert.equal(ant.id, 1);
    assert.equal(ant.tour, tour);
    assert.equal(ant.position, position);
});