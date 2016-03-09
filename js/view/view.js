/**
 * Created by Alex on 20/02/2016.
 */

var camera,birdseye_cam,scene,renderer,controls,canvas,ambientLight,particleSystem,particles,cameraPosition,antSprite;
var clock = new THREE.Clock();
var v_graph;
var v_nodes = [];
var v_edges = [];
var v_ants = [];
var canvasScale = 1.1;
var feedback = true;

function render() {
    renderer.render( scene, camera );
}

function animate() {
    view.updateModel();
    view.updateEdges();
    view.updateAnts();
    var delta = clock.getDelta();
    controls.update( delta );
    feedbackInformation();
    render();
    requestAnimationFrame(animate);
}

/* Basic setup - custom changes done in view packages */
function setupView(){
    canvas = document.getElementById("canvas");
    scene = new THREE.Scene();
    birdseye_cam = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
    scene.add(birdseye_cam);
    camera = birdseye_cam;
    birdseye_cam.position.x = 150;
    //birdseye_cam.rotation.x = -Math.PI / 2;
    birdseye_cam.position.y = 150;
    birdseye_cam.position.z = 350;
    //birdseye_cam.up = new THREE.Vector3(0,0,1);

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 500;
    controls.domElement = canvas;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = true;
    ambientLight = new THREE.AmbientLight( 0x303030 );
    scene.add(ambientLight);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth / canvasScale, window.innerHeight / canvasScale);
    render();
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( window.innerWidth / canvasScale, window.innerHeight / canvasScale);
    renderer.shadowMapEnabled = true;
    renderer.setClearColor( 0xffffff, 0);
    canvas.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
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

function feedbackInformation(){
    if (cameraPosition == undefined){
        cameraPosition = document.getElementById("cameraPosition");
    }
    if (feedback){
        cameraPosition.innerHTML = "x: " + birdseye_cam.position.x + " y: " + birdseye_cam.position.y + " z: " + birdseye_cam.position.z;
    }
}