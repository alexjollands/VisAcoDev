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

        // Update pheromone level
        this.graph.applyPheromoneDecay(this.pheromoneDecayRate);

        // Update ants
        this.colony.updateAnts();

        // Save shortest route

    }
});


















