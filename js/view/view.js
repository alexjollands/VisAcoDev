/**
 * Created by Alex on 20/02/2016.
 */

var camera,birdseye_cam,scene,renderer,controls,displaySection,tabSection,tabSection,ambientLight,particleSystem,particles,cameraPosition,antSprite;
var clock = new THREE.Clock();
var v_graph;
var v_nodes = [];
var v_edges = [];
var v_ants = [];
var canvasScale = 1.5;
var feedback = true;
var tabs = [];
var ctx2D;

var width;
var height;
var displaySectionMaxWidth = 1000;
var displaySectionMaxHeight = 1000;

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
    displaySection = document.getElementById("displaySection");
    width = window.innerWidth / canvasScale;
    height = window.innerHeight / canvasScale;
    if (width > displaySectionMaxWidth){ width = displaySectionMaxWidth; }
    if (height > displaySectionMaxHeight){ height = displaySectionMaxHeight; }
    scene = new THREE.Scene();
    birdseye_cam = new THREE.PerspectiveCamera( 45, width / height, 1, 10000);
    scene.add(birdseye_cam);
    camera = birdseye_cam;
    birdseye_cam.position.x = 150;
    //birdseye_cam.rotation.x = -Math.PI / 2;
    birdseye_cam.position.y = 150;
    birdseye_cam.position.z = 350;
    //birdseye_cam.up = new THREE.Vector3(0,0,1);

    controls = new THREE.FlyControls( camera );
    controls.movementSpeed = 500;
    controls.domElement = displaySection;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = true;
    ambientLight = new THREE.AmbientLight( 0x303030 );
    scene.add(ambientLight);
}

function setupTabs(){
    tabSection = document.getElementById("tabSection");
    tabSection.width = width;
    tabSection.height = height / 10;
    ctx2D = tabSection.getContext('2d');
    tabs.push(new Tab(0, 0, 100, 50, 'blue'));
    tabs.push(new Tab(100, 0, 100, 50, 'red'));
    tabs.push(new Tab(200, 0, 100, 50, 'yellow'));
    tabs.push(new Tab(300, 0, 100, 50, 'orange'));

    tabSection.onclick = function(e) {

        var r = tabSection.getBoundingClientRect(),
            x = e.clientX - r.left,
            y = e.clientY - r.top;

        for(var i = 0, tab; tab = tabs[i++];) {
            tab.getPath(ctx2D);

            if (ctx2D.isPointInPath(x, y)) {
                // got a hit, update content
                ctx2D.fillStyle = tab.color;
                ctx2D.fillRect(0, tab.height + 1, ctx2D.canvas.width, 400);
                return;
            }
        }
    };
}

function onWindowResize() {
    width = window.innerWidth / canvasScale;
    height = window.innerHeight / canvasScale;
    if (width > displaySectionMaxWidth){ width = displaySectionMaxWidth; }
    if (height > displaySectionMaxHeight){ height = displaySectionMaxHeight; }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    tabSection.width = width;
    tabSection.height = height / 10;
    render();
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( width, height);
    renderer.shadowMapEnabled = true;
    renderer.setClearColor( 0xffffff, 0);
    displaySection.appendChild( renderer.domElement );
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
