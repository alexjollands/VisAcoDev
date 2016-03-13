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
    image.src = "images/buttons/" + imagePath;
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
        scenario = createNewScenario(this.viewType);
        controller = new Controller();
        loadSavedSettings(userSettings);
        controller.setupGraph();
        controller.createColony();
        scenario.setup();
        view = scenario.getView();
        currentlyAnimating = true;
    };

    this.setDimensions = function(x, y, w, h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }
};