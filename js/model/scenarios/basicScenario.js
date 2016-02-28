/**
 * Created by Alex on 26/02/2016.
 */
var BasicScenario = Class({
    initialize: function() {
        this.maxEdgeLength = Number.MAX_VALUE;
        this.taskType = "Tour";
    },
    getParams: function(){
        var params = {};
        params.pheromoneImportance    = 1.25;   // Alpha
        params.distanceImportance     = 3;      // Beta
        params.pheromoneDecayRate     = 0.05;   // Rho
        params.pheromoneDepositRate   = 0.5;
        params.initialPheromoneLevel  = 1;
        params.colonySize             = 30;
        params.antMovementPerUpdate   = 50;
        params.maximumIterations      = 50000;
        return params;
    },
    getView: function(){
        return new BasicView();
    },
    getNodeSet: function(){
        return "basic.json";
    },
    setup: function(){
        controller.colony.disperseAnts();
    },
    createNewAnt: function(i){
        return new TouringAnt(i+1, new Tour(controller.graph.nodes.slice()), new Position()); // Mission or Task, not Tour
    },
    getOriginNode: function(){
        return controller.graph.nodes[random(0, controller.graph.nodes.length - 1)];
    },
    beginAntTask: function(ant, originNode, destinationNode, alongEdge){
        ant.task.nodeVisited(originNode);
        ant.task.nodeVisited(destinationNode);
        ant.task.originNode = originNode;
        ant.task.totalLength += alongEdge.distance;
    },
    completeAntTask: function(ant){
        ant.task.checkShortestRoute();
        ant.task.resetTour();
        ant.resetPosition();
    }
});