/**
 * Created by Alex on 28/02/2016.
 */

var GatheringAnt = Class({
    initialize: function(id, task, position) {
        this.id = id;
        this.task = task;
        this.position = position;
        this.isActive = false;
    },
    chooseNextNode: function(){
        if (this.task.targetNode.id == this.task.foodNode.id){
            return this.task.unvisitedNodes[0];
        }
        else {
            return this.task.unvisitedNodes[this.task.unvisitedNodes.length - 1];
        }
    },
    resetPosition: function(){
        this.layPheromone();
        this.position.fromNode = this.position.toNode;
        if (this.task.travellingForwardsAlongPath()){
            this.task.visitedNodes.push(this.task.unvisitedNodes[0]);
            this.task.unvisitedNodes.splice(0,1);
        }
        else {
            this.task.visitedNodes.push(this.task.unvisitedNodes[this.task.unvisitedNodes.length - 1]);
            this.task.unvisitedNodes.pop();
        }
        this.position.toNode = this.chooseNextNode();
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = 0;
        this.task.nodeVisited(this.position.toNode);
    },
    layPheromone: function(){
        this.position.alongEdge.pheromoneLevel += controller.pheromoneDepositRate;
    },
    layPartialPheromone: function(pheromone){
        this.position.alongEdge.pheromoneLevel += pheromone;
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
    toDetailedString: function(){
        return "Gathering Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.task + ".";
    }
});