"use strict";

console.log('--- Main.js ---');

Function.prototype.inherits = function(parent) {
    var self = this;

    self.prototype = Object.create(parent.prototype);
    self.prototype.constructor = self;
};

var Main = {
    countCallback: 0,

    requiredFiles: [
        // MINIMUM REQUIRED
        'application/Class/AppClass.js',
        'application/_config/routing.js',
        'application/Controller/AppController.js',
        'application/Model/AppModel.js',
        'application/View/AppView.js',

        // ADD NEW CLASSES HERE
        'application/Class/ComponentClass.js',
        'application/Class/StateClass.js',
        'application/Class/UserClass.js',
        'application/Class/FileSystemClass.js'
    ],

    usersFile: 'application/_config/users.txt',

    connected: false,

    callback: function() {
        if (Main.countCallback === Main.requiredFiles.length - 1) {
            window.onhashchange = function() {
                Main.run();
            };

            Main.run();
        } else {
            Main.countCallback++;
        }
    },

    loadFile: function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = url;

        script.onreadystatechange = callback;
        script.onload = callback;

        head.appendChild(script);
    },

    getCurrentRouteName: function() {
        var route = window.location.hash;

        if (route.length > 1) {
            route = route.substr(1);
        }

        return route;
    },

    getRoute: function() {
        var route = this.getCurrentRouteName();

        if (routes[route]) {
            return routes[route];
        } else {
            var allRoutes = Object.keys(routes);
            var subCount = route.split('/').length;

            for (var i = 0; i < allRoutes.length; i++) {
                if (allRoutes[i].split('/').length === subCount) {
                    var params = routes[allRoutes[i]].params;

                    if (typeof params !== "undefined") {
                        var keyParams = Object.keys(params);
                        var regex = allRoutes[i];

                        for (var x = 0; x < keyParams.length; x++) {
                            regex = regex.replace(keyParams[x], params[keyParams[x]]);
                        }

                        if (route.match(regex)) {
                            return routes[allRoutes[i]];
                        }
                    }
                }
            }
        }

        return Main.connected ? routes.home : routes.login;
    },

    run: function() {
        this.AppController = new AppController();
        this.AppController.run(this.getRoute());
    },

    start: function() {
        var nav = navigator.userAgent.toLowerCase().indexOf('chrome');
        if ( nav > -1 ) {
            for (var i = 0; i < this.requiredFiles.length; i++) {
                this.loadFile(this.requiredFiles[i], this.callback);
            }
        } else {
            alert('Veuillez utiliser Chrome s\'il vous plait.');
            var dom = document.getElementById('content')
            var h2 = document.createElement('h2');
            h2.innerHTML = 'Votre ERP fonctionne sur Chrome. Veuillez changer de navigateur.';
            dom.appendChild(h2);
        }
    }
};

Main.start();