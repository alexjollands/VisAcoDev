/**
 * Created by Alex on 28/02/2016.
 */

var GatheringAnt = Class({
    initialize: function(id, task, position) {
        this.id = id;
        this.task = task;
        this.position = position;
    },
    chooseNextNode: function(){
        var rouletteWheel = 0.0;
        var nodeProbabilities = [];
        var nodeCandidates = [];
        var nodeCandidateNum = 0;
        var currentNode = this.position.toNode;
        // Add all possible connected nodes as candidates, only if they haven't been visited
        for (var i = 0; i < currentNode.edges.length; i++){
            var potentialNode = currentNode.edges[i].getOppositeNode(currentNode);
            if (!this.task.haveVisited(potentialNode)){
                nodeCandidates.push(potentialNode);
                var p = Math.pow(currentNode.edges[i].pheromoneLevel, controller.pheromoneImportance);
                var d = Math.pow((1.0 / currentNode.edges[i].distance), controller.distanceImportance);
                nodeProbabilities[nodeCandidateNum] = p * d;
                rouletteWheel += nodeProbabilities[nodeCandidateNum];
                nodeCandidateNum++;
            }
        }
        // If all potential nodes have been visited, move to a random one.
        if (rouletteWheel == 0.0){
            return currentNode.edges[random(0, currentNode.edges.length - 1)].getOppositeNode(currentNode);
        }
        // Select one of the candidate nodes.
        var wheelTarget = rouletteWheel * Math.random();
        var wheelPosition = 0.0;
        for (var j = 0; j < nodeCandidates.length; j++) {
            wheelPosition += nodeProbabilities[j];
            if (wheelPosition >= wheelTarget) {
                if (nodeCandidates[j].id == this.task.targetNode.id){
                    this.task.isComplete = true;
                }
                return nodeCandidates[j];
            }
        }
    },
    resetPosition: function(){
        this.layPheromone();
        this.position.fromNode = this.position.toNode;
        this.position.toNode = this.chooseNextNode();
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = 0;
        this.task.nodeVisited(this.position.toNode);
    },
    layPheromone: function(){
        this.position.alongEdge.pheromoneLevel += controller.pheromoneDepositRate;
    },
    moveTo: function(targetNode, distanceMoved){
        this.position.fromNode = this.position.toNode;
        this.position.toNode = targetNode;
        this.task.nodeVisited(targetNode);
        this.position.alongEdge = controller.graph.findEdge(this.position.fromNode, this.position.toNode);
        this.position.distance = distanceMoved;
        this.task.totalLength += this.position.alongEdge.distance;
    },
    toDetailedString: function() {
        return "Gathering Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.task + ".";
    }
});