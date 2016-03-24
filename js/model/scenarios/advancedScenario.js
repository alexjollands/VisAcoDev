/**
 * Created by Alex on 10/03/2016.
 */
var AdvancedScenario = Class({
    initialize: function() {
        this.menuName = "advancedMenu";
        this.viewType = "TSP (Advanced)";
        loadMenu("advancedMenu");
        this.maxEdgeLength = Number.MAX_VALUE;
        this.taskType = "Tour";
        this.displayAnts = true;
        this.antReleaseSpeed = 100;
        this.showShortestRoute = true;
        this.showCitySprite = true;
    },
    getParams: function(){
        var params = {};
        params.pheromoneImportance    = 1.25;   // Alpha
        params.distanceImportance     = 2.25;   // Beta
        params.pheromoneDecayRate     = 0.07;   // Rho
        params.pheromoneDepositRate   = 0.5;
        params.initialPheromoneLevel  = 1;
        params.colonySize             = 30;
        params.antMovementPerUpdate   = 50;
        params.maximumIterations      = 1000000;
        return params;
    },
    getView: function(){
        return new AdvancedView();
    },
    getNodeSet: function(){
        return "advanced.json";
    },
    setup: function(){
        populateMenuParameters(this.menuName);
        controller.colony.disperseAnts();
        for (var i = 0; i < controller.colony.ants.length; i++) {
            controller.colony.ants[i].isActive = true;
        }
    },
    createNewAnt: function(i){
        return new TouringAnt(i+1, new Tour(controller.graph.nodes.slice()), new Position());
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
    },
    layPheromoneOnEdge: function(ant, pheromone){
        ant.position.alongEdge.pheromoneLevel += pheromone;
    },
    evaporatePheromoneEffects: function(decayRate){
        for (var i = 0; i < controller.graph.edges.length; i++){
            controller.graph.edges[i].pheromoneLevel *= (1 - decayRate);
        }
    },
    calculatePheromoneDeposit: function(position){
        return controller.pheromoneDepositRate / (position.alongEdge.distance / controller.antMovementPerUpdate);
    },
    calculatePheromoneEvaporationRate: function(){
        return controller.antMovementPerUpdate / 700;
    },
    getOptionValues: function(){
        this.showShortestRoute = document.getElementById("showShortestRouteCheckbox").checked;
        this.showCitySprite = document.getElementById("showCitySpriteCheckbox").checked;
    }
});