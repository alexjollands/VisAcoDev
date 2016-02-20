/**
 * Created by Alex on 17/02/2016.
 */


var Colony = Class({
    initialize: function(ants) {
        this.ants = ants;
    },
    disperseAnts: function(){
        for (var i = 0; i < this.ants.length; i++){
            var originNode = controller.graph.nodes[random(0, controller.graph.nodes.length - 1)];
            var destinationNode = controller.graph.nodes[random(0, controller.graph.nodes.length - 1)];
            while (originNode == destinationNode){
                destinationNode = controller.graph.nodes[random(0, controller.graph.nodes.length - 1)];
            }
            var alongEdge = controller.graph.findEdge(originNode, destinationNode);
            this.ants[i].position = new Position(originNode, destinationNode, alongEdge, 0);
            this.ants[i].tour.nodeVisited(originNode);
            this.ants[i].tour.nodeVisited(destinationNode);
            this.ants[i].tour.originNode = originNode;
            this.ants[i].tour.totalLength += alongEdge.distance;
        }
    },
    updateAnts: function(){
        for (var i = 0; i < this.ants.length; i++){
            var ant = this.ants[i];
            console.log("=====================================")
            console.log("Ant ID: " + ant.id + ", originNode: " + ant.tour.originNode.id);
            var movementRemaining = controller.antMovementPerUpdate;
            var antMoving = true;
            while (antMoving){
                console.log("Iteration: " + controller.currentIteration + ", Ant is moving (ID:" + ant.id + ")");
                console.log("Movement remaining: " + movementRemaining);
                console.log(ant.position.toDetailedString());

                var edgeLengthRemaining = ant.position.alongEdge.distance - ant.position.distance;
                if (edgeLengthRemaining < movementRemaining){
                    ant.layPheromone();
                    ant.moveTo(ant.chooseNextNode(), 0);
                    movementRemaining -= edgeLengthRemaining;
                    console.log("Ant now at node: " + ant.position.fromNode.id);
                }
                else {
                    ant.position.distance += movementRemaining;
                    movementRemaining = 0;
                    console.log("Ant now at node: " + ant.position.fromNode.id + " at distance: " + ant.position.distance);
                }
                if (ant.tour.isComplete){
                    console.log("Ant moved from node:" + ant.position.fromNode.id + " to node: " + ant.position.toNode.id + ".");
                    console.log("--------- TOUR COMPLETE -----------");
                    ant.tour.totalLength += ant.position.alongEdge.distance;
                    ant.tour.checkShortestRoute();
                    ant.tour.resetTour();
                    ant.resetPosition();
                    movementRemaining = 0;
                }
                if (movementRemaining <= 0){
                    antMoving = false;
                }
            }
        }
    },
    toDetailedString: function() {
        return "This ant colony has " + this.ants.length + " members.";
    }
});