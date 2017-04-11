"use strict";

console.log('--- AppController.js ---');

/**
 * AppController
 *
 * @constructor
 */
function AppController(controller) {

    if (!Main.connected) {
        if (typeof controller === "undefined") {
            controller = 'AppController';
        }

        console.log('--- ' + controller + '() --- Not connected!');
    }
}

/**
 * AppController.run
 *
 * @param params
 */
AppController.prototype.run = function(params) {

    console.log('--- AppController::run() ---');

    var self = this;

    self.params = params;
    self.controllerName = self.params.controller + 'Controller';
    self.actionName = self.params.view || self.params.action;

    self.callback = function() {
        AppView.addView(
            document.getElementById('content'),
            self.controllerName,
            self.actionName
        );
    };

    if (typeof window[self.controllerName] === "undefined") {
        Main.loadFile('application/Controller/' + self.controllerName + '.js', self.callback);
    } else {
        self.callback();
    }
};
