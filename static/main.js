//TODO : clean le début 
// suppr + ctrl z/y
// origine graph
let cylist;

let myVue = new MyVue();


const hide = () => {
    document.getElementById("lhs").setAttribute("style", "display:none");
    document.getElementById("rhs").setAttribute("style", "display:none");
    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("cancel").setAttribute("style", "display:none");
    document.getElementById("draw").setAttribute("style", "display:none");
    document.getElementById("delete").setAttribute("style", "display:none");

}


const show = () => {
    document.getElementById("lhs").setAttribute("style", "display:inline-flex");
    document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    document.getElementById("cancel").setAttribute("style", "display:block");
    document.getElementById("save").setAttribute("style", "display:block");
    document.getElementById("draw").setAttribute("style", "display:block");
    document.getElementById("delete").setAttribute("style", "display:block");

}


const hideInclusionVue = () => {
    document.getElementById("lhs1").setAttribute("style", "display:none");
    document.getElementById("rhs1").setAttribute("style", "display:none");
    document.getElementById("lhs2").setAttribute("style", "display:none");
    document.getElementById("rhs2").setAttribute("style", "display:none");;
    document.getElementById("saveI").setAttribute("style", "display:none");;
    document.getElementById("cancelI").setAttribute("style", "display:none");

}

const showInclusionVue = () => {
    document.getElementById("lhs1").setAttribute("style", "display:flex");
    document.getElementById("rhs1").setAttribute("style", "display:flex");
    document.getElementById("lhs2").setAttribute("style", "display:flex");
    document.getElementById("rhs2").setAttribute("style", "display:flex");
    document.getElementById("saveI").setAttribute("style", "display:block");;
    document.getElementById("cancelI").setAttribute("style", "display:block");;
}


const hideRulesButtonI = () => {

    let htmlcollection = document.getElementsByClassName("navrule");
    console.log(htmlcollection);
    for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");


}

const hideIncButtonI = () => {

    let htmlcollection = document.getElementsByClassName("navinc");
    console.log(htmlcollection);
    for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");


}

const addRuleButton = (n) => {
    document.getElementById('ruleset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="changeGraph(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
    document.getElementById('inclusionset').innerHTML += '<li class="nav-item navrule"  style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
    document.getElementById('globalset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="changeGraphG(event)" id="g' + n + '"class="btn btn-light"><img id="grulelhs' + n + '"><img  id="grulerhs' + n + '" ></button></li > ';
}

const addInclusionButton = (n) => {
    document.getElementById('inclusionset').innerHTML += '<li class="nav-item navinc" id="inclusion' + n + '" ><button type="button" onclick="printInclusion(event)"  id="' + n + '"class="btn btn-light">Inclusion ' + n + '</button></li > ';
}

const sauvegarde = () => {
    let n = cylist.getCounterRule();
    addRuleButton(n);
    cylist.save();
    hide();
    cylist.clear();
    cylist.freeStorage();
    cylist.changeState(Mode.EDIT);

}


const sauvegardeI = () => {
    let n = cylist.getCounterInclusion();
    console.log("ii: " + n);
    let m = 0;
    if (n % 2 == 1) m = (n - 1) / 2;
    else m = n / 2;
    addInclusionButton(m);
    cylist.save();
    hideInclusionVue();
    cylist.clear();
    cylist.freeStorage();
    cylist.changeState(Mode.EDIT);
    let htmlcollection = document.getElementsByClassName("navinc");
    for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:blok");
}

const cancel = () => {
    cylist.clear();
    cylist.freeStorage();
    cylist.changeState(Mode.EDIT);
    hide();
}
const cancelI = () => {
    cylist.clear();
    cylist.freeStorage();
    cylist.changeState(Mode.EDIT);
    let htmlcollection = document.getElementsByClassName("navinc");
    for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:blok");
    hideRulesButtonI();
    hideInclusionVue();
}

const parseId = (str, n) => {


    if (str.length == 1) return parseInt(str);
    else if (str.length == 2) return parseInt(str[1]);
    else {


        return parseInt(str.slice(7 + n, 8 + n));
    }
}

const supprimer = () => {
    let m = cylist.rulelist.current - 1;
    let ruleset = document.getElementById("ruleset");
    let id = 'navrule' + m;
    console.log(id);
    cylist.deleteRule(m);
    cylist.clear();
    cylist.freeStorage();

    //xruleset.removeChild(document.getElementById(id));
    let htmlcollection = document.getElementsByClassName("ruleset");
    for (let i = 0; i < htmlcollection.length; i++) {
        console.log(htmlcollection.item(i).childNodes);
    }
    hide();
}

const changeGraph = (event) => {
    let m = parseId(event.target.id, 0) + 1;
    //on retire l'affichage de lancien graph
    cylist.clear();
    //
    cylist.freeStorage();
    //on affihe l'actuel
    cylist.setCurrentRule(m);
    console.log(cylist.rulelist);
    cylist.update();
    cylist.fit();
    show();

    document.getElementById("save").setAttribute("style", "display:none");
    document.getElementById("cancel").setAttribute("style", "display:none");

}

const changeGraphG = (event) => {
    let m = parseId(event.target.id, 1) + 1;
    //on retire l'affichage de lancien graph
    cylist.clear();
    //
    cylist.freeStorage();
    //on affihe l'actuel
    cylist.setCurrentRule(m);
    console.log(cylist.rulelist);
    cylist.update();
    cylist.fit();
    showGlobal();

}


const handleCreateRule = (event) => {


    if (cylist == undefined) {
        ruleVue();
        onglet = onglet_t.RULE;
        cylist = new CytoList("rule");
    } else if (cylist.getCounterRule() > 0) {
        cylist.clear();
        cylist.setCurrentRule(0);
        cylist.update();
    }
    show();
}

const handleCreateInclusion = () => {
    cylist.clear();
    hideIncButtonI();
    if (cylist.length() < 2) {
        alert("Vous devez designer au moins deux règles avant de pouvoir créer une inclusion ")
    } else {
        let htmlcollection = document.getElementsByClassName("navrule");
        for (let i = 0; i < htmlcollection.length; i++) {
            htmlcollection.item(i).setAttribute("style", "display:flex");
            showInclusionVue();
        }
    }

}

const switchVueGlobal = (event) => {
    switchVueRule(event);
    console.log(cylist.rulelist);
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
    if (cylist == undefined) {
        inclusionVue();
        cylist = new CytoList("inclusion");
    } else {
        if (onglet == onglet_t.RULE) hide();
        onglet = onglet_t.INCLUSION;
        inclusionVue();
        cylist.clear();
        cylist.fit();
        cylist.freeStorage();
        cylist.changeCytoState("inclusion");

    }


}

const changeMode = (event) => {
    cylist.changeState();
}


const printRule = (event) => {
    //
    printcursor++;

    cylist.freeStorage();
    //on affihe l'actuel
    let m = parseId(event.target.id, 1);
    console.log(m)
    m++;
    cylist.setCurrentRule(m);
    cylist.fit();

    cylist.update();
    if (printcursor == 2) {
        hideRulesButtonI();
        printcursor = 0;
    }
}

const printInclusion = (event) => {
    cylist.changeState(Mode.EDIT);
    let m = parseInt(event.target.id);
    m *= 2;
    cylist.clear();
    cylist.freeStorage();
    cylist.setCurrentInclusion(m);
    cylist.fit();
    cylist.showInclusion(m);

    showInclusionVue();
}