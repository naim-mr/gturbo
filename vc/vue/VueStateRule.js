class VueStateRule extends VueState {
    static RuleSystem
    constructor(vue) {
        super(vue);
        this.onCreate = false;


    }

    createRule() {
        
     
        this.vue.rsc.removeEles();
        this.onCreate = true;
        this.vue.rsc.createRule(); 
        let n = this.vue.rsc.getCurrentRule();
        this.addRuleButton(n);
        this.vue.rsc.saveRule();
        
    }


    switch (n) {
        this.vue.rsc.removeEles();
        if (!this.onCreate) this.vue.rsc.saveRule(this.onCreate);
        this.onCreate=false;
        this.vue.rsc.switch(n);


    }
    save() {
        this.vue.rsc.saveRule(this.onCreate);

    }
    cancel() {
        this.hide();
        this.removeRuleButton(this.vue.rsc.rc.cpt)
        this.vue.rsc.cancelRule();

    }
    hide() {
        document.getElementById("lhs").setAttribute("style", "display:none");
        document.getElementById("rhs").setAttribute("style", "display:none");
    }
    show() {
        document.getElementById("lhs").setAttribute("style", "display:inline-flex");
        document.getElementById("rhs").setAttribute("style", "display:inline-flex");
    }

    addRuleButton(n) {
        document.getElementById('ruleset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="onSwitchRule(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item inavrule" id="inavrule' + n + '" style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
        document.getElementById('globalset').innerHTML += '<li class="nav-item gnavrule" id="navrule' + n + '"><button type="button" onclick="printRule(event)" id="g' + n + '"class="btn btn-light"><img id="grulelhs' + n + '"><img  id="grulerhs' + n + '" ></button></li > ';
    }
    removeRuleButton(n) {
        let button = document.getElementById("navrule" + n);
        document.getElementById('ruleset').removeChild(button);
        button = document.getElementById("inavrule" + n);
        document.getElementById('inclusionset').removeChild(button);

    }



}