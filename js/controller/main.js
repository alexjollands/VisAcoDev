/**
 * Created by Alex on 15/02/2016.
 */

var params = {};
params.pheromoneImportance    = 1.25;    // Alpha
params.distanceImportance     = 3;      // Beta
params.pheromoneDecayRate     = 0.25;    // Rho
params.pheromoneDepositRate   = 1;
params.initialPheromoneLevel  = 1;
params.colonySize             = 30;
params.antMovementPerUpdate   = 50;
params.maximumIterations      = 50000;

var controller = new Controller(params);
controller.setupGraph();
controller.createColony();
controller.colony.disperseAnts();

initialiseView();
animate();
