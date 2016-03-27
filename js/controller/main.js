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


$("#menulst li a").click(function(e){ $("#menulst li").removeClass('tab-current'); $(this).parent().addClass('tab-current'); });
$("#nest").click(function(e){e.preventDefault(); tabgroup.nest.performAction(); });
$("#agents").click(function(e){e.preventDefault(); tabgroup.agents.performAction(); });
$("#advanced").click(function(e){e.preventDefault(); tabgroup.advanced.performAction(); });

