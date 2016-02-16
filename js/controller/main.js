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
params.maximumIterations      = 200;

var controller = new Controller(params);
var graph = controller.setupGraph();

// Create ants, deploy on graph

// Run an iteration (move each ant it's maximum distance, lay pheromone, update pheromone)

