//TODO : clean le début 
// gestion inclusion avec create inclusion 
// réediter une règle 
// suppr + ctrl z/y
// switch 
// origine graph
//couleur style deprecated   


let cylist;
let onglet_t = {
    RULE: "rule",
    INCLUSION: "inclusion"
}
let init1 = true;

let init2 = true;
let onglet = "";
const div_str = (n, id) => {
    if (n == 0) return '<div id="' + id + '" class="cy" style="display:none"></div>';
    else return '<div id="' + id + n + '" class="cyhalf"  style="display:none" ></div>';
}

const printError = (str) => {

}
const createVue = (str) => {
    document.getElementById('vue').innerHTML = str;
}
const ruleVue = () => {
    createVue(div_str(0, 'lhs') + div_str(0, 'rhs'));
    if (init1) document.getElementById("cyto_conteneur").innerHTML += '<button id="save" onclick="sauvegarde()" style="display:none">Sauvegarder</button><button id="draw" onclick="changeMode()" style="display:non">Dessin/Edition</button>';
    init1 = false;
}

const inclusionVue = () => {

    let str = (div_str(1, 'lhs') + div_str(1, 'rhs') + div_str(2, 'lhs') + div_str(2, 'rhs'));
    console.log(str);
    createVue(str);
    if (init2) document.getElementById("cyto_conteneur").innerHTML += '<button id="saveI" onclick="sauvegarde()">Sauvegarder</button>';
    init2 = false;
}


const hide = () => {
    document.getElementById("lhs").setAttribute("style", "display:none");
    document.getElementById("rhs").setAttribute("style", "display:none");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:none");

}

const show = () => {
    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("save").setAttribute("style", "display:block");
    document.getElementById("draw").setAttribute("style", "display:block");

}
const hideInclusionVue = () => {
    document.getElementById("lhs1").setAttribute("style", "display:none");
    document.getElementById("rhs1").setAttribute("style", "display:none");
    document.getElementById("lhs2").setAttribute("style", "display:none");
    document.getElementById("rhs2").setAttribute("style", "display:none");;
    document.getElementById("saveI").setAttribute("style", "display:none");;

}

const showInclusionVue = () => {
    document.getElementById("lhs1").setAttribute("style", "display:flex");
    document.getElementById("rhs1").setAttribute("style", "display:flex");
    document.getElementById("lhs2").setAttribute("style", "display:flex");
    document.getElementById("rhs2").setAttribute("style", "display:flex");


}


const addRuleButton = (n) => {
    document.getElementById('ruleset').innerHTML += '<li class="nav-item"><button type="button" onclick="changeGraph(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
    document.getElementById('inclusionset').innerHTML += '<li class="nav-item navrule" style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
}


const sauvegarde = () => {


    let n = cylist.getCounter();
    addRuleButton(n);
    cylist.save();
    cylist.clear();
    //hide();
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


    let m = parseId(event.target.id) + 1;
    //on retire l'affichage de lancien graph
    cylist.clear();
    //
    cylist.freeStorage();
    //on affihe l'actuel
    cylist.setCurrent(m);
    cylist.update();
    show();

}

const handleCreateRule = (event) => {



    if (cylist == undefined) {
        ruleVue();
        onglet = onglet_t.RULE;
        cylist = new CytoList("rule");
    } else if (cylist.getCounter() > 0) {
        cylist.clear();
        cylist.setCurrent(0);
        cylist.update();
    }
    show();
}

const handleCreateInclusion = () => {

    if (cylist.length() < 2) {
        alert("Vous devez designer au moins deux règles avant de pouvoir créer une inclusion ")

    } else {
        let htmlcollection = document.getElementsByClassName("navrule");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:flex");
        showInclusionVue();
    }
}
const switchVueRule = (event) => {


    if (cylist == undefined) {
        ruleVue();
        cylist = new CytoList("rule");
    } else {
        if (onglet == onglet_t.INCLUSION) hideInclusionVue();
        onglet = onglet_t.RULE;
        ruleVue();
        cylist.clear();
        cylist.freeStorage();
        cylist.changeCytoState("rule");
    }


}

const switchVueInclusion = (event) => {


    let htmlcollection = document.getElementsByClassName("navrule");
    for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");


    if (cylist == undefined) {
        inclusionVue();
        cylist = new CytoList("inclusion");
    } else {
        if (onglet == onglet_t.RULE) hide();
        onglet = onglet_t.INCLUSION;
        inclusionVue();
        cylist.clear();
        cylist.freeStorage();
        cylist.changeCytoState("inclusion");
    }


}

const changeMode = (event) => {
    cylist.changeState();
}


const printRule = (event) => {
    //
    cylist.freeStorage();
    //on affihe l'actuel
    let m = 0;
    let str = event.target.id;
    if (str.length == 1) m = parseInt(str);
    else m = parseInt(str.slice(8, 9));
    console.log(m)
    m++;
    cylist.setCurrent(m);
    cylist.update();
}