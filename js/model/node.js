/**
 * Created by Alex on 15/02/2016.
 */

var Node = Class({
    initialize: function(id, x, y, edges) {
        this.id = id;
        this.x = x;
        this.y  = y;
        this.edges = edges;
    },
    toDetailedString: function() {
        return "Node #" + this.id + " is at X:" + this.x + ", Y:" + this.y + " with " + edges.length + " edges.";
    }
});