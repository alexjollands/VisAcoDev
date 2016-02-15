/**
 * Created by Alex on 15/02/2016.
 */

var Tour = Class({
    initialize: function(nodes) {
        this.originNode = null;
        this.visitedNodes = [];
        this.unvisitedNodes = nodes;
        this.totalLength = 0;
        this.isComplete = false;
    },
    toDetailedString: function() {
        return "This tour starts at: " + this.originNode + ", has visited " + this.visitedNodes.length +
            " nodes and has " + this.unvisitedNodes.length + " nodes left to visit. It is " + this.totalLength + " long.";
    }
});