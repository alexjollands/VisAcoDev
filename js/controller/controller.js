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
        this.maximumIterations = params.maximumIterations;
        this.graph = null;
        this.colony = null;
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
        this.colony = ants;
        return ants;
    },
    disperseAnts: function(){
        for (var i = 0; i < this.colony.length; i++){
            var originNode = this.graph.nodes[random(0, this.graph.nodes.length - 1)];
            var destinationNode = this.graph.nodes[random(0, this.graph.nodes.length - 1)];
            var alongEdge = this.graph.findEdge(originNode, destinationNode);
            this.colony[i].position = new Position(originNode, destinationNode, alongEdge, 0);
        }
    }

});