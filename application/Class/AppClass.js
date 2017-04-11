"use strict";

console.log('--- AppClass.js ---');

function AppClass() {}

AppClass.factory = function(className) {

    console.log('--- AppClass::factory() ---');

    className += 'Class';

    if (typeof window[className] === "undefined") {
        throw className + ' don\'t exists.';
    }

    return new window[className]();
};