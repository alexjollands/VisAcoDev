/**
 * Created by Alex on 03/03/2016.
 */

var Pheromone = Class({
    initialize: function(x, y, z, particle) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.particle = particle;
    },
    setParticle: function(particle){
        this.particle = particle;
    },
    getParticle: function(){
        return this.particle;
    },
    hideParticle: function(){
        // Move to behind camera
        var outOfViewCoords = scenario.getParticleHideCoordinates();
        this.particle.x = outOfViewCoords.x;
        this.particle.y = outOfViewCoords.y;
        this.particle.z = outOfViewCoords.z;
    },
    showParticle: function(){
        // Return to original position
        this.particle.x = this.x;
        this.particle.y = this.y;
        this.particle.z = this.z;
    }
});
