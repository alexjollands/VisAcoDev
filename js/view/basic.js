/**
 * Created by Alex on 07/02/2016.
 */
var camera,birdseye_cam,scene,renderer,controls,canvas,gui,ambientLight;
var clock = new THREE.Clock();
var v_graph;
var v_nodes = [];
var v_edges = [];

var waitASec = false;

function initialiseView(){

    /* Scene, camera, light and renderer setup */
    setupSceneCameraLighting();
    setupRenderer();

    /* Initial object setup */
    v_graph = setupModel();
    scene.add(v_graph);
    birdseye_cam.lookAt(v_graph.position);
    render();
}

function render() {
    renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function animate() {

    console.log("Updating ants");
    //updatePheromoneLevels();
    //updateAnts();
    //updateEdges();
    //displayShortestRoute();

    //console.log("Wait a sec... " + waitASec);
    //if (waitASec){
    //    sleep(2);
    //    console.log("Waitin': " + waitASec);
    //}

    var delta = clock.getDelta();
    controls.update( delta );

    render();


    requestAnimationFrame( animate );
}

function setupSceneCameraLighting(){
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
    renderer.setSize( window.innerWidth, window.innerHeight);
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

//function calculateColourFromPheromoneLevel(pheromoneLevel){
//    var scaled = pheromoneLevel * 5;
//    if (scaled > 255) { scaled = 255; }
//
//    var colour = Math.floor(scaled).toString(16);
//    if (colour.length == 1) {
//        colour = "0x" + colour + "00000";
//    }
//    else {
//        colour = "0x" + colour + "0000";
//    }
//    return Number(colour);
//}

function calculateColourFromPheromoneLevel(pheromoneLevel){
    var red = "ff";
    var scaled = pheromoneLevel * 20;
    if (scaled > 255) { scaled = 255; }
    var greenBlue = 255 - scaled;
    var hex = Math.floor(greenBlue).toString(16);
    if (hex.length == 1) { hex = "0" + hex; }
    var colour = "0x" + red + hex + hex;
    return Number(colour);
    //return Number("0xffffff");
}


function calculateEdgeWidthFromDistance(nodeA, nodeB){
    /* Would be nice to have a dynamic range - using max and min lengths of the edges */
    var maxWidth = 3;
    var minWidth = 0.1;
    var scaledDistance = findRouteDistance(nodeA, nodeB);
    scaledDistance = (1 / scaledDistance) * 20;
    if (scaledDistance > maxWidth){scaledDistance = maxWidth;}
    if (scaledDistance < minWidth){scaledDistance = minWidth;}
    return scaledDistance;
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
    //var width = calculateEdgeWidthFromDistance(nodeA, nodeB);
    //var colourStrength = 0xA0A0A0;
    var width = 0.5;
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
        v_edges[i].material.color.setHex(calculateColourFromPheromoneLevel(edges[i].pheromoneLevel));
        v_edges[i].position.z = 0;
    }
}

// Edges should have an ID or index number - each node should have the edges connected to it
// As in my improved design, with each edge appearing multiple times in a linear array based on index of a node ID
function displayShortestRoute(){
    if (shortestRoute != null) {
        for (var i = 0; i < shortestRoute.visitedNodes.length; i++) {
            var nodeA = shortestRoute.visitedNodes[i];
            var nodeB;
            if (i + 1 == shortestRoute.visitedNodes.length) {
                nodeB = shortestRoute.visitedNodes[0];
            }
            else {
                nodeB = shortestRoute.visitedNodes[i + 1];
            }
            var edge = findRoute(nodeA, nodeB);
            var v_edge = findViewEdge(edge);
            if (v_edge == undefined){
                var stopHere = 21 * 21;
            }
            v_edge.material.color.setHex(0x00FF00);
            v_edge.position.z = 1;
        }
    }
}

// Temporary (terrible) function
function findViewEdge(edge){
    for (var i in edges){
        if (edge == edges[i]){
            return v_edges[i];
        }
    }
}

// Slow the damn thing down a second
function sleep(seconds)
{
    var e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) {}
}