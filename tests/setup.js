/**
 * Created by Alex on 19/02/2016.
 */

/* This class sets up a known application state to test against */
var params = {};
params.pheromoneImportance    = 1.25;   // Alpha
params.distanceImportance     = 3;      // Beta
params.pheromoneDecayRate     = 0.05;   // Rho
params.pheromoneDepositRate   = 0.5;
params.initialPheromoneLevel  = 1;
params.colonySize             = 30;
params.antMovementPerUpdate   = 50;
params.maximumIterations      = 50000;

var scenario = new BasicScenario();
var controller = new Controller();