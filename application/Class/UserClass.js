"use strict";

console.log('--- UserClass.js ---');

/**
 * Userlass.
 */
function UserClass() {
    AppClass.call(this);
}
UserClass.inherits(AppClass);

UserClass.prototype = {

    set: function (user)
    {
    	localStorage.user = user;
    },

    get: function () {
        return localStorage.user;
    },

    logout: function () {
        localStorage.removeItem('user');
        window.location = "#login";
    }

};