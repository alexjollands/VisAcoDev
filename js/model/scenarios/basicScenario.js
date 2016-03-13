/**
 * Created by Alex on 26/02/2016.
 */
var BasicScenario = Class({
    initialize: function() {
        this.menuName = "basicMenu";
        this.viewType = "TSP (Basic)";
        loadMenu("basicMenu");
        this.maxEdgeLength = Number.MAX_VALUE;
        this.taskType = "Tour";
        this.displayAnts = true;
        this.antReleaseSpeed = 100;
        this.showShortestRoute = true;
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
        params.maximumIterations      = 1000000;
        return params;
    },
    getView: function(){
        return new BasicView();
    },
    getNodeSet: function(){
        return "basic.json";
    },
    setup: function(){
        controller.colony.disperseAnts();
        for (var i = 0; i < controller.colony.ants.length; i++) {
            controller.colony.ants[i].isActive = true;
        }
    },
    createNewAnt: function(i){
        return new TouringAnt(i+1, new Tour(controller.graph.nodes.slice()), new Position()); // Mission or Task, not Tour
    },
    getOriginNode: function(){
        return controller.graph.nodes[random(0, controller.graph.nodes.length - 1)];
    },
    beginAntTask: function(ant, originNode, destinationNode, alongEdge){
        ant.task.nodeVisited(originNode);
        ant.task.nodeVisited(destinationNode);
        ant.task.originNode = originNode;
        ant.task.totalLength += alongEdge.distance;
    },
    completeAntTask: function(ant){
        ant.task.checkShortestRoute();
        ant.task.resetTour();
        ant.resetPosition();
    },
    chooseFirstStep: function(ant, originNode){
        var destinationNode = originNode;
        while (originNode.id == destinationNode.id){
            var edgeNum = random(0, originNode.edges.length - 1);
            destinationNode = originNode.edges[edgeNum].nodeA;
            if (destinationNode.id == originNode.id){
                destinationNode = originNode.edges[edgeNum].nodeB;
            }
        }
        return destinationNode;
    }
});