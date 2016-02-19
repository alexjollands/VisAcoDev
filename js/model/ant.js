/**
 * Created by Alex on 15/02/2016.
 */

var Ant = Class({
    initialize: function(id, tour, position) {
        this.id = id;
        this.tour = tour;
        this.position = position;
    },
    chooseNextNode: function(){
        /* This roulette wheel solution inspired by http://bit.ly/1Fo9IyN */
        var rouletteWheel = 0.0;
        var nodeProbabilities = [];
        var currentNode = this.position.toNode;
        for (var i = 0; i < this.tour.unvisitedNodes.length; i++){
            var targetNode = this.tour.unvisitedNodes[i];
            var edge = currentNode.getEdgeTo(targetNode);
            var p = Math.pow(edge.pheromoneLevel, controller.pheromoneImportance);
            var d = Math.pow(edge.distance, controller.distanceImportance);
            nodeProbabilities[i] = p * d;
            rouletteWheel += nodeProbabilities[i];
        }
        var wheelTarget = rouletteWheel * Math.random();
        var wheelPosition = 0.0;
        for (var j = 0; j < this.tour.unvisitedNodes.length; j++) {
            wheelPosition += nodeProbabilities[j];
            if (wheelPosition >= wheelTarget) {
                return this.tour.unvisitedNodes[j];
            }
        }
        return "No next node found";
    },
    moveTo: function(targetNode, distanceMoved){
        this.position.fromNode = this.position.toNode;
        this.position.toNode = targetNode;
        this.tour.nodeVisited(targetNode);
        this.position.distance = distanceMoved;
    },
    toDetailedString: function() {
        return "Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.tour + ".";
    }
});