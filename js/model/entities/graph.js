/**
 * Created by Alex on 15/02/2016.
 */

var Graph = Class({
    initialize: function(nodes, edges){
        this.nodes = nodes;
        this.edges = edges;
    },
    linkNodesAndEdges: function(){
        for (var i = 0; i < this.nodes.length; i++){
            for (var j = 0; j < this.edges.length; j++){
                if (this.edges[j].nodeA.id == this.nodes[i].id || this.edges[j].nodeB.id == this.nodes[i].id){
                    this.nodes[i].edges.push(this.edges[j]);
                }
            }
        }
    },
    findEdge: function(nodeA, nodeB){
        for (var i = 0; i < nodeA.edges.length; i++){
            var edge = nodeA.edges[i];
            if ((edge.nodeA.id == nodeA.id && edge.nodeB.id == nodeB.id) ||
                (edge.nodeA.id == nodeB.id && edge.nodeB.id == nodeA.id)){
                return edge;
            }
        }
    },
    findSRViewEdge: function(nodeA, nodeB){
        for (var i = 0; i < this.edges.length; i++){
            var edge = this.edges[i];
            if ((edge.nodeA.id == nodeA.id && edge.nodeB.id == nodeB.id) ||
                (edge.nodeA.id == nodeB.id && edge.nodeB.id == nodeA.id)){
                return v_edgesSR[i];
            }
        }
    },
    applyPheromoneDecay: function(decayRate){
        for (var i = 0; i < this.edges.length; i++){
            this.edges[i].pheromoneLevel *= (1 - decayRate);
        }
    },
    getNodeByID: function(id){
        for (var i = 0; i < this.nodes.length; i++){
            if (this.nodes[i].id == id){
                return this.nodes[i];
            }
        }
    },
    toDetailedString: function() {
        return "This graph has " + this.nodes.length + " nodes and " + this.edges.length + " edges.";
    }
});