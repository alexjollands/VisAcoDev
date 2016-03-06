/**
 * Created by Alex on 26/02/2016.
 */

var NaturalView = Class({
    initialize: function() {
        setupView();
        setupRenderer();
        v_graph = this.representModel();
        scene.add(v_graph);
        birdseye_cam.position.x = 275;
        birdseye_cam.position.y = 150;
        birdseye_cam.position.z = 325;
        birdseye_cam.lookAt(new THREE.Vector3(125,150,0));
        render();
    },
    representModel: function(){

        // Container graph
        var graphGeometry = new THREE.Geometry();
        var graphMaterial = new THREE.MeshBasicMaterial({color: 0xff9900});
        var graphMesh = new THREE.Mesh(graphGeometry, graphMaterial);

        // Nest
        var nestImage = THREE.ImageUtils.loadTexture(url + 'images/ant-nest.png');
        var nestMaterial = new THREE.SpriteMaterial( { map: nestImage, color: 0xffffff, fog: true } );
        var nestSprite = new THREE.Sprite( nestMaterial );
        nestSprite.position.set(50,50,10);
        nestSprite.scale.set(15,15,0);
        graphMesh.add(nestSprite);

        // Food
        var foodImage = THREE.ImageUtils.loadTexture(url + 'images/ant-food.png');
        var foodMaterial = new THREE.SpriteMaterial( { map: foodImage, color: 0xffffff, fog: true } );
        var foodSprite = new THREE.Sprite( foodMaterial );
        foodSprite.position.set(225,225,10);
        foodSprite.scale.set(15,15,0);
        graphMesh.add(foodSprite);

        // Pheromone particles
        particles = new THREE.Geometry();
        var pMaterial = new THREE.ParticleBasicMaterial({color: 0xff0000, size: 0.2, transparent: true});

        // Edges
        var edges = controller.graph.edges;
        for (var j in edges){
            var edge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel, particles);
            v_edges.push(edge);
        }
        particleSystem = new THREE.ParticleSystem(particles, pMaterial);
        particleSystem.geometry.__dirtyVertices = true;
        scene.add(particleSystem);

        return graphMesh;
    },
    updateModel: function(){
        console.log("Updating ants");
        if (controller.currentIteration < controller.maximumIterations) {
            controller.performACOIteration();
        }
    },
    updateEdges: function(){
        for (var i = 0; i < v_edges.length; i++){
            var phL = controller.graph.edges[i].pheromoneLevel;
            var numPheromoneDots = phL * 100;
            if (v_edges[i].particles.length < numPheromoneDots){
                numPheromoneDots = v_edges[i].particles.length;
            }
            if (v_edges[i].visibleParticles.length < numPheromoneDots){
                for (var addDots = 0; addDots < numPheromoneDots; addDots++){
                    var newParticleNum = random(0, v_edges[i].particles.length - 1);
                    var newParticle = v_edges[i].particles.splice(newParticleNum, 1);
                    v_edges[i].visibleParticles.push(newParticle[0]);
                    newParticle[0].showParticle();
                }
            }
            else {
                var diff = v_edges[i].visibleParticles.length - numPheromoneDots;
                for (var removeDots = 0; removeDots < diff; removeDots++){
                    var remParticleNum = random(0, v_edges[i].visibleParticles.length - 1);
                    var remParticle = v_edges[i].visibleParticles.splice(remParticleNum, 1);
                    v_edges[i].particles.push(remParticle[0]);
                    remParticle[0].hideParticle();
                }
            }
        }
        particleSystem.geometry.verticesNeedUpdate = true;
    },
    createEdge: function(nodeA, nodeB, pheromoneLevel, particles){

        var particleEdge = {};
        particleEdge.particles = [];
        particleEdge.visibleParticles = [];
        var maxDots = 500;
        var p1 = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        var p2 = new THREE.Vector3(nodeB.x, nodeB.y, 0);
        var distance = p1.clone().sub(p2).length();
        var dotGap = distance / maxDots;

        for (var i = 0; i < maxDots; i++) {
            var nextDot = getPointInBetweenByLength(p1, p2, (dotGap * i) + 1);
            var pX = Math.random() < 0.5 ? ( 1 + randomDecimal(0, 0.025)) * nextDot.x : ( 1 - randomDecimal(0, 0.025)) * nextDot.x;
            var pY = Math.random() < 0.5 ? ( 1 + randomDecimal(0, 0.025)) * nextDot.y : ( 1 - randomDecimal(0, 0.025)) * nextDot.y;
            var pZ = nextDot.z;
            var particle = new THREE.Vector3(pX, pY, pZ);
            var pheromone = new Pheromone(pX, pY, pZ, particle);
            particles.vertices.push(pheromone.particle);
            particleEdge.particles.push(pheromone);
            pheromone.hideParticle();
        }
        return particleEdge;
    }

});