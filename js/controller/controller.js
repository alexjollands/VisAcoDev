/**
 * Created by Alex on 15/02/2016.
 */

var Controller = Class({
    initialize: function(params){
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
        var dataURL = "js/model/nodes.json";
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
                    edges.push(new Edge(nodes[i], nodes[ii], this.initialPheromoneLevel));
                }
            }
        }
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
            ants.push(new Ant(i+1, new Tour(this.graph.nodes.slice()), new Position())); // Tour needs nodes
        }
        this.colony = new Colony(ants);
        return ants;
    },
    performACOIteration: function(){
        this.currentIteration++;
        this.graph.applyPheromoneDecay(this.pheromoneDecayRate);
        this.colony.updateAnts();
    },
    editParameters: function(restartDemo){
        var colonySize          = Number(document.getElementById("colonySize").value);
        var alpha               = Number(document.getElementById("alpha").value);
        var beta                = Number(document.getElementById("beta").value);
        var rho                 = Number(document.getElementById("rho").value);
        var depositRate         = Number(document.getElementById("depositRate").value);
        var initialPheromone    = Number(document.getElementById("initialPheromone").value);

        if (colonySize >= 1 && colonySize <= 100){
            this.colonySize = colonySize;
        }
        if (alpha >= 0.01 && alpha <= 100){
            this.pheromoneImportance = alpha;
        }
        if (beta >= 0.01 && beta <= 100){
            this.distanceImportance = beta;
        }
        if (rho >= 0.001 && rho <= 1){
            this.pheromoneDecayRate = rho;
        }
        if (depositRate >= 0 && depositRate <= 100){
            this.pheromoneDepositRate = depositRate;
        }
        if (initialPheromone >= 0 && initialPheromone <= 100){
            this.initialPheromoneLevel = initialPheromone;
        }
        if (restartDemo){
            console.log("Restarting demonstration");
        }

        console.log("Colony Size: " + this.colonySize);
        console.log("Alpha: " + this.pheromoneImportance);
        console.log("Beta: " + this.distanceImportance);
        console.log("Rho: " + this.pheromoneDecayRate);
        console.log("Deposit rate: " + this.pheromoneDepositRate);
        console.log("Initial pheromone: " + this.initialPheromoneLevel);

    }
});


















