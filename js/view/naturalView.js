/**
 * Created by Alex on 26/02/2016.
 */

var NaturalView = Class({
    initialize: function() {
        setupView();
        setupRenderer();
        v_graph = this.representModel();
        scene.add(v_graph);
        birdseye_cam.position.x = 75;
        birdseye_cam.position.y = 150;
        birdseye_cam.position.z = 350;
        birdseye_cam.lookAt(new THREE.Vector3(125,150,0));
        render();
    },
    representModel: function(){

        /* Container graph */
        var graphGeometry = new THREE.Geometry();
        var graphMaterial = new THREE.MeshBasicMaterial({color: 0xff9900});
        var graphMesh = new THREE.Mesh(graphGeometry, graphMaterial);

        /* Main elements */
        // Nest
        var nestImage = THREE.ImageUtils.loadTexture(url + 'images/ant-nest.png');
        var nestMaterial = new THREE.SpriteMaterial( { map: nestImage, color: 0xffffff, fog: true } );
        var nestSprite = new THREE.Sprite( nestMaterial );
        nestSprite.position.set(50,50,10);
        nestSprite.scale.set(50,50,0);
        graphMesh.add(nestSprite);

        // Food
        var foodImage = THREE.ImageUtils.loadTexture(url + 'images/ant-food.png');
        var foodMaterial = new THREE.SpriteMaterial( { map: foodImage, color: 0xffffff, fog: true } );
        var foodSprite = new THREE.Sprite( foodMaterial );
        foodSprite.position.set(250,250,10);
        foodSprite.scale.set(50,50,0);
        graphMesh.add(foodSprite);

        // Pheromone particles
        var particles = new THREE.Geometry();
        var pMaterial = new THREE.ParticleBasicMaterial({color: 0xff0000, size: 0.1});

        /* Path Nodes */
        var nodeMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        var nodeRadius = 2;
        var nodeSegments = 32;
        var nodeGeometry = new THREE.CircleGeometry( nodeRadius, nodeSegments );
        var nodes = controller.graph.nodes;
        for (var i in nodes){
            var nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeMesh.position.set(nodes[i].x, nodes[i].y, 6);
            v_nodes.push(nodeMesh);
            graphMesh.add(nodeMesh);
        }
        /* Connecting Edges with pheromone particles*/
        var edges = controller.graph.edges;
        for (var j in edges){
            var edge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel, particles);
            v_edges.push(edge);
        }
        var particleSystem = new THREE.ParticleSystem(particles, pMaterial);
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

        // Calculate how many dots there should be, depending in how much pheromone there is
        // Add or remove some as appropriate - or just set visible (?!)

        // Add more by switching some random ones visible - add all visible ones to an array
        // Remove them by removing some from the array (containing their index)

    },
    createEdge: function(nodeA, nodeB, pheromoneLevel, particles){

        var edgeParticleArray = [];
        var maxDots = 250;
        var p1 = new THREE.Vector3(nodeA.x, nodeA.y, 0);
        var p2 = new THREE.Vector3(nodeB.x, nodeB.y, 0);
        var distance = p1.clone().sub(p2).length();
        var dotGap = distance / maxDots;

        for (var i = 0; i < maxDots; i++) {
            var nextDot = getPointInBetweenByLength(p1, p2, (dotGap * i) + 1);
            //var pX = randomDecimal(0.9, 1.1) * nextDot.x;
            //var pY = randomDecimal(0.9, 1.1) * nextDot.y;

            var pX = nextDot.x;
            var pY = nextDot.y;

            var pZ = nextDot.z;
            var particle = new THREE.Vector3(pX, pY, pZ);
            particles.vertices.push(particle);
            edgeParticleArray.push(particle);
        }
        return edgeParticleArray;
    }

});