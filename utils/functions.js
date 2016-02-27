/**
 * Created by Alex on 16/02/2016.
 */

var url = (window.location.href).replace('index.html', '');

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}