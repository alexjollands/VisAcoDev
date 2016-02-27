/**
 * Created by Alex on 07/02/2016.
 */
var BasicView = Class({
    initialize: function() {
        setupView();
        setupRenderer();
        v_graph = this.representModel();
        scene.add(v_graph);
        birdseye_cam.lookAt(new THREE.Vector3(80,60,0));
        render();
    },
    representModel: function(){

        /* Container graph */
        var graphGeometry = new THREE.Geometry();
        var graphMaterial = new THREE.MeshBasicMaterial({color: 0xff9900});
        var graphMesh = new THREE.Mesh(graphGeometry, graphMaterial);

        /* Nodes */
        var nodeMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
        var nodeRadius = 2;
        var nodeSegments = 32;
        var nodeGeometry = new THREE.CircleGeometry( nodeRadius, nodeSegments );
        var nodes = controller.graph.nodes;
        for (var i in nodes){
            var nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeMesh.position.set(nodes[i].x, nodes[i].y, 0);
            v_nodes.push(nodeMesh);
            graphMesh.add(nodeMesh);
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
            }
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
    }

});