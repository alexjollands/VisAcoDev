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
            var alongEdge = controller.graph.findEdge(originNode, destinationNode);
            this.ants[i].position = new Position(originNode, destinationNode, alongEdge, 0);
            this.ants[i].tour.nodeVisited(originNode);
            this.ants[i].tour.nodeVisited(destinationNode);
            this.ants[i].tour.originNode = originNode;
        }
    },
    updateAnts: function(){
        for (var i = 0; i < this.ants.length; i++){

            var ant = this.ants[i];
            var movementRemaining = controller.antMovementPerUpdate;
            var antMoving = true;
            while (antMoving){
                //console.log("=============================");
                //console.log("Ant moving ID:" + ant.id);
                //console.log(ant.toDetailedString());
                //console.log(ant.position.toDetailedString());
                var edgeLengthRemaining = ant.position.alongEdge.distance - ant.position.distance;
                if (edgeLengthRemaining < movementRemaining){
                    //ant.layPheromone();
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
                    ant.tour.beginNewTour();
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