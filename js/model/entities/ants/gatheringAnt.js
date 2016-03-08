/**
 * Created by Alex on 28/02/2016.
 */

var GatheringAnt = Class({
    initialize: function(id, task, position) {
        this.id = id;
        this.task = task;
        this.position = position;
    },
    chooseNextNode: function(){

        // Get next node along path (mission knows about paths in unvisited and visited nodes).
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

        // Update the visited and unvisited nodes appropriately - chooseNextNode gets the last element (or first) so it
        // can't be 64 or 1.

        // e.g. fromNode is now 64. We've chosen a path.

        // Setup the position so that the ant is at the start (forward or back)
        // and going to the next element in the path.
        // For that, the visited and unvisited nodes need to be updated.

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
    moveTo: function(targetNode, distanceMoved){
        this.position.fromNode = this.position.toNode;
        this.position.toNode = targetNode;
        this.task.nodeVisited(targetNode);
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = distanceMoved;
        this.task.totalLength += this.position.alongEdge.distance;
    },
    toDetailedString: function() {
        return "Gathering Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.task + ".";
    }
});