"use strict";

console.log('--- LoginController.js ---');

function LoginController() {
    AppController.call(this, 'LoginController');

    this.user = new UserClass();
}
LoginController.inherits(AppController);

LoginController.prototype = {

    createForm: function() {
        var self = this;

        var select = AppView.createSelect(
            self.users,
            document.getElementById("usersSelect")
        );

        document.getElementById("users_submit").onclick = function () {
            Main.connected = true;
            self.user.set(select.value);
            alert("Bienvenue " + self.user.get() + " dans votre ERP !");
        };
    },

    parseUsersText: function (users) {
        var usersArr = [];
        var lastPos = 0;

        for (var i = 0; i < users.length; i++) {
            if (users[i] === "\n") {
                usersArr.push(users.substr(lastPos, (lastPos === 0 ? i : i - lastPos)));
                lastPos = i + 1;
            }
        }

        return usersArr;
    },

    getUsers: function () {
        console.log('--- LoginController::getUsers() ---');

        var self = this;
        var rawFile = new XMLHttpRequest();

        rawFile.open("GET", Main.usersFile, true);

        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    self.users = self.parseUsersText(rawFile.responseText);
                    self.loginAction();
                }
            }
        };

        rawFile.send(null);
    },

    loginAction: function () {
        if (typeof this.users === "undefined") {
            this.getUsers();
        } else {
            console.log('--- LoginController::login() ---');
            this.createForm();
        }
    },

    logoutAction: function () {
        if ( this.user.get() ) {
            this.user.logout();
            window.location = "#login";
        }
    }

};