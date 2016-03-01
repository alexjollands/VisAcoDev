/**
 * Created by Alex on 26/02/2016.
 */

var NaturalScenario = Class({
    initialize: function() {
        this.maxEdgeLength = 125;
        this.nestNode;
        this.taskType = "Mission";
    },
    getParams: function(){
        var params = {};
        params.pheromoneImportance    = 1;   // Alpha
        params.distanceImportance     = 0.25;      // Beta
        params.pheromoneDecayRate     = 0.2;   // Rho
        params.pheromoneDepositRate   = 0.4;
        params.initialPheromoneLevel  = 1;
        params.colonySize             = 50;
        params.antMovementPerUpdate   = 50;
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