/**
 * Created by Alex on 15/02/2016.
 */

var Edge = Class({
    initialize: function(nodeA, nodeB, pheromoneLevel) {
        this.nodeA = nodeA;
        this.nodeB  = nodeB;
        this.pheromoneLevel = pheromoneLevel;

        var xDist = Math.pow(nodeA.x - nodeB.x, 2);
        var yDist = Math.pow(nodeA.y - nodeB.y, 2);
        this.distance = Math.sqrt(xDist + yDist);

    },
    toDetailedString: function() {
        return "This edge goes from node: " + this.nodeA.id + " to node: " +
            this.nodeB.id + ". Distance is: " + this.distance +
            ". Pheromone level is: " + this.pheromoneLevel + ".";
    }
});

