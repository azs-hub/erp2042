"use strict";

console.log('--- ProspectController.js ---');

function ProspectController() {
    AppController.call(this, 'ProspectController'); // heritage mode JS...
}

ProspectController.prototype = Object.create(AppController.prototype);
ProspectController.prototype.constructor = ProspectController;

ProspectController.prototype.newAction = function() {
    console.log('--- ProspectController::new() ---');
};

ProspectController.prototype.editAction = function() {
    console.log('--- ProspectController::edit() ---');
};