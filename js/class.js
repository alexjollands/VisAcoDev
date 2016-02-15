/**
 * Created by Alex on 15/02/2016.
 */

/* This class template inspired by code from http://bit.ly/23BCrOH */
var Class = function(methods) {
    var klass = function() {
        this.initialize.apply(this, arguments);
    };

    for (var property in methods) {
        klass.prototype[property] = methods[property];
    }

    if (!klass.prototype.initialize) klass.prototype.initialize = function(){};

    return klass;
};