/**
 * Created by Alex on 15/02/2016.
 */

var params = {};
params.pheromoneImportance    = 1;      // Alpha
params.distanceImportance     = 5;      // Beta
params.pheromoneDecayRate     = 0.1;    // Rho
params.pheromoneDepositRate   = 1;
params.initialPheromoneLevel  = 1;
params.colonySize             = 30;
params.maximumIterations      = 5;

var controller = new Controller(params);
controller.setupGraph();
controller.createColony();
controller.disperseAnts();

for (var i = 0; i < controller.maximumIterations; i++) {
    controller.performACOIteration();
}