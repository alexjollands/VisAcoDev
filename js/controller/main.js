/**
 * Created by Alex on 15/02/2016.
 */

var scenario = new NaturalScenario();

var controller = new Controller();
controller.setupGraph();
controller.createColony();
scenario.setup();

var view = scenario.getView();
animate();

