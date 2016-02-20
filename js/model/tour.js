/**
 * Created by Alex on 15/02/2016.
 */

var Tour = Class({
    initialize: function(nodes) {
        this.originNode = null;
        this.visitedNodes = [];
        this.unvisitedNodes = nodes;
        this.totalLength = 0;
        this.isComplete = false;
    },
    nodeVisited: function(node){
        this.visitedNodes.push(node);
        for (var i = 0; i < this.unvisitedNodes.length; i++){
            if (this.unvisitedNodes[i].id == node.id){
                this.unvisitedNodes.splice(i,1);
            }
        }
    },
    checkShortestRoute: function(){
        if (this.totalLength < controller.shortestRoute.totalLength){
            controller.shortestRoute.visitedNodes = this.visitedNodes.slice();
            controller.shortestRoute.totalLength = this.totalLength;

            console.log("----------------------------------------------");
            console.log("Shortest route found! " + this.totalLength);
            for (var i = 0; i < this.visitedNodes.length; i++){
                console.log("Node: " + this.visitedNodes[i].id);
            }
            console.log("Iteration: " + controller.currentIteration);

        }
    },
   resetTour: function(){
        this.unvisitedNodes = this.visitedNodes;
        this.unvisitedNodes.pop(); // Remove duplicate origin node
        this.visitedNodes = [];
        this.nodeVisited(this.originNode);
        this.totalLength = 0;
        this.isComplete = false;
    },
    toDetailedString: function() {
        return "This tour starts at: " + this.originNode + ", has visited " + this.visitedNodes.length +
            " nodes and has " + this.unvisitedNodes.length + " nodes left to visit. It is " + this.totalLength + " long.";
    }
});