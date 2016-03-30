/**
 * Created by Alex on 20/02/2016.
 */

var camera,birdseye_cam,scene,renderer,controls,displaySection,tabSection,ambientLight;
var redParticleSystem,blueParticleSystem,redParticles,blueParticles,cameraPosition,antSprite,userSettings,agentRedSprite,agentBlueSprite;
var clock = new THREE.Clock();
var v_graph;
var v_nodes = [];
var v_nodesA = [];
var v_nodesB = [];
var v_edges = [];
var v_edgesSR = [];
var v_edgesRed = [];
var v_edgesBlue = [];
var v_ants = [];
var canvasScale = 1.2;
var feedback = false;
var tabs = [];
var ctx2D;
var width;
var height;
var displaySectionMaxWidth = 1000;
var displaySectionMaxHeight = 1000;
var currentlyAnimating = true;
var tabHeightScale = 12;
var shortestPathColour = "0x00FF00";
var tabgroup = {};
var refreshParameters = false;
var menuLoadComplete = false;

function render() {
    renderer.render( scene, camera );
}

function animate() {
    if (currentlyAnimating) {
        view.updateModel();
        view.updateEdges();
        view.updateAnts();
        var delta = clock.getDelta();
        //controls.update(delta);
        updateMenu();
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
    birdseye_cam.position.y = 150;
    birdseye_cam.position.z = 350;
    ambientLight = new THREE.AmbientLight( 0x303030 );
    scene.add(ambientLight);
}

function setupTabs(){
    var tabSize = width / 5;
    var tabSpacing = tabSize;
    tabgroup.nest = new Tab("Nest-Food Scenario", 0, 0, tabSize, height / tabHeightScale, 'black', 'b-nest-food2.png');
    tabgroup.agents = new Tab("TSP (Agents)", tabSpacing, 0, tabSize, height / tabHeightScale, 'black', 'b-tsp-agents.png');
    tabgroup.advanced = new Tab("TSP (Advanced)", (tabSpacing += tabSize), 0, tabSize, height / tabHeightScale, 'black', 'b-tsp-advanced2.png');
    $("#menulst li a").click(function(e){ $("#menulst li").removeClass('tab-current'); $(this).parent().addClass('tab-current'); });
    $("#nest").click(function(e){e.preventDefault(); tabgroup.nest.performAction(); });
    $("#agents").click(function(e){e.preventDefault(); tabgroup.agents.performAction(); });
    $("#advanced").click(function(e){e.preventDefault(); tabgroup.advanced.performAction(); });
}

function updateMenu(){
    if (menuLoadComplete){
        populateMenuParameters(scenario.menuName);
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
    render();
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( width, height);
    renderer.shadowMapEnabled = true;
    renderer.setClearColor( 0xffffff, 0);
    removeExistingCanvas(displaySection);
    displaySection.appendChild( renderer.domElement );
    //renderer.domElement.addEventListener("mousedown", doMouseDown, false);
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
    v_edgesRed = [];
    v_edgesBlue = [];
    v_edgesSR = [];
    v_ants = [];
}

function removeExistingCanvas(displaySection){
    var numNodes = displaySection.childNodes.length;
    for (var i = 0; i < numNodes; i++){
        displaySection.removeChild(displaySection.childNodes[i]);
    }
}


function loadMenu(menuName){
    if ($("#control-menu-content")){
        $("#control-menu-content").load( url + "/menu/" + menuName + ".html", function() {
            menuLoadComplete = true;
            resetMenu();
        } );
    }
}

function resetMenu(){
    document.getElementById("control-menu").innerHTML = '' +
        '<ul id="control-menu" class="nav nav-tabs" id="uiTabs">' +
        '<li class="active"><a data-toggle="tab" href="#uit-controls">Controls</a></li>' +
        '<li><a data-toggle="tab" href="#uit-advanced">Advanced</a></li>' +
        '<li><a data-toggle="tab" href="#uit-info">Information</a></li></ul>';
}

function createNewScenario(viewType){
    switch (viewType){
        case "Nest-Food Scenario":          return new NaturalScenario();   break;
        case "TSP (Agents)":                return new AgentScenario();     break;
        case "TSP (Advanced)":              return new AdvancedScenario();  break;
        case "Network (Real World)":        return new NaturalScenario();   break;
        case "Google Maps (Real World)":    return new NaturalScenario();   break;
    }
}

function restartScenario(viewType){
    switch (viewType) {
        case "Nest-Food Scenario":  tabgroup.nest.performAction();
            break;
        case "TSP (Agents)":        tabgroup.agents.performAction();
            break;
        case "TSP (Advanced)":      tabgroup.advanced.performAction();
            break;
    }
}