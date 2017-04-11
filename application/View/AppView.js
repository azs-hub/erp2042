"use strict";

console.log('--- AppView.js ---');

/**
 * @constructor
 */
function AppView() {}

/**
 * @param array
 * @returns {Element}
 */
AppView.createUL = function(array) {
    var list = document.createElement('ul');

    for (var i = 0; i < array.length; i++) {
        var item = document.createElement('li');

        item.appendChild(document.createTextNode(array[i]));
        list.appendChild(item);
    }

    return list;
};

/**
 * @param array
 * @param select
 * @returns {Element}
 */
AppView.createSelect = function(array, select) {
    if (typeof select === "undefined") {
        select = document.createElement('select');
    }

    for (var i = 0; i < array.length; i++) {
        var item = document.createElement('option');

        item.appendChild(document.createTextNode(array[i]));
        select.appendChild(item);
    }

    return select;
};

/**
 * @param dom
 * @param callback
 */
AppView.addView = function(dom, controller, action) {
    var rawFile = new XMLHttpRequest();

    rawFile.open(
        "GET",
        'application/View/' + Main.AppController.params.controller + '/' + Main.AppController.actionName + '.html',
        true
    );

    rawFile.onreadystatechange = function ()  {
        if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0)) {
            dom.innerHTML = rawFile.responseText;

            if (typeof controller !== "undefined" && action !== "undefined") {
                var ctrl = new window[controller]();

                if (typeof ctrl === "undefined") {
                    throw 'Controller `' + controller + '` don\'t exists.';
                } else {
                    action += 'Action';

                    if (typeof ctrl[action] === "undefined") {
                        throw 'The action `' + action + '` of the controller `' + controller + '` don\'t exists.';
                    }
                }

                ctrl[action]();
            }
        }
    };

    rawFile.send(null);
};