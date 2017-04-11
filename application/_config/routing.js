var routes = {

    // HOME

    "home": {
        "controller": "Home",
        "action": "index"
    },

    // Login

    "login": {
        "controller": "Login",
        "action": "login"
    },

    "logout": {
        "controller": "Login",
        "action": "logout",
        "view": "login"
    },

    // CLIENT

    "client/:id": {
        "controller": "Client",
        "action": "show",
        "params": {
            ":id": "\\d+"
        }
    },

    "client/:id/prospect/:id_prospect/edit": {
        "controller": "Prospect",
        "action": "edit",
        "params": {
            ":id": "\\d+",
            ":id_prospect": "\\d+"
        }
    },

    // Prospect

    "prospect/new": {
        "controller": "Prospect",
        "action": "new"
    }
};