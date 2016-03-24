/**
 * Created by Alex on 07/02/2016.
 */
var AgentView = Class({
    initialize: function() {
        setupView();
        setupRenderer();
        v_graph = this.representModel();
        scene.add(v_graph);
        birdseye_cam.position.x = 90;
        birdseye_cam.position.y = 75;
        birdseye_cam.position.z = 200;
        render();
    },
    representModel: function(){
        /* Container graph */
        var graphGeometry = new THREE.Geometry();
        var graphMaterial = new THREE.MeshBasicMaterial({color: 0xff9900});
        var graphMesh = new THREE.Mesh(graphGeometry, graphMaterial);
        this.graphMesh = graphMesh;

        // Agents
        var agentRedImage = THREE.ImageUtils.loadTexture(url + 'images/agentRed.png');
        var agentRedMaterial = new THREE.SpriteMaterial( { map: agentRedImage, color: 0xffffff, fog: true } );
        agentRedSprite = new THREE.Sprite( agentRedMaterial );
        agentRedSprite.position.set(55,53,10);
        agentRedSprite.scale.set(8,8,0);
        v_ants.push(agentRedSprite);
        graphMesh.add(agentRedSprite);

        var agentBlueImage = THREE.ImageUtils.loadTexture(url + 'images/agentBlue.png');
        var agentBlueMaterial = new THREE.SpriteMaterial( { map: agentBlueImage, color: 0xffffff, fog: true } );
        agentBlueSprite = new THREE.Sprite( agentBlueMaterial );
        agentBlueSprite.position.set(0,53,10);
        agentBlueSprite.scale.set(8,8,0);
        v_ants.push(agentBlueSprite);
        graphMesh.add(agentBlueSprite);

        /* Nodes */
        this.createCitySprites();
        this.createNodes();

        // Pheromone particles
        redParticles = new THREE.Geometry();
        var redPMaterial = new THREE.ParticleBasicMaterial({color: 0xff0000, size: 1.2, transparent: true});
        blueParticles = new THREE.Geometry();
        var bluePMaterial = new THREE.ParticleBasicMaterial({color: 0x0000ff, size: 1.2, transparent: true});

        /* Edges */
        var edges = controller.graph.edges;
        for (var j in edges){
            var redEdge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel, "red");
            var blueEdge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel, "blue");
            v_edgesRed.push(redEdge);
            v_edgesBlue.push(blueEdge);
            graphMesh.add(redEdge);
            graphMesh.add(blueEdge);
        }

        redParticleSystem = new THREE.ParticleSystem(redParticles, redPMaterial);
        redParticleSystem.geometry.__dirtyVertices = true;
        scene.add(redParticleSystem);
        blueParticleSystem = new THREE.ParticleSystem(blueParticles, bluePMaterial);
        blueParticleSystem.geometry.__dirtyVertices = true;
        scene.add(blueParticleSystem);

        return graphMesh;
    },
    updateModel: function(){
        console.log("Updating ants");
        if (controller.currentIteration < controller.maximumIterations) {
            controller.performACOIteration();
        }
    },
    updateEdges: function(){
        this.updateColouredEdge("red");
        this.updateColouredEdge("blue");
        redParticleSystem.geometry.verticesNeedUpdate = true;
        blueParticleSystem.geometry.verticesNeedUpdate = true;
    },
    updateColouredEdge: function(colour){
        var vEdges = colour == "red" ? v_edgesRed : v_edgesBlue;
        for (var i = 0; i < vEdges.length; i++){
            var phL = vEdges[i].pheromoneLevel;
            var numPheromoneDots = phL * 100;
            if (vEdges[i].particles.length < numPheromoneDots){
                numPheromoneDots = vEdges[i].particles.length;
            }
            var diff = numPheromoneDots - vEdges[i].visibleParticles.length;
            if (diff > 1){
                for (var addDots = 0; addDots < diff; addDots++){
                    var newParticleNum = this.choosePheromoneParticle(controller.graph.edges[i], vEdges[i]);
                    var newParticle = vEdges[i].particles.splice(newParticleNum, 1);
                    if (newParticle[0] != undefined) {
                        vEdges[i].visibleParticles.push(newParticle[0]);
                        newParticle[0].showParticle();
                    }
                }
            }
            else if (diff < -1) {
                diff = Math.abs(diff);
                for (var removeDots = 0; removeDots < diff; removeDots++){
                    var remParticleNum = random(0, vEdges[i].visibleParticles.length - 1);
                    var remParticle = vEdges[i].visibleParticles.splice(remParticleNum, 1);
                    vEdges[i].particles.push(remParticle[0]);
                    remParticle[0].hideParticle();
                }
            }
        }
    },
    updateAnts: function() {
        if (scenario.displayAnts) {
            for (var i = 0; i < controller.colony.ants.length; i++) {
                var ant = controller.colony.ants[i];
                if (v_ants.length < i + 1) {
                    var sprite = agentBlueSprite;
                    if (i < scenario.numRedAgents) {
                        sprite = agentRedSprite;
                    }
                    var vAntMaterial = sprite.material.clone();
                    vAntMaterial.needsUpdate = true;
                    var vAnt = sprite.clone();
                    vAnt.material = vAntMaterial;
                    v_ants.push(vAnt);
                    v_graph.add(vAnt);
                }
                // Update position
                var antPos = ant.getXYCoordinates();
                v_ants[i].position.set(antPos.x, antPos.y, 3);
            }
        }
    },
    /* Calculations of the vectors for variable-width rectangles inspired by
     * http://stackoverflow.com/questions/7854043/drawing-rectangle-between-two-points-with-arbitrary-width
     */
    createEdge: function(nodeA, nodeB, pheromoneLevel, colour){
        var particleEdge = {};
        particleEdge.particles = [];
        particleEdge.visibleParticles = [];
        var maxDots = 250;
        var p1 = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        var p2 = new THREE.Vector3(nodeB.x, nodeB.y, 0);
        var distance = p1.clone().sub(p2).length();
        var dotGap = distance / maxDots;
        this.particleSpacing = dotGap;
        var pheromoneSpread = 1.5;

        for (var i = 0; i < maxDots; i++) {
            var nextDot = getPointInBetweenByLength(p1, p2, (dotGap * i) + 1);
            var pX = Math.random() < 0.5 ? ( nextDot.x + (randomDecimal(0 , pheromoneSpread))) : ( nextDot.x - (randomDecimal(0, pheromoneSpread)));
            var pY = Math.random() < 0.5 ? ( nextDot.y + (randomDecimal(0 , pheromoneSpread))) : ( nextDot.y - (randomDecimal(0, pheromoneSpread)));
            var pZ = nextDot.z;
            var particle = new THREE.Vector3(pX, pY, pZ);
            var pheromone = new Pheromone(pX, pY, pZ, particle);
            if (colour == "red"){
                redParticles.vertices.push(pheromone.particle);
            }
            else if (colour == "blue"){
                blueParticles.vertices.push(pheromone.particle);
            }
            particleEdge.particles.push(pheromone);
            pheromone.hideParticle();
        }
        return particleEdge;
    },
    createCitySprites: function(){
        this.citySprites = [];
        var images = [];
        var scale = 0.7;
        images.push({path:"b1.png", w: 10*scale, h: 10*scale});
        images.push({path:"b2.png", w: 15*scale, h: 9*scale});
        images.push({path:"b3.png", w: 14*scale, h: 16*scale});
        images.push({path:"b4.png", w: 15*scale, h: 12*scale});
        images.push({path:"b5.png", w: 15*scale, h: 12*scale});
        images.push({path:"b6.png", w: 15*scale, h: 12*scale});
        images.push({path:"b7.png", w: 16*scale, h: 12*scale});
        images.push({path:"b8.png", w: 15*scale, h: 12*scale});
        images.push({path:"b9.png", w: 10*scale, h: 25*scale});
        images.push({path:"b10.png", w: 10*scale, h: 25*scale});
        images.push({path:"b11.png", w: 10*scale, h: 25*scale});
        images.push({path:"b12.png", w: 15*scale, h: 20*scale});

        for (var i = 0; i < images.length; i++){
            var cityImage = THREE.ImageUtils.loadTexture(url + 'images/buildings/' + images[i].path);
            var cityMaterial = new THREE.SpriteMaterial( { map: cityImage, color: 0xffffff, fog: true } );
            var citySprite = new THREE.Sprite( cityMaterial );
            citySprite.scale.set(images[i].w,images[i].h,0);
            this.citySprites.push(citySprite);
        }
    },
    createNodes: function(){
        var nodes = controller.graph.nodes;
        for (var i in nodes){
            var node = this.citySprites[random(0, this.citySprites.length - 1)].clone();
            node.needsUpdate = true;
            node.position.set(nodes[i].x, nodes[i].y, 3.1);;
            v_nodesA.push(node);
            if (scenario.showCitySprite) {
                node.visible = true;
                v_nodes.push(node);
            }
            this.graphMesh.add(node);
        }
        var nodeMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        var nodeRadius = 2;
        var nodeSegments = 32;
        var nodeGeometry = new THREE.CircleGeometry( nodeRadius, nodeSegments );
        for (var j in nodes){
            var nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeMesh.position.set(nodes[j].x, nodes[j].y, 3.1);
            v_nodesB.push(nodeMesh);
            if (scenario.showCitySprite) {
                nodeMesh.visible = false;
            }
            else {
                nodeMesh.visible = true;
                v_nodes.push(nodeMesh);
            }
            this.graphMesh.add(nodeMesh);
        }
    },
    refreshNodeDisplay: function(){
        for (var i = 0; i < v_nodes.length; i++){
            v_nodes[i].visible = false;
        }
        v_nodes = [];
        if (scenario.showCitySprite){
            for (var j = 0; j < v_nodesA.length; j++){
                v_nodesA[j].visible = true;
            }
            v_nodes = v_nodesA;
        }
        else {
            for (var k = 0; k < v_nodesB.length; k++){
                v_nodesB[k].visible = true;
            }
            v_nodes = v_nodesB;
        }
    },
    choosePheromoneParticle: function(edge, vEdge){
        for (var i = 0; i < controller.colony.ants.length; i++){
            var ant = controller.colony.ants[i];
            if (ant.position.alongEdge.isEqual(edge)){
                var numParticles = vEdge.particles.length;
                var source = ant.position.fromNode;
                var isMovingForwards = source.id == edge.nodeA.id;
                var percent = ant.position.distance / edge.distance;
                var arrayScale = percent * numParticles;
                var blockRange = Math.floor(numParticles / 10);
                if (isMovingForwards){
                    var blockAmount = arrayScale - blockRange;
                    if (blockAmount < 0){ blockAmount = 0; }
                    return random(blockAmount, arrayScale);
                }
                else {
                    var blockAmount = (numParticles - arrayScale); // + blockRange;
                    if (blockAmount > numParticles - 1){ blockAmount = numParticles - 1; }
                    return random(numParticles - arrayScale, numParticles - 1);
                }
            }
        }
    }
});