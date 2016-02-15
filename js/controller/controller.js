/**
 * Created by Alex on 15/02/2016.
 */

var Controller = Class({
    initialize: function(params) {
        this.pheromoneImportance = params.pheromoneImportance;      // Alpha
        this.distanceImportance = params.distanceImportance;        // Beta
        this.pheromoneDecayRate = params.pheromoneDecayRate;        // Rho
        this.pheromoneDepositRate = params.pheromoneDepositRate;
        this.initialPheromoneLevel = params.initialPheromoneLevel;
        this.colonySize = params.colonySize;
        this.maximumIterations = params.maximumIterations;
    }
});