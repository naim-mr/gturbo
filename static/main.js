//TODO : clean le début 
// créer le bouton create rule 


//Liste de graphe
const cylist = new CytoList();



const sauvegarde = () => {


    let n = cylist.getCounter();

    document.getElementById('ruleset').innerHTML += '<li class="nav-item"><button type="button" onclick="changeGraph(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
    //document.getElementById('inclusionset').innerHTML += '<li class="nav-item"><button type="button" onclick="printRule(event)" id="' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '"> </button></li > ';
    cylist.saveRule();
    cylist.clear();
    document.getElementById("lhs").setAttribute("style", "display:none");
    document.getElementById("rhs").setAttribute("style", "display:none");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:none");
    cylist.freeStorage();
    cylist.changeState(Mode.EDIT);
    //nparent = undefined;
}

const parseId = str => {
    if (str.length == 1) return parseInt(str);
    else {

        return parseInt(str.slice(7, 8));
    }
}

const changeGraph = (event) => {


    //on retire l'affichage de lancien graph
    cylist.clear();
    //
    cylist.freeStorage();
    //on affihe l'actuel
    let m = parseId(event.target.id) + 1;
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
    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("save").setAttribute("style", "display:block");
    document.getElementById("draw").setAttribute("style", "display:block");
}


const handleInclusion = (event) => {
    document.getElementById("lhs").setAttribute("style", "display:none");
    document.getElementById("rhs").setAttribute("style", "display:none");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:none");
    cylist.clear();
    cylist.freeStorage();
    cylist.changeStateTo(Mode.EDIT);


}

const changeMode = (event) => {

    cylist.changeState();

}


const printRule = (event) => {

    cylist.update();

    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("save").setAttribute("style", "display:block");
    document.getElementById("draw").setAttribute("style", "display:block");
}