/**
 * Created by Alex on 26/02/2016.
 */

var NaturalScenario = Class({
    initialize: function() {
        this.maxEdgeLength = 40;
        this.nestNode;
        this.taskType = "Mission";
        var paths = [];
        paths.push([1,9,17,25,33,41,50,59,60,61,62,63,64]);
        paths.push([1,10,19,28,37,46,55,64]);
        paths.push([1,2,3,4,5,6,7,8,16,15,23,24,32,31,39,40,48,56,64]);
        this.paths = paths;
        this.pathCounter = 0;
    },
    getParams: function(){
        var params = {};
        params.pheromoneImportance    = 1;   // Alpha
        params.distanceImportance     = 0;   // Beta
        params.pheromoneDecayRate     = 0.05; // Rho
        params.pheromoneDepositRate   = 0.6;
        params.initialPheromoneLevel  = 1;
        params.colonySize             = 6;
        params.antMovementPerUpdate   = 5;
        params.maximumIterations      = 50000;
        return params;
    },
    getView: function(){
        return new NaturalView();
    },
    getNodeSet: function(){
        return "threepaths.json";
    },
    setup: function(){
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
        // Evenly split the ants up along the available paths
        // Evenly split the ants up along the available paths
        ant.task.setPath(this.paths[this.pathCounter].slice());
        this.pathCounter++;
        if (this.pathCounter == this.paths.length){
            this.pathCounter = 0;
        }
        //ant.task.setPath(this.paths[random(0,(this.paths.length - 1))].slice());
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
    }
});