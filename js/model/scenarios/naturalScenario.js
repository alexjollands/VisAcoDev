/**
 * Created by Alex on 26/02/2016.
 */

var NaturalScenario = Class({
    initialize: function() {
        this.maxEdgeLength = 40;
        this.nestNode;
        this.taskType = "Mission";
    },
    getParams: function(){
        var params = {};
        params.pheromoneImportance    = 1;   // Alpha
        params.distanceImportance     = 0;   // Beta
        params.pheromoneDecayRate     = 0.01; // Rho
        params.pheromoneDepositRate   = 0.6;
        params.initialPheromoneLevel  = 0;
        params.colonySize             = 1;
        params.antMovementPerUpdate   = 10;
        params.maximumIterations      = 50000;
        return params;
    },
    getView: function(){
        return new NaturalView();
    },
    getNodeSet: function(){
        return "natural.json";
    },
    setup: function(){
        this.nestNode = controller.graph.nodes[0];
        controller.colony.disperseAnts();
    },
    createNewAnt: function(i){
        return new GatheringAnt(i+1, new Mission(controller.graph.nodes.slice()), new Position());
    },
    getOriginNode: function(){
        return this.nestNode;
    },
    beginAntTask: function(ant, originNode, destinationNode, alongEdge){
        // Mission setup (if needed).
    },
    completeAntTask: function(ant){
        ant.task.reverseMission();
        ant.resetPosition();
    }
});