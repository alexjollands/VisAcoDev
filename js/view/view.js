/**
 * Created by Alex on 20/02/2016.
 */

var camera,birdseye_cam,scene,renderer,controls,displaySection,tabSection,ambientLight,particleSystem,particles,cameraPosition,antSprite;
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
var currentlyAnimating = true;

function render() {
    renderMenu();
    renderer.render( scene, camera );
}

function animate() {
    if (currentlyAnimating) {
        view.updateModel();
        view.updateEdges();
        view.updateAnts();
        var delta = clock.getDelta();
        controls.update(delta);
        feedbackInformation();
        render();
        requestAnimationFrame(animate);
    }
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

    var tabSize = width / 5;
    var tabSpacing = tabSize;
    tabs.push(new Tab("Nest-Food Scenario", 0, 0, tabSize, height / 10, 'black', 'b-nest-food2.png'));
    tabs.push(new Tab("TSP (Basic)", tabSpacing, 0, tabSize, height / 10, 'black', 'b-tsp-basic2.png'));
    tabs.push(new Tab("TSP (Advanced)", (tabSpacing += tabSize), 0, tabSize, height / 10, 'black', 'b-tsp-advanced2.png'));
    tabs.push(new Tab("Network (Real World)", (tabSpacing += tabSize), 0, tabSize, height / 10, 'black', 'b-network.png'));
    tabs.push(new Tab("Google Maps (Real World)", (tabSpacing += tabSize), 0, tabSize, height / 10, 'black', 'b-google-maps2.png'));

    tabSection.onclick = function(e) {
        var r = tabSection.getBoundingClientRect(),
            x = e.clientX - r.left,
            y = e.clientY - r.top;

        for(var i = 0, tab; tab = tabs[i++];) {
            tab.getPath(ctx2D);

            if (ctx2D.isPointInPath(x, y)) {
                //window.alert("The " + tab.viewType + " tab was clicked.");
                tab.performAction();
                return;
            }
        }
    };
}

function renderMenu(){
    for(var i = 0, tab; tab = tabs[i++];){
        tab.render(ctx2D);
        tab.renderBorder(ctx2D);
    }
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
    setTabSizes();
    renderMenu();
    render();
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( width, height);
    renderer.shadowMapEnabled = true;
    renderer.setClearColor( 0xffffff, 0);
    removeExistingCanvas(displaySection);
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

function resetViewData(){
    v_graph = null;
    v_nodes = [];
    v_edges = [];
    v_ants = [];
}

function removeExistingCanvas(displaySection){
    var numNodes = displaySection.childNodes.length;
    for (var i = 0; i < numNodes; i++){
        displaySection.removeChild(displaySection.childNodes[i]);
    }
}

function setTabSizes(){
    var tabSize = width / 5;
    var tabSpacing = tabSize;
    tabs[0].setDimensions(0,0,tabSize, height / 10);
    for (var i = 0; i < tabs.length - 1; i++){
        tabs[i+1].setDimensions(tabSpacing + (i * tabSize), 0, tabSize, height / 10);
    }
}