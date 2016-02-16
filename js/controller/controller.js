/**
 * Created by Alex on 15/02/2016.
 */

var Controller = Class({
    initialize: function(params) {
        this.pheromoneImportance = params.pheromoneImportance;      // Alpha
        this.distanceImportance = params.distanceImportance;        // Beta
        this.pheromoneDecayRate = params.pheromoneDecayRate;        // Rho
        this.pheromoneDepositRate = params.pheromoneDepositRate;
        this.initialPheromoneLevel = params.initialPheromoneLevel;
        this.colonySize = params.colonySize;
        this.maximumIterations = params.maximumIterations;
    },
    loadNodes: function() {
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
    setupGraph: function(){
        //var nodes = loadNodes();
        //var edges = generateEdges();
        //return new Graph(nodes, edges);
    }
});