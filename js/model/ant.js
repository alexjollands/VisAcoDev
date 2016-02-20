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
            var d = Math.pow((1.0 / edge.distance), controller.distanceImportance);
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
        // If end of the tour and no node found, return to origin.
        this.tour.isComplete = true;
        return this.tour.originNode;
    },
    resetPosition: function(){

        this.position.fromNode = this.tour.originNode;
        this.position.toNode = this.chooseNextNode();
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = 0;
        this.tour.nodeVisited(this.position.toNode);
        this.tour.totalLength += this.position.alongEdge.distance;
    },
    layPheromone: function(){
        this.position.alongEdge.pheromoneLevel += controller.pheromoneDepositRate;
    },
    moveTo: function(targetNode, distanceMoved){
        this.position.fromNode = this.position.toNode;
        this.position.toNode = targetNode;
        this.tour.nodeVisited(targetNode);
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = distanceMoved;
        this.tour.totalLength += this.position.alongEdge.distance;
    },
    toDetailedString: function() {
        return "Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.tour + ".";
    }
});