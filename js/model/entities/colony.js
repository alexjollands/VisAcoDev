/**
 * Created by Alex on 17/02/2016.
 */


var Colony = Class({
    initialize: function(ants) {
        this.ants = ants;
        this.numActiveAnts = 0;
        this.deployingAnts = true;
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
            if (this.ants[i].isActive){
                this.updateAnt(this.ants[i]);
            }
        }
    },
    updateAnt: function(ant) {
        var movementRemaining = controller.antMovementPerUpdate;
        var antMoving = true;
        while (antMoving) {
            var edgeLengthRemaining = ant.position.alongEdge.distance - ant.position.distance;
            if (ant.task.isComplete) {
                if (edgeLengthRemaining < movementRemaining){
                    if (controller.antMovementPerUpdate > ant.position.alongEdge.distance){
                        ant.layPartialPheromone(controller.pheromoneDepositRate);
                    }
                    scenario.completeAntTask(ant);
                    movementRemaining = 0;
                }
            }
            if (edgeLengthRemaining < movementRemaining) {
                ant.moveTo(ant.chooseNextNode(), 0);
                movementRemaining -= edgeLengthRemaining;
            }
            else {
                var pheromoneToDeposit = scenario.calculatePheromoneDeposit(ant.position);
                ant.layPartialPheromone(pheromoneToDeposit);
                ant.position.distance += movementRemaining;
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


/* layPartialPheromone() - this allows a set amount of pheromone to be laid. This is calculated as:
        PHD = PDR / Math.floor(ED / M)
 */