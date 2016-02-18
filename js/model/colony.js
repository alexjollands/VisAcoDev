/**
 * Created by Alex on 17/02/2016.
 */


var Colony = Class({
    initialize: function(ants) {
        this.ants = ants;
    },
    updateAnts: function(){
        for (var i = 0; i < this.ants.length; i++){

            /* Whilst the ant still has distance left to run (antMovementPerUpdate), move along the edges */
            /* Calculate how much distance the ant has left to move, pass it to moveTo() */
            var nextNode = this.ants[i].chooseNextNode();
            this.ants[i].moveTo(nextNode, 50);
            //this.ants[i].layPheromone();
            //this.ants[i].checkTourComplete();
        }
    },
    toDetailedString: function() {
        return "This ant colony has " + this.ants.length + " members.";
    }
});