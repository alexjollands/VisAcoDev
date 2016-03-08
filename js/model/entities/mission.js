/**
 * Created by Alex on 28/02/2016.
 */

var Mission = Class({
    initialize: function(nodes) {
        this.nestNode = nodes[0];
        this.foodNode = nodes[nodes.length - 1];
        this.targetNode = nodes[nodes.length - 1];
        this.visitedNodes = [];
        this.unvisitedNodes = [];
        this.path = [];
        this.isComplete = false;
    },
    nodeVisited: function(node){
        this.visitedNodes.push(node);
        for (var i = 0; i < this.unvisitedNodes.length; i++){
            if (this.unvisitedNodes[i].id == node.id){
                this.unvisitedNodes.splice(i,1);
            }
        }
        if (this.unvisitedNodes.length == 0){
            this.isComplete = true;
        }
    },
    haveVisited: function(node){
        for (var i = 0; i < this.visitedNodes.length; i++){
            if (this.visitedNodes[i].id == node.id){
                return true;
            }
        }
        return false;
    },
    reverseMission: function(){
        if (this.targetNode.id == this.nestNode.id){
            this.targetNode = this.foodNode;
        }
        else {
            this.targetNode = this.nestNode;
        }
        this.unvisitedNodes = [];
        this.visitedNodes = [];
        this.isComplete = false;
    },
    setPath: function(path){
        this.path = path;
        this.unvisitedNodes = path;
    },
    selectBestPath: function(){
        var paths = scenario.paths;
        var bestPath = {};
        bestPath.pheromoneLevel = 0;
        bestPath.path = [];
        for (var i = 0; i < paths.length; i++){
            var totalPheromone = 0;
            for (var j = 0; j < paths[i].length - 1; j++){
                totalPheromone += controller.graph.findEdge(paths[i][j], paths[i][j+1]).pheromoneLevel;
            }
            var averagePheromoneLevel = totalPheromone / paths[i].length;
            if (averagePheromoneLevel > bestPath.pheromoneLevel){
                bestPath.pheromoneLevel = averagePheromoneLevel;
                bestPath.path = paths[i].slice();
            }
        }
        this.setPath(bestPath.path);
    },
    travellingForwardsAlongPath: function() {
        return this.targetNode.id == this.foodNode.id;
    }
});