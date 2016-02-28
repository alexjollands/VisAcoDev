/**
 * Created by Alex on 26/02/2016.
 */
var BasicScenario = Class({
    initialize: function() {
        this.maxEdgeLength = Number.MAX_VALUE;
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
    }
});