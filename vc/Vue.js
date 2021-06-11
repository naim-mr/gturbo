
const VueEnum = {
    RULE: "rule",
    INCLUSION: "inclusion",
    GLOBAL: "global"

}

const  createVue= (str) =>{
    document.getElementById('vue').innerHTML = str;
}

class Vue {
    constructor(rsc) {
        this.state = new VueStateRule(this);
        this.stateToStr = VueEnum.RULE;
        this.rsc=rsc;
    }
    stateStr() {
        return this.stateToStr;
    }
    state(vueState) {
        this.stateToStr = vueState;
        switch (vueState) {
            case (VueEnum.RULE):
                {

                    this.state = new VueStateRule(this);
                    break;
                }
            case (VueEnum.INCLUSION):
                {

                    this.state = new VueStateInclusion(this);
                    break;
                }
            case (VueEnum.GLOBAL):
                this.state = new VueStateGlobal(this);
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
    create() {
        this.state.create();
    }
    hide() {
        this.state.hide();
    }
    show() {
        this.state.show();
    }
    save(){
        this.state.save();
    }
    switch(n){
        this.state.switch(n);
    }
}



class VueState {
    constructor(vue) {
        this.vue = vue;
        this.init = true;
        
    }
    createVue() {}

    printRule(event) {};
    hide() {}
    show() {}
    save() {}
    cancel() {}

    supprimer() {
        
    }
}


class VueStateRule extends VueState {
    constructor(vue) {
        super(vue);
        this.onCreate=false;
        createVue(this.vue.div_str(0, 'lhs') + this.vue.div_str(0, 'rhs'));
        document.getElementById("cyto_button").innerHTML='<button id="save" onClick="onSave()">Save</button>'
        
    }

    createRule(){
        //Si on créer une règle depuis en étant en pleine édition => sauvegarde la règle
        if(this.vue.rsc.rs.ruleCpt>0 && !this.onCreate){
            this.save();
            console.log("ici");
        } 
        this.vue.rsc.removeEles();
        
        //
        this.onCreate=true;
        this.vue.rsc.setCur(0);
        //Création d'une nouvelle règle 
       
        
        this.vue.rsc.freeIds();
        this.vue.rsc.setRule(rule);
        g1.register(this.vue.rsc.rc.lgc.graphObs);
        g2.register(this.vue.rsc.rc.rgc.graphObs);
        this.vue.rsc.setGraph(g1,g2);
    }
    switch(n){   
        //Si on switch depuis une autre règle on sauvegarde la règle  précèdente
        if(!this.onCreate)this.save(); 
        this.onCreate=false;
        this.vue.rsc.removeEles();
        this.vue.rsc.setRule(this.vue.rsc.getRule(n));
        this.vue.rsc.setGraph(this.vue.rsc.rc.rule.lhs,this.vue.rsc.rc.rule.rhs);
        //à clean 
        this.vue.rsc.rc.lgc.idInCy=this.vue.rsc.rs.idInCy[n]['left'];
        this.vue.rsc.rc.rgc.idInCy=this.vue.rsc.rs.idInCy[n]['right'];
        this.vue.rsc.rc.rgc.idInGraph=this.vue.rsc.rs.idInGraph[n]['right'];
        this.vue.rsc.rc.lgc.idInGraph=this.vue.rsc.rs.idInGraph[n]['left']
        //
        this.vue.rsc.rc.refresh();
        this.vue.rsc.setCur(n);
       

    }
    save(){
        if(this.onCreate){
            this.addRuleButton(this.vue.rsc.cpt());
            this.vue.rsc.rc.save(this.vue.rsc.cpt());
            this.vue.rsc.pushRule(this.vue.rsc.rc.rule);
            this.vue.rsc.pushIds(this.vue.rsc.rc.rgc.idInCy,this.vue.rsc.rc.rgc.idInGraph,this.vue.rsc.rc.lgc.idInCy,this.vue.rsc.rc.lgc.idInGraph);
            this.vue.rsc.removeEles();
        }else {
            let n =this.vue.rsc.rs.ruleCur;
            console.log("onsave "+ n);
            this.vue.rsc.saveIds(n,this.vue.rsc.rc.lgc.idInCy,this.vue.rsc.rc.rgc.idInCy,this.vue.rsc.rc.rgc.idInGraph,this.vue.rsc.rc.lgc.idInGraph);
            this.vue.rsc.save(n);

        }
    }
    printRule(n){
        this.rc.rule=rulelist[n];
    }
    
    hide() {
        document.getElementById("lhs").setAttribute("style", "display:none");
        document.getElementById("rhs").setAttribute("style", "display:none");
        document.getElementById("save").setAttribute("style", "display:none");
    }
    show() {
        document.getElementById("lhs").setAttribute("style", "display:inline-flex");
        document.getElementById("rhs").setAttribute("style", "display:inline-flex");
        document.getElementById("save").setAttribute("style", "display:block");
    }
    
    addRuleButton(n) {
        document.getElementById('ruleset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="onSwitchRule(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item navrule"  style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
        document.getElementById('globalset').innerHTML += '<li class="nav-item gnavrule" id="navrule' + n + '"><button type="button" onclick="printRule(event)" id="g' + n + '"class="btn btn-light"><img id="grulelhs' + n + '"><img  id="grulerhs' + n + '" ></button></li > ';
    }

    
   
}

class VueStateInclusion extends VueState {
    constructor(vue) {
        super(vue);
        let str = (this.vue.div_str(1, 'lhs') + this.vue.div_str(1, 'rhs') + this.vue.div_str(2, 'lhs') + this.vue.div_str(2, 'rhs'));
        createVue(str);
    }
    hide() {
        document.getElementById("lhs1").setAttribute("style", "display:none");
        document.getElementById("rhs1").setAttribute("style", "display:none");
        document.getElementById("lhs2").setAttribute("style", "display:none");
        document.getElementById("rhs2").setAttribute("style", "display:none");;
        this.hideRulesButton();     
    }
    show() {
        document.getElementById("lhs1").setAttribute("style", "display:flex");
        document.getElementById("rhs1").setAttribute("style", "display:flex");
        document.getElementById("lhs2").setAttribute("style", "display:flex");
        document.getElementById("rhs2").setAttribute("style", "display:flex");
    }
   /* hideRulesButton() {
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
    */
    

}

class VueStateGlobal extends VueState {
    constructor(vue) {
        super(vue);
        this.printcounter = 0;
    }
    hideRulesButton() {
        let htmlcollection = document.getElementsByClassName("gnavrule");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    create() {
        createVue(this.vue.div_str(0, 'lhs') + this.vue.div_str(0, 'rhs'));

    }

    hide() {
        document.getElementById("lhs").setAttribute("style", "display:none");
        document.getElementById("rhs").setAttribute("style", "display:none");
    }
    show() {
        document.getElementById("lhs").setAttribute("style", "display:flex");
        document.getElementById("rhs").setAttribute("style", "display:flex");
    }
    

}