/**
 * Created by Alex on 15/02/2016.
 */

var Edge = Class({
    initialize: function(nodeA, nodeB, pheromoneLevel, edgeLength) {
        this.nodeA = nodeA;
        this.nodeB  = nodeB;
        this.pheromoneLevel = pheromoneLevel;

        if (edgeLength != undefined){
            this.distance = edgeLength;
        }
        else {
            var xDist = Math.pow(nodeA.x - nodeB.x, 2);
            var yDist = Math.pow(nodeA.y - nodeB.y, 2);
            this.distance = Math.sqrt(xDist + yDist);
        }
    },
    getOppositeNode: function(node){
        if (this.nodeA.id == node.id){
            return this.nodeB;
        }
        else {
            return this.nodeA;
        }
    },
    isEqual: function(edge){
        if ((edge.nodeA.id == this.nodeA.id && edge.nodeB.id == this.nodeB.id) ||
            (edge.nodeA.id == this.nodeB.id && edge.nodeB.id == this.nodeA.id)){
            return true;
        }
        return false;
    },
    toDetailedString: function() {
        return "This edge goes from node: " + this.nodeA.id + " to node: " +
            this.nodeB.id + ". Distance is: " + this.distance +
            ". Pheromone level is: " + this.pheromoneLevel + ".";
    }
});

