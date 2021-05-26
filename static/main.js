//TODO : clean le début 
// créer le bouton create rule 


//Liste de graphe
const cylist = new CytoList();



const hide = () => {
    document.getElementById("lhs").setAttribute("style", "display:none");
    document.getElementById("rhs").setAttribute("style", "display:none");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:none");

}

const show = () => {
    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:block");

}

const addRuleButton = (n) => {
    document.getElementById('ruleset').innerHTML += '<li class="nav-item"><button type="button" onclick="changeGraph(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
}
const sauvegarde = () => {


    let n = cylist.getCounter();
    addRuleButton(n);
    //document.getElementById('inclusionset').innerHTML += '<li class="nav-item"><button type="button" onclick="printRule(event)" id="' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '"> </button></li > ';
    cylist.saveRule();
    cylist.clear();
    hide();
    cylist.freeStorage();
    cylist.changeState(Mode.EDIT);

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
    show();

}

const handleCreateRule = (event) => {

    if (cylist.getCounter() > 0) {
        cylist.clear();
        cylist.setCurrent(0);
        cylist.update();
    }
    show();
}


const handleInclusion = (event) => {
    hide();
    cylist.clear();
    cylist.freeStorage();
    cylist.changeStateTo(Mode.EDIT);


}

const changeMode = (event) => {

    cylist.changeState();

}


const printRule = (event) => {

    cylist.update();
    show();
}