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
        this.particle.x = -500;
    },
    showParticle: function(){
        // Return to original position
        this.particle.x = this.x;
        this.particle.y = this.y;
        this.particle.z = this.z;
    }
});
