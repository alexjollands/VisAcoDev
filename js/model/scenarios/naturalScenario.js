/**
 * Created by Alex on 26/02/2016.
 */

var NaturalScenario = Class({
    initialize: function() {
        this.menuName = "naturalMenu";
        this.viewType = "Nest-Food Scenario";
        loadMenu(this.menuName);
        this.maxEdgeLength = 40;
        this.nestNode;
        this.taskType = "Mission";
        var paths = [];
        paths.push([1,9,17,25,33,41,50,59,60,61,62,63,64]);
        paths.push([1,10,19,28,37,46,55,64]);
        paths.push([1,2,3,4,5,6,7,8,16,15,23,24,32,31,39,40,48,56,64]);
        this.paths = paths;
        this.pathCounter = 0;
        this.pathRandomness = 20;
        this.displayAnts = true;
        this.antReleaseSpeed = 0.15;
        this.showShortestRoute = false;
        var outOfViewCoords = {};
        outOfViewCoords.x = 50;
        outOfViewCoords.y = 50;
        outOfViewCoords.z = 0;
        this.outOfViewCoords = outOfViewCoords;
    },
    getParams: function(){
        var params = {};
        params.pheromoneImportance    = 1;   // Alpha
        params.distanceImportance     = 0;   // Beta
        params.pheromoneDecayRate     = 0.01; // Rho
        params.pheromoneDepositRate   = 0.2;
        params.initialPheromoneLevel  = 0;
        params.colonySize             = 25;
        params.antMovementPerUpdate   = 1;
        params.maximumIterations      = 1000000;
        return params;
    },
    getView: function(){
        return new NaturalView();
    },
    getNodeSet: function(){
        return "threepaths.json";
    },
    setup: function(){
        populateMenuParameters(this.menuName);
        this.nestNode = controller.graph.nodes[0];
        this.populatePaths();
        controller.colony.disperseAnts();
    },
    createNewAnt: function(i){
        return new GatheringAnt(i+1, new Mission(controller.graph.nodes.slice()), new Position());
    },
    getOriginNode: function(){
        return this.nestNode;
    },
    beginAntTask: function(ant, originNode, destinationNode, alongEdge){
        // Perform any setup as needed.
    },
    completeAntTask: function(ant){
        ant.task.reverseMission();
        ant.task.selectBestPath();
        ant.resetPosition();

    },
    populatePaths: function(){
        for (var i = 0; i < this.paths.length; i++){
            for (var j = 0; j < this.paths[i].length; j++){
                this.paths[i][j] = controller.graph.getNodeByID(this.paths[i][j]);
            }
        }
    },
    chooseFirstStep: function(ant, originNode){

        if (ant.task.path.length == 0){
            // Evenly split the ants up along the available paths
            ant.task.setPath(this.paths[this.pathCounter].slice());
            this.pathCounter++;
            if (this.pathCounter == this.paths.length){
                this.pathCounter = 0;
            }
            ant.task.visitedNodes.push(ant.task.unvisitedNodes[0]);
            ant.task.visitedNodes.push(ant.task.unvisitedNodes[1]);
            ant.task.unvisitedNodes.splice(0,2);
        }
        return ant.task.visitedNodes[1];
    },
    getParticleHideCoordinates: function(){
        return this.outOfViewCoords;
    },
    evaporatePheromoneEffects: function(decayRate){
        for (var i = 0; i < controller.graph.edges.length; i++){
            controller.graph.edges[i].pheromoneLevel *= (1 - decayRate);
        }
    },
    calculatePheromoneDeposit: function(position){
        return controller.pheromoneDepositRate / (position.alongEdge.distance / controller.antMovementPerUpdate);
    }
});