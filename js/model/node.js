/**
 * Created by Alex on 15/02/2016.
 */

var Node = Class({
    initialize: function(id, x, y) {
        this.id = Number(id);
        this.x = Number(x);
        this.y  = Number(y);
        this.edges = null;
    },
    toDetailedString: function() {
        return "Node #" + this.id + " is at X:" + this.x + ", Y:" + this.y + " with " + this.edges.length + " edges.";
    }
});