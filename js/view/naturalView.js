/**
 * Created by Alex on 26/02/2016.
 */

var NaturalView = Class({
    initialize: function() {
        setupView();
        setupRenderer();
        setupTabs();
        v_graph = this.representModel();
        scene.add(v_graph);
        birdseye_cam.position.x = 150;
        birdseye_cam.position.y = 133;
        birdseye_cam.position.z = 275;
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
        nestSprite.position.set(55,53,10);
        nestSprite.scale.set(15,15,0);
        graphMesh.add(nestSprite);

        // Food
        var foodImage = THREE.ImageUtils.loadTexture(url + 'images/ant-food.png');
        var foodMaterial = new THREE.SpriteMaterial( { map: foodImage, color: 0xffffff, fog: true } );
        var foodSprite = new THREE.Sprite( foodMaterial );
        foodSprite.position.set(225,225,10);
        foodSprite.scale.set(15,15,0);
        graphMesh.add(foodSprite);

        // Ant
        var antImage = THREE.ImageUtils.loadTexture(url + 'images/ant-pci.png');
        var antMaterial = new THREE.SpriteMaterial( { map: antImage, color: 0xffffff, fog: true } );
        antSprite = new THREE.Sprite( antMaterial );
        antSprite.position.set(55,53,10);
        antSprite.scale.set(8,8,0);
        graphMesh.add(antSprite);

        // Scenery
        var rockImage = THREE.ImageUtils.loadTexture(url + 'images/rock.png');
        var rockMaterial = new THREE.SpriteMaterial( { map: rockImage, color: 0xffffff, fog: true } );
        var rockSprite = new THREE.Sprite( rockMaterial );
        var rock1 = rockSprite.clone();
        rock1.position.set(215,90,10);
        rock1.scale.set(17,17,0);
        var rock2 = rockSprite.clone();
        rock2.position.set(215,115,10);
        rock2.scale.set(15,15,0);
        var rock3 = rockSprite.clone();
        rock3.position.set(215,140,10);
        rock3.scale.set(15,15,0);
        graphMesh.add(rock1);
        graphMesh.add(rock2);
        graphMesh.add(rock3);

        // Log
        var logImage = THREE.ImageUtils.loadTexture(url + 'images/log.jpg');
        var logMaterial = new THREE.SpriteMaterial( { map: logImage, color: 0xffffff, fog: true, rotation: Math.PI / 4} );
        var logSprite = new THREE.Sprite( logMaterial );
        logSprite.position.set(70,217,10);
        logSprite.scale.set(50,20,0);
        graphMesh.add(logSprite);

        // Pheromone particles
        redParticles = new THREE.Geometry();
        var redPMaterial = new THREE.ParticleBasicMaterial({color: 0xff0000, size: 1.2, transparent: true});

        var nodeMaterial = new THREE.MeshBasicMaterial({color: 0xBCBCBC});
        var nodeRadius = 2;
        var nodeSegments = 32;
        var nodeGeometry = new THREE.CircleGeometry( nodeRadius, nodeSegments );
        var nodes = controller.graph.nodes;
        for (var i in nodes){
            var nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeMesh.position.set(nodes[i].x, nodes[i].y, 3.1);
            v_nodes.push(nodeMesh);
            graphMesh.add(nodeMesh);
        }
        // Edges
        var edges = controller.graph.edges;
        for (var j in edges){
            var edge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel, redParticles);
            v_edges.push(edge);
        }
        redParticleSystem = new THREE.ParticleSystem(redParticles, redPMaterial);
        redParticleSystem.geometry.__dirtyVertices = true;
        scene.add(redParticleSystem);

        return graphMesh;
    },
    updateModel: function(){
        console.log("Updating ants");
        if (controller.currentIteration < controller.maximumIterations) {
            controller.performACOIteration();
        }
        if (controller.colony.deployingAnts){
            if (random(1,9) % 3 == 0){
                controller.colony.numActiveAnts += scenario.antReleaseSpeed;
                var numActiveAnts = Math.floor(controller.colony.numActiveAnts);
                if (controller.colonySize >= numActiveAnts){
                    for (var i = 0; i < numActiveAnts; i++){
                        controller.colony.ants[numActiveAnts-1].isActive = true;
                        if (controller.colonySize == numActiveAnts) {
                            controller.colony.deployingAnts = false;
                        }
                    }
                }
            }

        }
    },
    updateEdges: function(){
        for (var i = 0; i < v_edges.length; i++){
            var phL = controller.graph.edges[i].pheromoneLevel;
            var numPheromoneDots = phL * 100;
            if (v_edges[i].particles.length < numPheromoneDots){
                numPheromoneDots = v_edges[i].particles.length;
            }
            var diff = numPheromoneDots - v_edges[i].visibleParticles.length;
            if (diff > 1){
                for (var addDots = 0; addDots < diff; addDots++){
                    var newParticleNum = random(0, v_edges[i].particles.length - 1);
                    var newParticle = v_edges[i].particles.splice(newParticleNum, 1);
                    v_edges[i].visibleParticles.push(newParticle[0]);
                    newParticle[0].showParticle();
                }
            }
            else if (diff < -1) {
                diff = Math.abs(diff);
                for (var removeDots = 0; removeDots < diff; removeDots++){
                    var remParticleNum = random(0, v_edges[i].visibleParticles.length - 1);
                    var remParticle = v_edges[i].visibleParticles.splice(remParticleNum, 1);
                    v_edges[i].particles.push(remParticle[0]);
                    remParticle[0].hideParticle();
                }
            }
        }
        redParticleSystem.geometry.verticesNeedUpdate = true;
    },
    updateAnts: function(){
        if (scenario.displayAnts){
            for (var i = 0; i < controller.colony.ants.length; i++){
                var ant = controller.colony.ants[i];
                if (v_ants.length < i+1){
                    var vAntMaterial = antSprite.material.clone();
                    vAntMaterial.needsUpdate = true;
                    var vAnt = antSprite.clone();
                    vAnt.material = vAntMaterial;
                    v_ants.push(vAnt);
                    v_graph.add(vAnt);
                }
                // Update position
                var antPos = ant.getXYCoordinates();
                v_ants[i].position.set(antPos.x, antPos.y, antPos.z);

                // Update orientation
                var facePoint = new THREE.Vector3(ant.position.toNode.x, ant.position.toNode.y, ant.position.toNode.z);
                var antFaceDirection = getAngleBetweenTwoPoints(antPos, facePoint);
                v_ants[i].material.rotation = antFaceDirection - 1.5708;
            }
        }
    },
    createEdge: function(nodeA, nodeB, pheromoneLevel, particles){

        var particleEdge = {};
        particleEdge.particles = [];
        particleEdge.visibleParticles = [];
        var maxDots = 250;
        var p1 = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        var p2 = new THREE.Vector3(nodeB.x, nodeB.y, 0);
        var distance = p1.clone().sub(p2).length();
        var dotGap = distance / maxDots;
        var pheromoneSpread = 5;

        for (var i = 0; i < maxDots; i++) {
            var nextDot = getPointInBetweenByLength(p1, p2, (dotGap * i) + 1);
            var pX = Math.random() < 0.5 ? ( nextDot.x + (randomDecimal(0 , pheromoneSpread))) : ( nextDot.x - (randomDecimal(0, pheromoneSpread)));
            var pY = Math.random() < 0.5 ? ( nextDot.y + (randomDecimal(0 , pheromoneSpread))) : ( nextDot.y - (randomDecimal(0, pheromoneSpread)));
            var pZ = nextDot.z;
            var particle = new THREE.Vector3(pX, pY, pZ);
            var pheromone = new Pheromone(pX, pY, pZ, particle);
            redParticles.vertices.push(pheromone.particle);
            particleEdge.particles.push(pheromone);
            pheromone.hideParticle();
        }
        return particleEdge;
    }

});