"use strict";

console.log('--- HomeController.js ---');

function HomeController() {

    var user = new UserClass();
    if ( !user.get() )
        window.location = "#login";
    
    AppController.call(this, 'HomeController'); // heritage mode JS...

    document.getElementById('userName').innerHTML = "Hello " + user.get();
}
HomeController.inherits(AppController);

HomeController.prototype = {

    getOption: function(states) {

        var options = "<option value='default'>--</option>";
        for ( var i in states ) {
            options += '<optgroup label="' + i + '">';
            for ( var j in states[i] ) {
                if (states[i][j])
                    options += '<option value="' + i + ':' + j + '">' + j + '</option>';
                else
                    options += '<option disabled value="' + i + ':' + j + '">' + j + '</option>';
            }
            options += '</optgroup>';
        }
        return options;

    },

    showClientsTab: function(folder, client) {

        var states = client.getStates();
        var options = '<select class="browser-default col l4 s4 m4" id="statePreviousVal' + folder.getName() + '">';
        options += this.getOption(states);
        options += '</select>';

        var table = document.getElementById('prospectTable');
        var tr = document.createElement('tr');
        tr.setAttribute("id", "clientInfo" + folder.getName() );
        tr.innerHTML = 
            '<td class="client">' + folder.getName() + '</td>' +
            '<td class="type">' + client.getState().actif.type + '</td>' +
            '<td class="state">' + client.getState().actif.state + '</td>' +
            '<td class="action"> <button class="btn waves-effect waves-light" type="submit" id="stateChangeInfo' + folder.getName() + '">' +
                    client.getState().next.type + ' ' + client.getState().next.state +
            '</button></td>' +
            '<td>' +
            options +
            // '<button class="btn waves-effect waves-light" type="submit" id="statePrevious' + folder.getName() + '">ok' +
            // '</button>' +
            '</td>' +
            '</tr>';

        table.appendChild(tr);

        this.nextState(folder.getName(), client);
        this.previousState(folder.getName(), client);

    },

    updateClientsTab: function(name, client) {

        var tr = document.getElementById("clientInfo" + name);
        var td = tr.getElementsByTagName('td');
        var select = document.getElementById("statePreviousVal" + name);
        var options = '';
        var states = client.getStates();
        var state = client.getState();

        for ( var i in td ) {
            if  (td[i].className) {

                if (td[i].className == "action" ) {
                    td[i].getElementsByTagName('button')[0].innerHTML = state.next.type + ' ' + state.next.state;
                    if (state.actif.type == "facture" && state.actif.state == "paid")
                        td[i].getElementsByTagName('button')[0].disabled = true;
                    else
                        td[i].getElementsByTagName('button')[0].disabled = false;
                }
                else if (td[i].className == "state" ) {
                    td[i].innerHTML = state.actif.state;
                }
                else if (td[i].className == "type" ) {
                    td[i].innerHTML = state.actif.type;
                }
            }
            
        }
        options += this.getOption(states);
        select.innerHTML = options;
        var optgroup = select.childNodes;
        for ( var i in optgroup ) {
            var opt = optgroup[i].childNodes;
            for ( var j in opt ) {
                if (opt[j].value) {
                    opt[j].selected = false;
                    if (opt[j].value  == state.next.type + ":" + state.next.state) 
                        opt[j].selected = true;
                }
                
            }

        }

    },

    showClients: function() {

        var root = new ComponentDirectoryClass('root');
        var dirProspect = new ComponentDirectoryClass('prospect', root);
        var dirDevis = new ComponentDirectoryClass('devis', root);
        var dirFacture = new ComponentDirectoryClass('facture', root);

        var dirPInit = new ComponentDirectoryClass('init', dirProspect);
        var dirPValidation = new ComponentDirectoryClass('validation', dirProspect);
        var dirPConfirmation = new ComponentDirectoryClass('confirmation', dirProspect);
        
        var dirDInit= new ComponentDirectoryClass('init', dirDevis);
        var dirDSend= new ComponentDirectoryClass('send', dirDevis);
        var dirDReceived= new ComponentDirectoryClass('received', dirDevis);
        var dirDValidation= new ComponentDirectoryClass('valid', dirDevis);
        
        var dirFInit= new ComponentDirectoryClass('init', dirFacture);
        var dirFSend= new ComponentDirectoryClass('send', dirFacture);
        var dirFValidation= new ComponentDirectoryClass('validation', dirFacture);

        var file1 = new ComponentFileClass('file1 child of dir1', dirPInit);
        var file2 = new ComponentFileClass('doc child of dir4', dirPValidation);

        var tree = root.showChildrenTree('', 0);
        var client = new StateClass(root);
        client.setStates();

        var root1 = new ComponentDirectoryClass('root1');
        var dirProspect1 = new ComponentDirectoryClass('prospect', root1);
        var dirDevis1 = new ComponentDirectoryClass('devis', root1);
        var dirFacture1 = new ComponentDirectoryClass('facture', root1);
        var dirPInit1 = new ComponentDirectoryClass('init', dirProspect1);
        var dirPValidation1 = new ComponentDirectoryClass('validation', dirProspect1);
        var dirPConfirmation1 = new ComponentDirectoryClass('confirmation', dirProspect1);
        var dirDInit1= new ComponentDirectoryClass('init', dirDevis);

        var tree1 = root1.showChildrenTree('', 0);
        var client1 = new StateClass(root1);
        client1.setStates();

        this.showClientsTab(root, client);
        this.showClientsTab(root1, client1);
    },

    newClient: function(){
        var _self = this;

        document.getElementById("new_client").onclick = function () {
            var newClient = prompt("Nom du client");
            var state = prompt("Choix de l'etat : (valeur attendu : p ou d ou f)");
            var folder = {p: "prospect", d: "devis", f:"facture"};
            var states = [];

            states["p"] = new Array("init", "validation", "confirmation");
            states["d"] = new Array("init", "send", "received", "valid");
            states["f"] = new Array("init", "send", "validation", "paid");

            while (!state.match(/^[pdf]$/)) {
                state = prompt("Choix de l'etat : (valeur attendu : p ou d ou f)");
            }

            if (newClient && state.match(/^[pdf]$/)) {
                var root = new ComponentDirectoryClass(newClient);

                for ( var i in folder ) {

                    var stateFolder = new ComponentDirectoryClass(folder[i], root);
                    if ( i == state )
                        break;
                    else {
                        for ( var j in states[i] ) {
                            var subFolder = new ComponentDirectoryClass(states[i][j], stateFolder);
                        }
                    }
                }
                var client = new StateClass(root);
                client.setStates()

                _self.showClientsTab(root, client);
            }
        };
    },

    nextState: function(name, client) {
        var _self = this;
        document.getElementById("stateChangeInfo" + name).onclick = function () {

            var remarks = prompt("Remarque : ");
            var clientUp = client.setState(client.getState().next.type , client.getState().next.state , 1);
            if (clientUp && remarks)
            {
                _self.updateClientsTab(name, client);
            }
        };
    },

    previousState: function(name, client) {
        var _self = this;
        document.getElementById("statePreviousVal" + name).onchange = function () {
        // document.getElementById("statePrevious" + name).onclick = function () {
            
            var states = client.getState();
            var select = document.getElementById("statePreviousVal" + name);
            var val = select.value;
            if (val != "default") {

                val = val.split(':');
                if (states.actif.state != val[1] || states.actif.type != val[0])
                {
                    var remarks = prompt("Remarque : ");
                    var clientUp = client.setPreviousState(val[0] , val[1] , 1);

                    if (clientUp && remarks)
                    {
                        _self.updateClientsTab(name, client);

                    }
                }
            }
        };
    },

    indexAction: function() {
        console.log('--- HomeController::index() ---');

        this.showClients();
        this.newClient();

    }

};
