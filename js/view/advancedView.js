/**
 * Created by Alex on 10/03/2016.
 */
var AdvancedView = Class({
    initialize: function() {
        setupView();
        setupRenderer();
        v_graph = this.representModel();
        this.v_edgesSR = [];
        scene.add(v_graph);
        birdseye_cam.position.x = 85;
        birdseye_cam.position.y = 85;
        birdseye_cam.position.z = 185;
        //birdseye_cam.lookAt(new THREE.Vector3(0,0,0));
        render();
    },
    representModel: function(){

        /* Container graph */
        var graphGeometry = new THREE.Geometry();
        var graphMaterial = new THREE.MeshBasicMaterial({color: 0xff9900});
        var graphMesh = new THREE.Mesh(graphGeometry, graphMaterial);
        this.graphMesh = graphMesh;

        /* Nodes */
        this.createCitySprites();
        this.createNodes();

        /* Edges */
        var edges = controller.graph.edges;
        for (var j in edges){
            var edge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel);
            v_edges.push(edge);
            graphMesh.add(edge);
            var vEdgeSR = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel);
            v_edgesSR.push(vEdgeSR);
        }
        setupShortestRouteDisplay(graphMesh);

        return graphMesh;
    },
    updateModel: function(){
        console.log("Updating ants");
        if (controller.currentIteration < controller.maximumIterations) {
            controller.performACOIteration();
        }
    },
    updateEdges: function(){
        for (var i in v_edges){
            if (controller.graph.edges[i].pheromoneLevel < 0.5){
                if (!this.isShortestPathEdge(v_edges[i])){
                    v_edges[i].visible = false;
                }
            }
            else {
                v_edges[i].visible = true;
                v_edges[i].material.color.setHex(calculateColourFromPheromoneLevel(controller.graph.edges[i].pheromoneLevel));
                v_edges[i].position.z = controller.graph.edges[i].pheromoneLevel / 100;
                if (v_edges[i].position.z > 3) { v_edges[i].position.z = 3; }

            }
        }
        refreshShortestRouteDisplay();
        if (scenario.showShortestRoute){
            if (controller.shortestRoute.visitedNodes != []){
                var route = controller.shortestRoute.visitedNodes;
                for (var j = 0; j < route.length; j++){
                    var vEdge;
                    if (j + 1 == route.length){
                        vEdge = controller.graph.findSRViewEdge(route[j], route[1]);
                    }
                    else {
                        vEdge = controller.graph.findSRViewEdge(route[j], route[j + 1]);
                    }
                    vEdge.visible = true;
                }
            }
        }
    },
    updateAnts: function(){
        if (scenario.displayAnts){
            // Update individual ant graphics (position, orientation etc) if appropriate.
        }
    },
    /* Calculations of the vectors for variable-width rectangles inspired by
     * http://stackoverflow.com/questions/7854043/drawing-rectangle-between-two-points-with-arbitrary-width
     */
    createEdge: function(nodeA, nodeB, pheromoneLevel){
        var vector = new THREE.Vector3(nodeB.x - nodeA.x, nodeB.y - nodeA.y, 0);
        var p = new THREE.Vector3(vector.y, -vector.x, 0);
        var length = Math.sqrt(p.x * p.x + p.y * p.y);
        var n = new THREE.Vector3(p.x / length, p.y / length, 0);
        var colourStrength = calculateColourFromPheromoneLevel(pheromoneLevel);
        var width = 0.8;
        var rectShape = new THREE.Shape();
        rectShape.moveTo( nodeB.x + n.x * width / 2, nodeB.y + n.y * width / 2 ); // m3
        rectShape.lineTo( nodeA.x - n.x * width / 2, nodeA.y - n.y * width / 2 ); // X2
        rectShape.lineTo( nodeB.x + n.x * width / 2, nodeB.y + n.y * width / 2 ); // X3
        rectShape.lineTo( nodeB.x - n.x * width / 2, nodeB.y - n.y * width / 2 ); // X4
        rectShape.lineTo( nodeA.x + n.x * width / 2, nodeA.y + n.y * width / 2 ); // X1
        var rectGeom = new THREE.ShapeGeometry( rectShape );
        return new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({color: colourStrength}));
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
        var nodes = controller.graph.nodes;
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
            if (!scenario.showCitySprite){
                citySprite.visible = false;
            }
            this.citySprites.push(citySprite);
        }
    },
    isShortestPathEdge: function(edge){
        var edgeColour = rgbToHex(edge.material.color.r, edge.material.color.g, edge.material.color.b);
        return edgeColour == shortestPathColour;
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

    }

});