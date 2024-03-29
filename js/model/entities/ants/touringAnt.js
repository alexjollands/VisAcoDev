/**
 * Created by Alex on 28/02/2016.
 */

var TouringAnt = Class({
    initialize: function(id, task, position) {
        this.id = id;
        this.task = task;
        this.position = position;
        this.agentType = "redAgent";
    },
    chooseNextNode: function(){
        /* This roulette wheel solution inspired by http://bit.ly/1Fo9IyN */
        var rouletteWheel = 0.0;
        var nodeProbabilities = [];
        var currentNode = this.position.toNode;
        for (var i = 0; i < this.task.unvisitedNodes.length; i++){
            var targetNode = this.task.unvisitedNodes[i];
            var edge = currentNode.getEdgeTo(targetNode);
            var p = Math.pow(edge.pheromoneLevel, controller.pheromoneImportance);
            var d = Math.pow((1.0 / edge.distance), controller.distanceImportance);
            if (this.agentType == "blueAgent") {d = Math.pow((edge.distance), controller.distanceImportance); }
            nodeProbabilities[i] = p * d;
            rouletteWheel += nodeProbabilities[i];
        }
        var wheelTarget = rouletteWheel * Math.random();
        var wheelPosition = 0.0;
        for (var j = 0; j < this.task.unvisitedNodes.length; j++) {
            wheelPosition += nodeProbabilities[j];
            if (wheelPosition >= wheelTarget) {
                return this.task.unvisitedNodes[j];
            }
        }
        // If end of the tour and no node found, return to origin.
        this.task.isComplete = true;
        return this.task.originNode;
    },
    resetPosition: function(){
        this.layPheromone();
        this.position.fromNode = this.task.originNode;
        this.position.toNode = this.chooseNextNode();
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = 0;
        this.task.nodeVisited(this.position.toNode);
        this.task.totalLength += this.position.alongEdge.distance;
    },
    layPheromone: function(){
        this.position.alongEdge.pheromoneLevel += controller.pheromoneDepositRate;
    },
    layPartialPheromone: function(pheromone){
        scenario.layPheromoneOnEdge(this, pheromone);
    },
    moveTo: function(targetNode, distanceMoved){
        this.position.fromNode = this.position.toNode;
        this.position.toNode = targetNode;
        this.task.nodeVisited(targetNode);
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = distanceMoved;
        this.task.totalLength += this.position.alongEdge.distance;
    },
    getXYCoordinates: function(){
        var p1 = new THREE.Vector3(this.position.fromNode.x, this.position.fromNode.y, this.position.fromNode.z);
        var p2 = new THREE.Vector3(this.position.toNode.x, this.position.toNode.y, this.position.toNode.z);
        return getPointInBetweenByLength(p1, p2, this.position.distance);
    },
    toDetailedString: function() {
        return "Touring Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.task + ".";
    }
});