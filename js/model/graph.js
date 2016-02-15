/**
 * Created by Alex on 15/02/2016.
 */

var Graph = Class({
    initialize: function(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    },
    toDetailedString: function() {
        return "This graph has " + this.nodes.length + " nodes and " + this.edges.length + " edges.";
    }
});