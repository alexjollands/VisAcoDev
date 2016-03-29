/**
 * Created by Alex on 16/02/2016.
 */

var url = (window.location.href).replace('index.html', '');

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min, max){
    return (Math.random() * (max - min)) + min;
}

function findRouteDistance(nodeA, nodeB){
    var xDist = Math.pow(nodeA.x - nodeB.x, 2);
    var yDist = Math.pow(nodeA.y - nodeB.y, 2);
    return Math.sqrt(xDist + yDist);
}

function findShortestPathUsingBruteForce(nodes){
    var allPossibleRoutes = Combinatorics.permutation(nodes);
    allPossibleRoutes = allPossibleRoutes.toArray();
    var actualShortestRouteLength = Number.MAX_VALUE;
    var actualShortestRoute = [];
    for (var possibleRouteIndex in allPossibleRoutes){
        var routeLength = 0;
        var route = allPossibleRoutes[possibleRouteIndex];
        route.push(route[0]);
        for (var i = 0; i < route.length; i++){
            if (i == (route.length - 1)){
                routeLength += findRouteDistance(route[i], route[0]);
            }
            else {
                routeLength += findRouteDistance(route[i], route[(i + 1)]);
            }
        }
        if (routeLength < actualShortestRouteLength){
            actualShortestRoute = route;
            actualShortestRouteLength = routeLength;
        }
    }
    var bestTour = new Tour();
    bestTour.visitedNodes = actualShortestRoute;
    bestTour.totalLength = actualShortestRouteLength;
    return bestTour;
}

function manualCheckOfRoute(nodes){
    var routeLength = 0;
    for (var i = 0; i < nodes.length; i++){
        if (i == nodes.length - 1){
            routeLength += controller.graph.findEdge(nodes[i], nodes[0]).distance;
            break;
        }
        routeLength += controller.graph.findEdge(nodes[i], nodes[i+1]).distance;
    }
    console.log("Manual check route length: " + routeLength);
}

/* This function sourced from http://bit.ly/1UupBOi */
function getPointInBetweenByLength(pointA, pointB, length) {
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);
}

function getAngleBetweenTwoPoints(pointA, pointB){
    // Three dimensional angle-finding is not supported yet :)
    return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
}

function convertDegreesToRadians(degrees){
    return degrees * (Math.PI/180);
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function createNodeGridJSON(x, y, width, height, space){
    var jsonOutput = [];
    var startX = x;
    var startY = y;
    jsonOutput.push('{"nodes":[');
    var nodeID = 1;
    for (var i = 0; i < height; i++){
        for (var j = 0; j < width; j++){
            jsonOutput.push('{"nid":"' + nodeID + '", "x":"' + (x+(j*space)) + '", "y":"' + y + '"},');
            nodeID++;
        }
        y += space;
        x = startX;
    }
    jsonOutput[jsonOutput.length - 1].slice(0, -1);
    jsonOutput.push("]}");
    var htmlOutput = "";
    htmlOutput += jsonOutput[0] + " <br />";
    for (var output = 1; output < jsonOutput.length; output++){
        htmlOutput += jsonOutput[output] + " <br />";
    }
    document.getElementById("footer").innerHTML = htmlOutput;
    return jsonOutput;
}

function loadMenu(menuName){
    var link = document.querySelector('link[id=' + menuName + ']');
    var menuImport = link.import;
    var menu = menuImport.querySelector('.tab-content');
    document.getElementById("control-menu-content").innerHTML = menu.innerHTML;
    resetMenu();
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

// This function originated here:
// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function setupShortestRouteDisplay(graphMesh){
    for (var i = 0; i < v_edgesSR.length; i++){
        v_edgesSR[i].visible = false;
        v_edgesSR[i].material.color.setHex(Number(shortestPathColour));
        v_edgesSR[i].needsUpdate = true;
        v_edgesSR[i].position.x += 2;
        v_edgesSR[i].position.y += 0;
        v_edgesSR[i].position.z += 3.05;
        graphMesh.add(v_edgesSR[i]);
    }
}

function refreshShortestRouteDisplay(){
    for (var i = 0; i < v_edgesSR.length; i++){
        v_edgesSR[i].visible = false;
    }
}

function pointLiesOnPath(p, a, b){
    return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) < 0.0000001;
}

function doMouseDown(event){
    var vector = new THREE.Vector3();
    vector.set(
        ( event.clientX / (window.innerWidth / (canvasScale))) * 2 - 1,
        - ( event.clientY / (window.innerHeight / (canvasScale))) * 2 + 1,
        0.5 );
    vector.unproject( camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = -camera.position.z / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
    alert("Click position: " + " PosX:" + pos.x + " PosY: " + pos.y + " PosZ: " + pos.z);
    console.log(pos);
}

