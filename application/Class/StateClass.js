"use strict";

console.log('--- StateClass.js ---');

/**
 * StateClass.
 */
function StateClass(client) {
    AppClass.call(this);

    this.user = new UserClass();
    this.client = client;
    this.states = [];
    this.states["prospect"] = {init: 0, validation: 0, confirmation: 0};
    this.states["devis"] = {init: 0, send: 0, received: 0, valid: 0};
    this.states["facture"] = {init: 0, send: 0, validation: 0, paid: 0};

    this.stateOrder = [];
    this.stateOrder[0] = "prospect";
    this.stateOrder[1] = "devis";
    this.stateOrder[3] = "facture";

}
StateClass.inherits(AppClass);

StateClass.prototype = {

    // Parcours récursivement le dossier client
    // et met a jour les états
    setStates: function ()
    {
        for ( var i in this.client.children ) {
            if (this.client.children[i].children) {
                for ( var j in this.client.children[i].children )  {
                    this.states[this.client.children[i].name][this.client.children[i].children[j].name] = 1;
                }
            }
        }
        return this.states;
    },

    logChangeState: function (client, state, action) {
        console.log("Changement de status : ", new Date, this.user.get(), client.state + ':' + client.type, state + ':' + action);
    },

    setState: function (state, action, value)
    {
        if (!this.isPossible(state, action))
            return 0;

        this.logChangeState(this.getState().actif, state, action);
        this.states[state][action] = value;
        return this.getState();
    },

    setPreviousState: function (state, action, value)
    {

        for ( var i in this.stateOrder ) {
            for ( var j in this.states[this.stateOrder[i]] ) {
                
                this.states[this.stateOrder[i]][j] = value;
                if (state == this.stateOrder[i] && action == j)
                    value = 0;
            }
        }
        return this.getState();
    },

    getStates: function ()
    {
        return this.states;
    },

    // Retourne l'état actif
    // et le prochain a valider
    getState: function ()
    {
        var actif = {
            type: null,
            state: null,
            actif: false
        };
        var next = {
            type: "prospect",
            state: "init",
            actif: false
        };
        var res = {
            actif: actif,
            next: next
        };
        var tmpI = null, tmpJ = null;

        for ( var i in this.stateOrder ) {
            for ( var j in this.states[this.stateOrder[i]] ) {
                
                if ( (this.stateOrder[i] == "facture" && j == "paid") && this.states[this.stateOrder[i]][j]) {
                    actif.type = this.stateOrder[i];
                    actif.state = j;
                    actif.actif = true;
                    next.type = this.stateOrder[i];
                    next.state = j;
                    next.actif = false;

                    res.actif = actif;
                    res.next = next;
                    return res;
                }
                else if (!this.states[this.stateOrder[i]][j] &&
                    (tmpI && tmpJ && this.states[this.stateOrder[tmpI]][tmpJ] == 1) ) {
                    actif.type = this.stateOrder[tmpI];
                    actif.state = tmpJ;
                    actif.actif = true;
                    next.type = this.stateOrder[i];
                    next.state = j;
                    next.actif = false;

                    res.actif = actif;
                    res.next = next;
                    return res;
                }

                tmpI = i;
                tmpJ = j;
            }
        }
        return res;
    },

    // Est il possible de faire cette action
    isPossible: function (state, action)
    {
        if (this.states[state][action] === undefined || this.states[state][action]) {
            console.log('cette action n\'existe pas ou a deja ete faite :', state, ':', action );
            return 0;
        }

        var tmpI, tmpJ;
        for ( var i in this.stateOrder ) {
            for ( var j in this.states[this.stateOrder[i]] ) {

                if ( state == this.stateOrder[i] && action == j ) {
                    return 1;
                }
                tmpI = i;
                tmpJ = j;
            }
        }
        return 1;
    }

};