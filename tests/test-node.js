/**
 * Created by Alex on 15/02/2016.
 */

/* Setup */
var id = 1;
var x = 10;
var y = 20;
var edges = [];

/* Test */
QUnit.test("Testing the Node class", function( assert ) {
    var node = new Node(id, x, y, edges);
    assert.equal(node.id, 1);
    assert.equal(node.x, 10);
    assert.equal(node.y, 20);
    assert.equal(node.edges.length, 0);
});