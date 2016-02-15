/**
 * Created by Alex on 15/02/2016.
 */

var Ant = Class({
    initialize: function(id, tour, position) {
        this.id = id;
        this.tour = tour;
        this.position = position;
    },
    toDetailedString: function() {
        return "Ant #" + this.id + " is at position: " + this.position + ", on tour: " + this.tour + ".";
    }
});