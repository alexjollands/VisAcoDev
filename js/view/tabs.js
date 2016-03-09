/**
 * Created by Alex on 09/03/2016.
 */

/*
 * Clickable tab canvas code inspired by http://jsfiddle.net/AbdiasSoftware/pDM93/
 */
var Tab = function(x, y, width, height, colour) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.lineWidth = 3;

    this.getPath = function(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
    };

    this.render = function(ctx) {
        this.getPath(ctx);
        ctx.strokeStyle = this.colour;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    };
}