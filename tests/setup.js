/**
 * Created by Alex on 19/02/2016.
 */

/*
 * This class sets up a known application state to test against,
 * as well as providing any common setup function
*/
var params = {};
params.pheromoneImportance    = 1.25;   // Alpha
params.distanceImportance     = 2.25;   // Beta
params.pheromoneDecayRate     = 0.07;   // Rho
params.pheromoneDepositRate   = 0.5;
params.initialPheromoneLevel  = 1;
params.colonySize             = 30;
params.antMovementPerUpdate   = 50;
params.maximumIterations      = 1000000;

var scenario = new AdvancedScenario();
var controller = new Controller();

function createSampleNodes(){
    var nodes = [];
    var nodeA = new Node(1,0,100,[]);
    var nodeB = new Node(2,50,100,[]);
    var nodeC = new Node(3,100,50,[]);
    var nodeD = new Node(4,200,0,[]);
    nodes.push(nodeA, nodeB, nodeC, nodeD);
    return nodes;
}

function createSampleEdges(nodes){
    var edges = [];
    var nodeA = nodes[0];
    var nodeB = nodes[1];
    var nodeC = nodes[2];
    var nodeD = nodes[3];
    var edgeAB = new Edge(nodeA, nodeB, 0);
    var edgeBC = new Edge(nodeB, nodeC, 0);
    var edgeAC = new Edge(nodeA, nodeC, 0);
    var edgeAD = new Edge(nodeA, nodeD, 0);
    var edgeBD = new Edge(nodeB, nodeD, 0);
    var edgeCD = new Edge(nodeC, nodeD, 0);
    edges.push(edgeAB, edgeBC, edgeAC, edgeAD, edgeBD, edgeCD);

    return edges;
}

function createSampleAnts(num){
    var ants = [];
    for (var i = 0; i < num; i++){
        ants.push(new TouringAnt(i+1, new Tour(), new Position()));
    }
    return ants;
}