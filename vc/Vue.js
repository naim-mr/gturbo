
const VueEnum = {
    RULE: "rule",
    INCLUSION: "inclusion",
    GLOBAL: "global"

}

const  createVue= (str) =>{
    document.getElementById('vue').innerHTML += str;
}

class Vue {
    constructor(rsc) {
        this.state = new VueStateRule(this);
        this.stateToStr = VueEnum.RULE;
        this.rsc=rsc;
        let str = (this.div_str(1, 'lhs') + this.div_str(1, 'rhs') + this.div_str(2, 'lhs') + this.div_str(2, 'rhs'));
        createVue(str);
        createVue(this.div_str(0, 'lhs') + this.div_str(0, 'rhs'));
        document.getElementById("cyto_button").innerHTML='<button id="save" style="display:none" onClick="onSave()">Save</button>'
      
    }
    stateStr() {
        return this.stateToStr;
    }
    changeState(vueState) {
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
       
        
    }

    createRule(){
        //if(this.vue.rsc.cpt>0)this.vue.rsc.save(this.vue.rsc.cur);
        this.vue.rsc.removeEles();
        this.onCreate=true;
        let n=this.vue.rsc.createRule();
        this.addRuleButton(n);
        this.vue.rsc.save(n);
    }


    switch(n){  
        //Si on switch depuis une autre règle on sauvegarde la règle  précèdente
        if(!this.onCreate)this.save(); 
        this.onCreate=false;
        this.vue.rsc.removeEles();
        let rule= this.vue.rsc.getRule(n);
        this.vue.rsc.setRule(rule);
        this.vue.rsc.setGraph(rule.lhs,rule.rhs);
        //à clean 
        n--;
        this.vue.rsc.rc.lgc.edgesInCy=this.vue.rsc.edgesInCy[n]['left'];
        this.vue.rsc.rc.rgc.edgesInCy=this.vue.rsc.edgesInCy[n]['right'];
        this.vue.rsc.rc.rgc.edgesInGraph=this.vue.rsc.edgesInGraph[n]['right'];
        this.vue.rsc.rc.lgc.edgesInGraph=this.vue.rsc.edgesInGraph[n]['left']
        //
        this.vue.rsc.rc.refresh();
        this.vue.rsc.setCur(n);
       

    }
    save(){
        if(this.onCreate){
            this.vue.rsc.rc.save(this.vue.rsc.cur)
            this.vue.rsc.pushEdgesIds(this.vue.rsc.rc.rgc.edgesInCy,this.vue.rsc.rc.rgc.edgesInGraph,this.vue.rsc.rc.lgc.edgesInCy,this.vue.rsc.rc.lgc.edgesInGraph);
            this.vue.rsc.removeEles();
        }else {
            let n =this.vue.rsc.cur+1;
            this.vue.rsc.saveEdgesIds(n,this.vue.rsc.rc.lgc.edgesInCy,this.vue.rsc.rc.rgc.edgesInCy,this.vue.rsc.rc.rgc.edgesInGraph,this.vue.rsc.rc.lgc.edgesInGraph);
            this.vue.rsc.save(n);

        }
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
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item inavrule"  style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
        document.getElementById('globalset').innerHTML += '<li class="nav-item gnavrule" id="navrule' + n + '"><button type="button" onclick="printRule(event)" id="g' + n + '"class="btn btn-light"><img id="grulelhs' + n + '"><img  id="grulerhs' + n + '" ></button></li > ';
    }

    
   
}

class VueStateInclusion extends VueState {
    constructor(vue) {
        super(vue);
        this.index=0;
        this.onCreate=false;
        
        
    }
    hide() {
        document.getElementById("lhs1").setAttribute("style", "display:none");
        document.getElementById("rhs1").setAttribute("style", "display:none");
        document.getElementById("lhs2").setAttribute("style", "display:none");
        document.getElementById("rhs2").setAttribute("style", "display:none");;
        document.getElementById("save").setAttribute("style", "display:none");
        
      
    }
    show() {
        document.getElementById("lhs1").setAttribute("style", "display:flex");
        document.getElementById("rhs1").setAttribute("style", "display:flex");
        document.getElementById("lhs2").setAttribute("style", "display:flex");
        document.getElementById("rhs2").setAttribute("style", "display:flex");
        document.getElementById("save").setAttribute("style", "display:block");
    }
    createInclusion(){
        if(this.vue.rsc.cpt==0) alert("You have to create at least 1 rule ");
        else {
            this.hideInclusionButton();
            this.vue.rsc.removeElesI();
            this.showRulesButton();     

        }
    }
    printRule(n){
        this.hideInclusionButton();
        this.showRulesButton();
        if(n>this.vue.rsc.cpt)  throw  "Error: printRule n is greater than the number of rule";
        if(this.index){       
               this.over=n;
               let cpt=this.vue.rsc.createInclusion(this.sub,this.over);
               this.addInclusionButton(cpt);
               this.vue.rsc.coloredInclusion();
               this.index=0;
               
        }else{
            this.index++;
            this.sub=n;
        }
    }
    switch(n){
        this.vue.rsc.removeElesI();
        this.vue.rsc.loadInclusion(n);
    }
    addInclusionButton(n) {
        console.log("coucou");
        let inclusionset=document.getElementById('inclusionset');
        console.log(inclusionset)
        inclusionset.innerHTML += '<li class="nav-item navinc" style="display:none" id="inclusion' + n + '" ><button type="button" onclick="onSwitchInclusionRule(event)"  id="' + n + '"class="btn btn-light">Inclusion ' + n + '</button></li > ';
    }
    showRulesButton(){
        let htmlcollection = document.getElementsByClassName("inavrule");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:block");
    }
    save(){
        this.hideRulesButton();
        this.showInclusionButton();
        this.onCreate=false;

    }
    hideRulesButton() {
       let htmlcollection = document.getElementsByClassName("inavrule");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    hideInclusionButton() {
        let htmlcollection = document.getElementsByClassName("navinc");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:none");
    }
    showInclusionButton() {
        
        let htmlcollection = document.getElementsByClassName("navinc");
        console.log(htmlcollection);
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:block");
    }
    
    
    

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