/**
 * Created by Alex on 19/02/2016.
 */

/* This class sets up a known application state to test against */
var params = {};
params.pheromoneImportance    = 1;      // Alpha
params.distanceImportance     = 5;      // Beta
params.pheromoneDecayRate     = 0.1;    // Rho
params.pheromoneDepositRate   = 1;
params.initialPheromoneLevel  = 1;
params.colonySize             = 30;
params.antMovementPerUpdate   = 150;
params.maximumIterations      = 1;

var controller = new Controller(params);