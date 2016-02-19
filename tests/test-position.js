/**
 * Created by Alex on 15/02/2016.
 */

QUnit.test("Testing the Position class", function( assert ) {
    /* Setup */
    controller = new Controller(params);

    var fromNode = new Node(1,0,100,[]);
    var toNode = new Node(2,0,0,[]);
    var alongEdge = new Edge(fromNode, toNode, 10);
    var distance = 0;

    /* Test */
    var position = new Position(fromNode, toNode, alongEdge, distance);
    assert.equal(position.fromNode, fromNode);
    assert.equal(position.toNode, toNode);
    assert.equal(position.alongEdge, alongEdge);
    assert.equal(position.distance, 0);
});