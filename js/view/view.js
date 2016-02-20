/**
 * Created by Alex on 20/02/2016.
 */

var View = Class({
    initialize: function() {

    },
    setup: function(){
        this.canvas = document.getElementById("canvas");
        this.scene = new THREE.Scene();
        this.birdseye_cam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
        this.scene.add(this.birdseye_cam);
        this.camera = this.birdseye_cam;
        this.birdseye_cam.position.x = 0;
        this.birdseye_cam.rotation.x = -Math.PI / 2;
        this.birdseye_cam.position.y = 0;
        this.birdseye_cam.position.z = 250;
        this.birdseye_cam.up = new THREE.Vector3(0,0,1);
        this.controls = new THREE.FlyControls( this.camera );
        this.controls.movementSpeed = 500;
        this.controls.domElement = this.canvas;
        this.controls.rollSpeed = Math.PI / 24;
        this.controls.autoForward = false;
        this.controls.dragToLook = true;
        this.ambientLight = new THREE.AmbientLight( 0x303030 );
        this.scene.add(this.ambientLight);
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize( window.innerWidth, window.innerHeight);
        this.renderer.shadowMapEnabled = true;
        this.renderer.setClearColor( 0xffffff, 0);
        this.canvas.appendChild( this.renderer.domElement );
        window.addEventListener( 'resize', this.onWindowResize, false );
    },
    animate: function(){
        this.render();
        requestAnimationFrame( this.animate() );
    },
    onWindowResize: function(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    },
    render: function(){
        this.renderer.render( this.scene, this.camera );
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
        for (var i = 0; i < nodes.length; i++){
            var nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeMesh.position.set(nodes[i].x, nodes[i].y, 0);
            this.vNodes.push(nodeMesh);
            graphMesh.add(nodeMesh);
        }
        /* Edges */
        var edges = controller.graph.edges;
        for (var j = 0; j < edges.length; j++){
            var edge = this.createEdge(edges[j].nodeA, edges[j].nodeB, edges[j].pheromoneLevel);
            this.vEdges.push(edge);
            graphMesh.add(edge);
        }
        return graphMesh;
    },
    createEdge: function(nodeA, nodeB, pheromoneLevel){
        var vector = new THREE.Vector3(nodeB.x - nodeA.x, nodeB.y - nodeA.y, 0);
        var p = new THREE.Vector3(vector.y, -vector.x, 0);
        var length = Math.sqrt(p.x * p.x + p.y * p.y);
        var n = new THREE.Vector3(p.x / length, p.y / length, 0);
        var colourStrength = this.calculateColourFromPheromoneLevel(pheromoneLevel);
        var width = 0.5;
        var rectShape = new THREE.Shape();
        rectShape.moveTo( nodeB.x + n.x * width / 2, nodeB.y + n.y * width / 2 ); // m3
        rectShape.lineTo( nodeA.x - n.x * width / 2, nodeA.y - n.y * width / 2 ); // X2
        rectShape.lineTo( nodeB.x + n.x * width / 2, nodeB.y + n.y * width / 2 ); // X3
        rectShape.lineTo( nodeB.x - n.x * width / 2, nodeB.y - n.y * width / 2 ); // X4
        rectShape.lineTo( nodeA.x + n.x * width / 2, nodeA.y + n.y * width / 2 ); // X1
        var rectGeom = new THREE.ShapeGeometry( rectShape );
        return new THREE.Mesh(rectGeom, new THREE.MeshBasicMaterial({color: colourStrength}));
    },
    calculateColourFromPheromoneLevel: function(pheromoneLevel){
        var red = "ff";
        var scaled = pheromoneLevel * 20;
        if (scaled > 255) { scaled = 255; }
        var greenBlue = 255 - scaled;
        var hex = Math.floor(greenBlue).toString(16);
        if (hex.length == 1) { hex = "0" + hex; }
        var colour = "0x" + red + hex + hex;
        return Number(colour);
    }

});