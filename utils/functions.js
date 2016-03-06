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




