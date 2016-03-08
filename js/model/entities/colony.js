/**
 * Created by Alex on 17/02/2016.
 */


var Colony = Class({
    initialize: function(ants) {
        this.ants = ants;
    },
    disperseAnts: function(){
        for (var i = 0; i < this.ants.length; i++){
            var originNode = scenario.getOriginNode();
            var destinationNode = scenario.chooseFirstStep(this.ants[i], originNode);
            var alongEdge = controller.graph.findEdge(originNode, destinationNode);
            this.ants[i].position = new Position(originNode, destinationNode, alongEdge, 0);
            scenario.beginAntTask(this.ants[i], originNode, destinationNode, alongEdge);
        }
    },
    updateAnts: function(){
        for (var i = 0; i < this.ants.length; i++){
            this.updateAnt(this.ants[i]);
        }
    },
    updateAnt: function(ant) {
        var movementRemaining = controller.antMovementPerUpdate;
        var antMoving = true;
        while (antMoving) {
            var edgeLengthRemaining = ant.position.alongEdge.distance - ant.position.distance;
            if (edgeLengthRemaining < movementRemaining) {
                ant.layPheromone();
                ant.moveTo(ant.chooseNextNode(), 0);
                movementRemaining -= edgeLengthRemaining;
            }
            else {
                ant.position.distance += movementRemaining;
                movementRemaining = 0;
            }
            if (ant.task.isComplete) {
                scenario.completeAntTask(ant);
                movementRemaining = 0;
            }
            if (movementRemaining <= 0) {
                antMoving = false;
            }
        }
    },
    toDetailedString: function() {
        return "This ant colony has " + this.ants.length + " members.";
    }
});