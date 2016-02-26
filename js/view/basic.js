/**
 * Created by Alex on 07/02/2016.
 */
var camera,birdseye_cam,scene,renderer,controls,canvas,ambientLight;
var clock = new THREE.Clock();
var v_graph;
var v_nodes = [];
var v_edges = [];
var canvasScale = 1.7;

function initialiseView(){

    /* Scene, camera, light and renderer setup */
    setupView();
    setupRenderer();

    /* Initial object setup */
    v_graph = setupModel();
    scene.add(v_graph);
    birdseye_cam.lookAt(new THREE.Vector3(80,60,0));
    render();
}

function render() {
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / canvasScale, window.innerHeight / canvasScale);
    render();
}

function animate() {
    console.log("Updating ants");
    if (controller.currentIteration < controller.maximumIterations) {
        controller.performACOIteration();
    }
    var delta = clock.getDelta();
    controls.update( delta );
    updateEdges();
    render();
    requestAnimationFrame( animate );
}

function setupView(){
    canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
    birdseye_cam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
    scene.add(birdseye_cam);
    camera = birdseye_cam;
    birdseye_cam.position.x = 0;
    birdseye_cam.rotation.x = -Math.PI / 2;
    birdseye_cam.position.y = 0;
    birdseye_cam.position.z = 250;
    birdseye_cam.up = new THREE.Vector3(0,0,1);

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 500;
    controls.domElement = canvas;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = true;
    ambientLight = new THREE.AmbientLight( 0x303030 );
    scene.add(ambientLight);
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( window.innerWidth / canvasScale, window.innerHeight / canvasScale);
    renderer.shadowMapEnabled = true;
    renderer.setClearColor( 0xffffff, 0);
    canvas.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}

function setupModel(){
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
    for (var i in edges){
        var edge = createEdge(edges[i].nodeA, edges[i].nodeB, edges[i].pheromoneLevel);
        v_edges.push(edge);
        graphMesh.add(edge);
    }

    return graphMesh;
}

function calculateColourFromPheromoneLevel(pheromoneLevel){
    var red = "ff";
    var scaled = pheromoneLevel * 20;
    if (scaled > 255) { scaled = 255; }
    var greenBlue = 255 - scaled;
    var hex = Math.floor(greenBlue).toString(16);
    if (hex.length == 1) { hex = "0" + hex; }
    var colour = "0x" + red + hex + hex;
    return Number(colour);
}


/* Calculations of the vectors for variable-width rectangles inspired by
 * http://stackoverflow.com/questions/7854043/drawing-rectangle-between-two-points-with-arbitrary-width
 */
function createEdge(nodeA, nodeB, pheromoneLevel){
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
    return new THREE.Mesh( rectGeom, new THREE.MeshBasicMaterial( { color: colourStrength } ) ) ;
}

function updateEdges(){
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
}