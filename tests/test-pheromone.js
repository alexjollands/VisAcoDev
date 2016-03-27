/**
 * Created by Alex on 07/03/2016.
 */

QUnit.test("Testing the Pheromone class", function( assert ) {
    /* Setup */
    controller = new Controller(params);

    var x = 100;
    var y = 250;
    var z = 0;
    var particle = new THREE.Vector3(100, 250, 0);

    var pheromone = new Pheromone(x, y, z, particle);

    assert.equal(pheromone.x, x);
    assert.equal(pheromone.y, y);
    assert.equal(pheromone.z, z);
    assert.equal(pheromone.particle, particle);

    pheromone.hideParticle();
    assert.notEqual(pheromone.particle.x, x);
    assert.notEqual(pheromone.particle.y, y);
    assert.notEqual(pheromone.particle.z, z);

    pheromone.showParticle();
    assert.equal(pheromone.particle.x, x);
    assert.equal(pheromone.particle.y, y);
    assert.equal(pheromone.particle.z, z);

});



