/**
 * Created by Alex on 15/02/2016.
 */

var params = {};
params.pheromoneImportance    = 1;      // Alpha
params.distanceImportance     = 1;      // Beta
params.pheromoneDecayRate     = 0.1;    // Rho
params.pheromoneDepositRate   = 1;
params.initialPheromoneLevel  = 1;
params.colonySize             = 30;
params.antMovementPerUpdate   = 50;
params.maximumIterations      = 500;

var controller = new Controller(params);
controller.setupGraph();
controller.createColony();
controller.colony.disperseAnts();


initialiseView();
animate();


//
//for (var i = 0; i < controller.maximumIterations; i++) {
//    controller.view.animate(); // controller.performACOIteration();
//}
//
//manualCheckOfRoute(controller.graph.nodes);

