//TODO : clean le début 
// créer le bouton create rule 


//Liste de graphe
var cylist = new CytoList();

var nparent; //TODO : gestion des compound box

const sauvegarde = () => {
    cylist.saveRule();
    cylist.clear();
    let n = cylist.getCounter();
    document.getElementById('ruleset').innerHTML += '<li class="nav-item"><button type="button" onclick="changeGraph(event)" id="' + n + '"class="btn btn-light">Rule ' + n + '</button></li>';
    document.getElementById("lhs").setAttribute("style", "display:none");
    document.getElementById("rhs").setAttribute("style", "display:none");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:none");
    cylist.freeStorage();
    cylist.drawmode();
    //nparent = undefined;
}



const changeGraph = (event) => {
    nparent = undefined;

    //on retire l'affichage de lancien graph
    cylist.clear();
    //
    cylist.freeStorage();
    //on affihe l'actuel
    let m = parseInt(event.target.id);
    console.log(m);
    cylist.setCurrent(m);
    cylist.update();

    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:block");
}

const handleCreateRule = (event) => {

    if (cylist.getCounter() > 0) {
        cylist.clear();
        cylist.setCurrent(0);
        cylist.update();
    }
    nparent = undefined;

    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("save").setAttribute("style", "display:block");
    document.getElementById("draw").setAttribute("style", "display:block");
}


function handleInclusion(event) {
    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:block");
    cylist.clear();
    cylist.freeStorage();
    nparent = undefined;

    if (cylist.length() > 0) {
        var inclusionset = document.getElementById("inclusionset");
        for (var i = 1; i < cylist.length; i++) {
            inclusionset.innerHTML += '<li class="nav-item"><button type="button" onclick="printRule(event)" id="' + i + '"class="btn btn-light">Rule ' + i + '</button></li>';
        }


    }

}

const draw = (event) => {

    cylist.drawmode();

}


function printRule(event) {
    nparent = undefined;

    let id = event.target.id;
    console.log(id);
    cyleft.add(cylist[id].lhs.nodes);
    cyright.add(cylist[id].rhs.nodes);
    cyleft.add(cylist[id].lhs.edges);
    cyright.add(cylist[id].rhs.edges)
}