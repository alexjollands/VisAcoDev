/**
 * Created by Alex on 10/03/2016.
 */
var AdvancedView = Class({
    initialize: function() {
        setupView();
        setupRenderer();
        v_graph = this.representModel();
        scene.add(v_graph);
        birdseye_cam.position.x = 80;
        birdseye_cam.position.y = 85;
        birdseye_cam.position.z = 175;
        //birdseye_cam.lookAt(new THREE.Vector3(0,0,0));
        render();
    },
    representModel: function(){

        /* Container graph */
        var graphGeometry = new THREE.Geometry();
        var graphMaterial = new THREE.MeshBasicMaterial({color: 0xff9900});
        var graphMesh = new THREE.Mesh(graphGeometry, graphMaterial);

        /* Nodes */
        this.createCitySprites();
        var nodes = controller.graph.nodes;
        for (var i in nodes){
            var node = this.citySprites[random(0, this.citySprites.length - 1)].clone();
            node.needsUpdate = true;
            node.position.set(nodes[i].x, nodes[i].y, 3.1);
            //node.scale.set(7.5,12.5,0);
            v_nodes.push(node);
            graphMesh.add(node);
        }

        /* Edges */
        var edges = controller.graph.edges;
        for (var j in edges){
            var edge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel);
            v_edges.push(edge);
            graphMesh.add(edge);
        }

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
                v_edges[i].visible = false;
            }
            else {
                v_edges[i].visible = true;
                v_edges[i].material.color.setHex(calculateColourFromPheromoneLevel(controller.graph.edges[i].pheromoneLevel));
                v_edges[i].position.z = controller.graph.edges[i].pheromoneLevel / 100;
                if (v_edges[i].position.z > 3) { v_edges[i].position.z = 3; }
            }
        }
    },
    updateAnts: function(){
        if (scenario.displayAnts){
            // Update individual ant position, orientation, graphics etc if appropriate.
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
    }
});
