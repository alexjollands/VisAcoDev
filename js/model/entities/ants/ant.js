/**
 * Created by Alex on 15/02/2016.
 */
//
//var Ant = Class({
//    initialize: function(id, task, position) {
//        this.id = id;
//        this.task = task;
//        this.position = position;
//    },
//    chooseNextNodeForTour: function(){
//        /* This roulette wheel solution inspired by http://bit.ly/1Fo9IyN */
//        var rouletteWheel = 0.0;
//        var nodeProbabilities = [];
//        var currentNode = this.position.toNode;
//        for (var i = 0; i < this.task.unvisitedNodes.length; i++){
//            var targetNode = this.task.unvisitedNodes[i];
//            var edge = currentNode.getEdgeTo(targetNode);
//            var p = Math.pow(edge.pheromoneLevel, controller.pheromoneImportance);
//            var d = Math.pow((1.0 / edge.distance), controller.distanceImportance);
//            nodeProbabilities[i] = p * d;
//            rouletteWheel += nodeProbabilities[i];
//        }
//        var wheelTarget = rouletteWheel * Math.random();
//        var wheelPosition = 0.0;
//        for (var j = 0; j < this.task.unvisitedNodes.length; j++) {
//            wheelPosition += nodeProbabilities[j];
//            if (wheelPosition >= wheelTarget) {
//                return this.task.unvisitedNodes[j];
//            }
//        }
//        // If end of the tour and no node found, return to origin.
//        this.task.isComplete = true;
//        return this.task.originNode;
//    },
//    chooseNextNodeForMission: function(){
//        return this.position.toNode.edges[0].nodeA;
//    },
//    resetPosition: function(){
//        this.layPheromone();
//        this.position.fromNode = this.task.originNode;
//        this.position.toNode = this.chooseNextNodeForTour();
//        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
//        this.position.distance = 0;
//        this.task.nodeVisited(this.position.toNode);
//        this.task.totalLength += this.position.alongEdge.distance;
//    },
//    layPheromone: function(){
//        this.position.alongEdge.pheromoneLevel += controller.pheromoneDepositRate;
//    },
//    moveTo: function(targetNode, distanceMoved){
//        this.position.fromNode = this.position.toNode;
//        this.position.toNode = targetNode;
//        this.task.nodeVisited(targetNode);
//        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
//        this.position.distance = distanceMoved;
//        this.task.totalLength += this.position.alongEdge.distance;
//    },
//    toDetailedString: function() {
//        return "Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.task + ".";
//    }
//});