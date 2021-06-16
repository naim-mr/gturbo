const VueState = {
    RULE: "rule",
    INCLUSION: "inclusion",
    GLOBAL: "global"

}

class MyVue {
    constructor(cylist) {
        this.cylist;
        this.state = new MyVueStateRule(this);
        this.stateToStr = VueState.RULE;

    }
    stateStr() {
        return this.stateToStr;
    }
    switchVue(vueState) {
        this.stateToStr = vueState;
        switch (vueState) {
            case (VueState.RULE):
                {

                    this.state = new MyVueStateRule(this);
                    break;
                }
            case (VueState.INCLUSION):
                {

                    this.state = new MyVueStateInclusion(this);
                    break;
                }
            case (VueState.GLOBAL):
                this.state = new MyVueStateGlobal(this);
                break;
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
    delete() {

    }
    printRule(event) {
        this.state.printRule(event);
    }
}



class MyVueState {
    constructor(myVue) {
        this.myVue = myVue;
        this.init = true;
    }
    printVue() {}

    printRule(event) {};
    hide() {}
    show() {}
    save() {}
    cancel() {}

    supprimer() {
        //TODO
        let m = this.myVue.cylist.rulelist.current - 1;
        let id = 'navrule' + m;
        let ruleset = document.getElementById("ruleset");
        this.myVue.cylist.deleteRule(m);
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        let htmlcollection = document.getElementsByClassName("ruleset");
        for (let i = 0; i < htmlcollection.length; i++) {}
        this.hide();
    }
}


class MyVueStateRule extends MyVueState {
    constructor(myVue) {
        super(myVue);

    }

    printVue() {
        this.myVue.createVue(this.myVue.div_str(0, 'lhs') + this.myVue.div_str(0, 'rhs'));
        if (this.init) document.getElementById("cyto_button").innerHTML += '<button id="save" onclick="onSave()" style="display:none">Sauvegarder</button><button id="cancel" onclick="cancel()" style="display:none">Annuler</button><button id="draw" onclick="onChangeMode()" style="display:none">Dessin/Edition</button><button id="delete" onclick="onDelete()" style="display:none">Supprimer</button>';
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
    save() {
        let n = this.myVue.cylist.getCounterRule();
        this.addRuleButton(n);
        this.myVue.cylist.save();
        this.hide();
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        this.myVue.cylist.changeState(Mode.EDIT);
    }
    addRuleButton(n) {
        document.getElementById('ruleset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="printRule(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item navrule"  style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
        document.getElementById('globalset').innerHTML += '<li class="nav-item gnavrule" id="navrule' + n + '"><button type="button" onclick="printRule(event)" id="g' + n + '"class="btn btn-light"><img id="grulelhs' + n + '"><img  id="grulerhs' + n + '" ></button></li > ';
    }

    cancel() {
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        this.myVue.cylist.changeState(Mode.EDIT);
        this.hide();
    }
    printRule(event) {
        let m = this.myVue.parseId(event.target.id, 0) + 1;
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        this.myVue.cylist.setCurrentRule(m);
        this.myVue.cylist.update();
        this.show();
        document.getElementById("save").setAttribute("style", "display:none");
        document.getElementById("cancel").setAttribute("style", "display:none");
    }
    createRule() {
        if (this.myVue.cylist == undefined) {
            this.printVue();
            this.myVue.cylist = new CytoList("rule");
        } else if (this.myVue.cylist.getCounterRule() > 0) {
            this.myVue.cylist.clear();
            this.myVue.cylist.setCurrentRule(0);
            this.myVue.cylist.update();
        }
        this.show();
    }

}

class MyVueStateInclusion extends MyVueState {
    constructor(myVue) {
        super(myVue);
        this.printcounter = 0;
    }

    hide() {
        document.getElementById("lhs1").setAttribute("style", "display:none");
        document.getElementById("rhs1").setAttribute("style", "display:none");
        document.getElementById("lhs2").setAttribute("style", "display:none");
        document.getElementById("rhs2").setAttribute("style", "display:none");;
        document.getElementById("saveI").setAttribute("style", "display:none");;
        document.getElementById("cancelI").setAttribute("style", "display:none");
        this.hideRulesButton();
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
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    hideInclusionButton() {
        let htmlcollection = document.getElementsByClassName("navinc");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    showInclusionButton() {
        let htmlcollection = document.getElementsByClassName("navinc");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:blok");
    }
    addInclusionButton(n) {
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item navinc" id="inclusion' + n + '" ><button type="button" onclick="onPrintInclusion(event)"  id="' + n + '"class="btn btn-light">Inclusion ' + n + '</button></li > ';
    }

    save() {
        let n = this.myVue.cylist.getCounterInclusion();
        let m = 0;
        if (n % 2 == 1) m = (n - 1) / 2;
        else m = n / 2;
        this.addInclusionButton(m);
        this.myVue.cylist.save();
        this.hide();
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        this.myVue.cylist.changeState(Mode.EDIT);
        this.showInclusionButton();
        this.myVue.cylist.inclusionlist.printInclusions();
    }

    cancel() {
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        this.myVue.cylist.changeState(Mode.EDIT);
        let htmlcollection = document.getElementsByClassName("navinc");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:blok");
        this.hideRulesButton();
        this.hide();
    }
    createInclusion() {
        this.myVue.cylist.clear();
        this.hideInclusionButton();
        if (this.myVue.cylist.length() < 2) {
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
        this.printcounter++;
        this.myVue.cylist.freeStorage();
        let m = this.myVue.parseId(event.target.id, 1);
        m++;
        this.myVue.cylist.setCurrentRule(m);
        this.myVue.cylist.fit();
        this.myVue.cylist.update();
        if (this.printcounter == 2) {
            this.hideRulesButton()
            this.printcounter = 0;
        }
    }

    printInclusion(event) {
        this.myVue.cylist.changeState(Mode.EDIT);
        let m = parseInt(event.target.id);
        m *= 2;
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        this.myVue.cylist.setCurrentInclusion(m);
        this.myVue.cylist.fit();
        this.myVue.cylist.showInclusion(m);
        this.show();
    }
    printVue() {
        let str = (this.myVue.div_str(1, 'lhs') + this.myVue.div_str(1, 'rhs') + this.myVue.div_str(2, 'lhs') + this.myVue.div_str(2, 'rhs'));
        this.myVue.createVue(str);
        if (this.init) document.getElementById("cyto_button").innerHTML += '<button id="saveI" onclick="onSave()" style="display:none">Sauvegarder</button><button id="cancelI" onclick="onCancel()" style="display:none">Annuler</button>';
        this.init = false;
    }

}

class MyVueStateGlobal extends MyVueState {
    constructor(myVue) {
        super(myVue);
        this.printcounter = 0;
    }
    hideRulesButton() {
        let htmlcollection = document.getElementsByClassName("gnavrule");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    printRule(event) {
        this.printcounter++;
        this.myVue.cylist.freeStorage();
        let m = this.myVue.parseId(event.target.id, 1);
        m++;
        this.myVue.cylist.setCurrentRule(m);
        this.myVue.cylist.fit();
        this.myVue.cylist.update();
        if (this.printcounter == 2) {
            this.hideRulesButton()
            this.printcounter = 0;
        }
    }
    printVue() {
        this.myVue.createVue(this.myVue.div_str(0, 'lhs') + this.myVue.div_str(0, 'rhs'));
        if (this.init) document.getElementById("cyto_button").innerHTML += '<button id="globalInc" onclick="globalInclusion()" style="display:none">Afficher Inclusions</button><button id="gcancel" onclick="onCancel()" style="display:none">Clear</button>';
        this.init = false;

    }

    hide() {
        document.getElementById("lhs").setAttribute("style", "display:none");
        document.getElementById("rhs").setAttribute("style", "display:none");
        document.getElementById("globalInc").setAttribute("style", "display:none");;
        document.getElementById("gcancel").setAttribute("style", "display:none");;
    }
    show() {
        document.getElementById("lhs").setAttribute("style", "display:flex");
        document.getElementById("rhs").setAttribute("style", "display:flex");
        document.getElementById("gcancel").setAttribute("style", "display:block");;
        document.getElementById("globalInc").setAttribute("style", "display:block");;
    }
    cancel() {
        this.myVue.cylist.clear();
        this.myVue.cylist.freeStorage();
        this.myVue.cylist.changeState(Mode.EDIT);
        let htmlcollection = document.getElementsByClassName("gnavrule");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:block");
    }


}