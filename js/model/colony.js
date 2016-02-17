/**
 * Created by Alex on 17/02/2016.
 */


var Colony = Class({
    initialize: function(ants) {
        this.ants = ants;
    },
    toDetailedString: function() {
        return "This ant colony has " + this.ants.length + " members.";
    }
});