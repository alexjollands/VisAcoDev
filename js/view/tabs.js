/**
 * Created by Alex on 09/03/2016.
 */

/*
 * Clickable tab canvas code inspired by http://jsfiddle.net/AbdiasSoftware/pDM93/
 */
var Tab = function(viewType, x, y, width, height, colour, imagePath) {

    this.viewType = viewType;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.lineWidth = 3;
    var image = new Image();
    image.src = "images/" + imagePath;
    this.image = image;


    this.getPath = function(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
    };

    this.render = function(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };

    this.renderBorder = function(ctx){
        this.getPath(ctx);
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    };

    this.performAction = function(){
        currentlyAnimating = false;
        resetViewData();
        scenario = this.createNewScenario();
        controller = new Controller();
        controller.setupGraph();
        controller.createColony();
        scenario.setup();
        view = scenario.getView();
        currentlyAnimating = true;
    };

    this.createNewScenario = function(){
        switch (this.viewType){
            case "Nest-Food Scenario":          return new NaturalScenario();   break;
            case "TSP (Basic)":                 return new BasicScenario();     break;
            case "TSP (Advanced)":              return new NaturalScenario();   break;
            case "Network (Real World)":        return new BasicScenario();     break;
            case "Google Maps (Real World)":    return new NaturalScenario();   break;
        }
    };

    this.setDimensions = function(x, y, w, h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
};