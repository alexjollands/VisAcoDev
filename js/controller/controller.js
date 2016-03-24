/**
 * Created by Alex on 15/02/2016.
 */

var Controller = Class({
    initialize: function(){
        var params = scenario.getParams();
        this.pheromoneImportance = params.pheromoneImportance;      // Alpha
        this.distanceImportance = params.distanceImportance;        // Beta
        this.pheromoneDecayRate = params.pheromoneDecayRate;        // Rho
        this.pheromoneDepositRate = params.pheromoneDepositRate;
        this.initialPheromoneLevel = params.initialPheromoneLevel;
        this.colonySize = params.colonySize;
        this.antMovementPerUpdate = params.antMovementPerUpdate;
        this.maximumIterations = params.maximumIterations;
        this.currentIteration = 0;
        this.graph = null;
        this.colony = null;
        this.shortestRoute = new Tour();
        this.shortestRoute.totalLength = Number.MAX_VALUE;
        this.mouseWithinCanvas = false;
    },
    loadNodes: function(){
        var nodes = [];
        var dataURL = "js/model/data/" + scenario.getNodeSet();
        $.ajax({
            url: dataURL,
            dataType: 'json',
            async: false,
            success: function(data) {
                for (var i = 0; i < data.nodes.length; i++){
                    var node = data.nodes[i];
                    nodes.push(new Node(node.nid, node.x, node.y));
                }
            }
        });
        return nodes;
    },
    createEdges: function(nodes){
        var edges = [];
        for (var i = 0; i < nodes.length; i++){
            for (var ii = i; ii < nodes.length; ii++){
                if (nodes[i] != nodes[ii]) {
                    var edgeLength = findRouteDistance(nodes[i], nodes[ii]);
                    if (edgeLength < scenario.maxEdgeLength){
                        edges.push(new Edge(nodes[i], nodes[ii], this.initialPheromoneLevel, edgeLength));
                    }
                }
            }
        }
        // Link nodes and edges here, rather than do another O(n2) process
        return edges;
    },
    setupGraph: function(){
        var nodes = this.loadNodes();
        var edges = this.createEdges(nodes);
        this.graph = new Graph(nodes, edges);
        this.graph.linkNodesAndEdges(nodes, edges);
        return this.graph;
    },
    createColony: function(){
        var ants = [];
        for (var i = 0; i < this.colonySize; i++){
            ants.push(scenario.createNewAnt(i));
        }
        this.colony = new Colony(ants);
        return ants;
    },
    performACOIteration: function(){
        this.currentIteration++;
        this.graph.applyPheromoneDecay(this.pheromoneDecayRate);
        this.colony.updateAnts();
    },
    editParameters: function(viewType, restartDemo){
        userSettings = retrieveMenuParameters(scenario.menuName);
        if (restartDemo){
            restartScenario(viewType);
        }
    },
    updateUI: function(){
        if (scenario.showShortestRoute){
            if (this.shortestRoute.totalLength != Number.MAX_VALUE){
                document.getElementById("distance").innerHTML = " " + parseFloat(this.shortestRoute.totalLength).toFixed(2);
                document.getElementById("iteration-number").innerHTML = " " + this.currentIteration;
            }
        }
    },
    updateOptions: function(){
        scenario.getOptionValues();
        view.refreshNodeDisplay();
    },
    updateDemoSpeed: function(speed){
        console.log("Changing speed: " + speed);
        this.antMovementPerUpdate = Number(speed);
        this.pheromoneDecayRate = scenario.calculatePheromoneEvaporationRate();
    }
});


















