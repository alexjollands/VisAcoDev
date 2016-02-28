/**
 * Created by Alex on 15/02/2016.
 */

var Node = Class({
    initialize: function(id, x, y) {
        this.id = Number(id);
        this.x = Number(x);
        this.y  = Number(y);
        this.edges = [];
    },
    getEdgeTo: function(targetNode){
        for (var i = 0; i < this.edges.length; i++){
            if (this.edges[i].nodeA.id == targetNode.id || this.edges[i].nodeB.id == targetNode.id){
                return this.edges[i];
            }
        }
        return null;
    },
    toDetailedString: function() {
        return "Node #" + this.id + " is at X:" + this.x + ", Y:" + this.y + " with " + this.edges.length + " edges.";
    }
});