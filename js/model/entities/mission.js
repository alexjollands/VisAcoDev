/**
 * Created by Alex on 28/02/2016.
 */

var Mission = Class({
    initialize: function(nodes) {
        this.nestNode = nodes[0];
        this.foodNode = nodes[nodes.length - 1];
        this.targetNode = nodes[nodes.length - 1];
        this.visitedNodes = [];
        this.unvisitedNodes = nodes;
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
        this.unvisitedNodes = this.visitedNodes;
        this.visitedNodes = [];
        this.isComplete = false;
    }
});