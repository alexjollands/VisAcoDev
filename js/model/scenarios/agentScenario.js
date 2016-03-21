/**
 * Created by Alex on 26/02/2016.
 */
var AgentScenario = Class({
    initialize: function() {
        this.menuName = "agentMenu";
        this.viewType = "TSP (Agents)";
        loadMenu("agentMenu");
        this.maxEdgeLength = Number.MAX_VALUE;
        this.taskType = "Tour";
        this.displayAnts = true;
        this.antReleaseSpeed = 100;
        this.showShortestRoute = true;
        this.showCitySprite = true;
        this.numRedAgents = 1;
        var outOfViewCoords = {};
        outOfViewCoords.x = 35;
        outOfViewCoords.y = 15;
        outOfViewCoords.z = 0;
        this.outOfViewCoords = outOfViewCoords;
    },
    getParams: function(){
        var params = {};
        params.pheromoneImportance    = 0;   // Alpha
        params.distanceImportance     = 10;      // Beta
        params.pheromoneDecayRate     = 0.01;   // Rho
        params.pheromoneDepositRate   = 1;
        params.initialPheromoneLevel  = 1;
        params.colonySize             = 2;
        params.antMovementPerUpdate   = 0.75;
        params.maximumIterations      = 1000000;
        return params;
    },
    getView: function(){
        return new AgentView();
    },
    getNodeSet: function(){
        return "agent.json";
    },
    setup: function(){
        controller.graph.redEdges = controller.graph.edges.slice();
        controller.graph.blueEdges = controller.graph.edges.slice();
        controller.colony.disperseAnts();
        for (var i = 0; i < controller.colony.ants.length; i++) {
            controller.colony.ants[i].isActive = true;
        }
    },
    createNewAnt: function(i){
        var newAnt = new TouringAnt(i+1, new Tour(controller.graph.nodes.slice()), new Position());
        if (i >= this.numRedAgents){
            newAnt.agentType = "blueAgent";
        }
        return newAnt;
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
    getParticleHideCoordinates: function(){
        return this.outOfViewCoords;
    },
    layPheromoneOnEdge: function(ant, pheromone){
        var edge = ant.position.alongEdge;
        var edges = v_edgesRed;
        if (ant.agentType == "blueAgent") {
            edges = v_edgesBlue;
        }
        if (edges[controller.graph.findEdgeIndex(edge)].pheromoneLevel == undefined){
            edges[controller.graph.findEdgeIndex(edge)].pheromoneLevel = 0;
        }
        edges[controller.graph.findEdgeIndex(edge)].pheromoneLevel += pheromone;
    },
    evaporatePheromoneEffects: function(decayRate){
        var numEdges = controller.graph.edges.length;
        for (var i = 0; i < numEdges; i++){
            if (v_edgesRed[i].pheromoneLevel == undefined) { v_edgesRed[i].pheromoneLevel = 0; }
            if (v_edgesBlue[i].pheromoneLevel == undefined) { v_edgesBlue[i].pheromoneLevel = 0; }
            v_edgesRed[i].pheromoneLevel *= (1 - decayRate);
            v_edgesBlue[i].pheromoneLevel *= (1 - decayRate);
        }
    },
    calculatePheromoneDeposit: function(position){
        return controller.pheromoneDepositRate / (position.alongEdge.distance / controller.antMovementPerUpdate);
    }
});
// Get the same amount of pheromone each time? So the blue and red agents look like they're depositing the same amount?
// Who cares what the pheromone rate actually is? Its a demo.
// These should be the controller.graph.redEdges or blueEdges (model vs view)