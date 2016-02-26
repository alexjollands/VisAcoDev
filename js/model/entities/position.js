/**
 * Created by Alex on 15/02/2016.
 */

var Position = Class({
    initialize: function(fromNode, toNode, alongEdge, distance) {
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.alongEdge = alongEdge;
        this.distance = distance;
    },
    toDetailedString: function() {
        return "This position is " + this.distance + " along edge " + this.alongEdge.nodeA.id + "-" + this.alongEdge.nodeB.id + " going from node " + this.fromNode.id + " to " + this.toNode.id + ".";
    }
});