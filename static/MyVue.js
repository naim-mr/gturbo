VueState = {
    RULE = "rule",
    INCLUSION = "inclusion",
    GLOBAL = "global"

}

class MyVue {
    constructor() {
        this.state = new MyVueState(VueState.RULE);

    }
    switchVue(vueState) {
        switch (vuestate) {
            case (VueState.RULE):
                this.state = new MyVueStateRule(this);
            case (VueState.INCLUSION):
                this.state = new MyVueStateInclusion(this);
            case (VueState.GLOBAL):
                this.state = new MyVueStateGlobal(this);
        }

    }
    div_str(n, id) {
        if (n == 0) return '<div id="' + id + '" class="cy" style="display:none"></div>';
        else return '<div id="' + id + n + '" class="cyhalf"  style="display:none" ></div>';
    }

    parseId(str, n) {


        if (str.length == 1) return parseInt(str);
        else if (str.length == 2) return parseInt(str[1]);
        else {


            return parseInt(str.slice(7 + n, 8 + n));
        }
    }
    createVue(str) {
        document.getElementById('vue').innerHTML = str;
    }
    printVue() {
        this.state.printVue();
    }
    hide() {
        this.state.hide();
    }
    show() {
        this.state.show();
    }
    save() {
        this.state.save();
    }
    cancel() {
        this.state.cancel();
    }
    printRule() {
        this.state.printRule();
    }
}



class MyVueState {
    constructor(myVue) {
        this.myVue = myVue;
        this.init = true;
    }
    printVue() {

    }
    hide() {}
    show() {}
    save() {}
    cancel() {}
    supprimer() {
        //TODO
        let m = cylist.rulelist.current - 1;
        let ruleset = document.getElementById("ruleset");
        let id = 'navrule' + m;
        cylist.deleteRule(m);
        cylist.clear();
        cylist.freeStorage();
        let htmlcollection = document.getElementsByClassName("ruleset");
        for (let i = 0; i < htmlcollection.length; i++) {}
        this.hide();
    }
}


class MyVueStateRule extends MyVueState {
    constructor(myVue) {
        super(myvue);
    }

    printVue() {
        this.myVue.createVue(div_str(0, 'lhs') + div_str(0, 'rhs'));
        if (this.init) document.getElementById("cyto_button").innerHTML += '<button id="save" onclick="sauvegarde()" style="display:none">Sauvegarder</button><button id="cancel" onclick="cancel()" style="display:none">Annuler</button><button id="draw" onclick="changeMode()" style="display:none">Dessin/Edition</button><button id="delete" onclick="supprimer()" style="display:none">Supprimer</button>';
        this.init = false;
    }
    hide() {
        document.getElementById("lhs").setAttribute("style", "display:none");
        document.getElementById("rhs").setAttribute("style", "display:none");
        document.getElementById("save").setAttribute("style", "display:none");
        document.getElementById("cancel").setAttribute("style", "display:none");
        document.getElementById("draw").setAttribute("style", "display:none");
        document.getElementById("delete").setAttribute("style", "display:none");
    }
    show() {
        document.getElementById("lhs").setAttribute("style", "display:inline-flex");
        document.getElementById("rhs").setAttribute("style", "display:inline-flex");
        document.getElementById("cancel").setAttribute("style", "display:block");
        document.getElementById("save").setAttribute("style", "display:block");
        document.getElementById("draw").setAttribute("style", "display:block");
        document.getElementById("delete").setAttribute("style", "display:block");
    }
    addRuleButton() {
        document.getElementById('ruleset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="changeGraph(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item navrule"  style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
        document.getElementById('globalset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="changeGraphG(event)" id="g' + n + '"class="btn btn-light"><img id="grulelhs' + n + '"><img  id="grulerhs' + n + '" ></button></li > ';
    }
    save() {
        let n = cylist.getCounterRule();
        addRuleButton(n);
        cylist.save();
        hide();
        cylist.clear();
        cylist.freeStorage();
        cylist.changeState(Mode.EDIT);
    }
    cancel() {
        cylist.clear();
        cylist.freeStorage();
        cylist.changeState(Mode.EDIT);
        this.hide();
    }
    printRule(event) {
        let m = parseId(event.target.id, 0) + 1;
        cylist.clear();
        cylist.freeStorage();
        cylist.setCurrentRule(m);
        console.log(cylist.rulelist);
        cylist.update();
        cylist.fit();
        this.show();
        document.getElementById("save").setAttribute("style", "display:none");
        document.getElementById("cancel").setAttribute("style", "display:none");
    }
    createRule() {
        if (cylist == undefined) {
            this.printVue();
            onglet = onglet_t.RULE;
            cylist = new CytoList("rule");
        } else if (cylist.getCounterRule() > 0) {
            cylist.clear();
            cylist.setCurrentRule(0);
            cylist.update();
        }
        this.show();
    }

}

class MyVueStateInclusion extends MyVueState {
    constructor(myVue) {
        super(myvue);
        this.printcounter = 0;
    }
    printVue() {
        let str = (div_str(1, 'lhs') + div_str(1, 'rhs') + div_str(2, 'lhs') + div_str(2, 'rhs'));
        createVue(str);
        if (this.init) document.getElementById("cyto_button").innerHTML += '<button id="saveI" onclick="sauvegardeI()" style="display:none">Sauvegarder</button><button id="cancelI" onclick="cancelI()" style="display:none">Annuler</button>';
        this.init = false;
    }
    hide() {
        document.getElementById("lhs1").setAttribute("style", "display:none");
        document.getElementById("rhs1").setAttribute("style", "display:none");
        document.getElementById("lhs2").setAttribute("style", "display:none");
        document.getElementById("rhs2").setAttribute("style", "display:none");;
        document.getElementById("saveI").setAttribute("style", "display:none");;
        document.getElementById("cancelI").setAttribute("style", "display:none");
    }
    show() {
        document.getElementById("lhs1").setAttribute("style", "display:flex");
        document.getElementById("rhs1").setAttribute("style", "display:flex");
        document.getElementById("lhs2").setAttribute("style", "display:flex");
        document.getElementById("rhs2").setAttribute("style", "display:flex");
        document.getElementById("saveI").setAttribute("style", "display:block");;
        document.getElementById("cancelI").setAttribute("style", "display:block");;
    }
    hideRulesButton() {
        let htmlcollection = document.getElementsByClassName("navrule");
        console.log(htmlcollection);
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    hideInclusionButton() {
        let htmlcollection = document.getElementsByClassName("navinc");
        console.log(htmlcollection);
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    showInclusionButton() {
        let htmlcollection = document.getElementsByClassName("navinc");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:blok");
    }
    addInclusionButton() {
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item navinc" id="inclusion' + n + '" ><button type="button" onclick="printInclusion(event)"  id="' + n + '"class="btn btn-light">Inclusion ' + n + '</button></li > ';
    }

    save() {
        let n = cylist.getCounterInclusion();
        let m = 0;
        if (n % 2 == 1) m = (n - 1) / 2;
        else m = n / 2;
        this.addInclusionButton(m);
        cylist.save();
        this.hide();
        cylist.clear();
        cylist.freeStorage();
        cylist.changeState(Mode.EDIT);
        this.showInclusionButton();
    }

    cancel() {
        cylist.clear();
        cylist.freeStorage();
        cylist.changeState(Mode.EDIT);
        let htmlcollection = document.getElementsByClassName("navinc");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:blok");
        this.hideRulesButton();
        this.hide();
    }
    createInclusion() {
        cylist.clear();
        this.hideInclusionButton();
        if (cylist.length() < 2) {
            alert("Vous devez designer au moins deux règles avant de pouvoir créer une inclusion ")
        } else {
            let htmlcollection = document.getElementsByClassName("navrule");
            for (let i = 0; i < htmlcollection.length; i++) {
                htmlcollection.item(i).setAttribute("style", "display:flex");
                this.show();
            }
        }

    }
    printRule(event) {
        this.printcouter++;
        cylist.freeStorage();
        let m = parseId(event.target.id, 1);
        m++;
        cylist.setCurrentRule(m);
        cylist.fit();
        cylist.update();
        if (this.printcounter == 2) {
            this.hideRulesButton()
            this.printcounter = 0;
        }
    }

    printInclusion(event) {
        cylist.changeState(Mode.EDIT);
        let m = parseInt(event.target.id);
        m *= 2;
        cylist.clear();
        cylist.freeStorage();
        cylist.setCurrentInclusion(m);
        cylist.fit();
        cylist.showInclusion(m);
        this.show();
    }
}

class MyVueStateGlobal extends MyVueState {
    constructor(myVue) {
        super(myvue);
    }
}