class VueStateRule extends VueState {
    static RuleSystem
    constructor(vue) {
        super(vue);
        this.onCreate=true;
        this.onDelete=false;
        
    }

    createRule() {
        if(!this.onCreate)this.vue.rsc.saveRule(this.onCreate);
        this.vue.rsc.removeEles();
        this.onCreate = true;
        this.vue.rsc.createRule(); 
        let n = this.vue.rsc.getCurrentRule();
        this.addRuleButton(n);
        this.save();
    }

    delete(){
        this.vue.rsc.deleteRule();
        this.onDelete=true;;
    }

    switch (n) {
        if(this.onDelete){
            this.vue.rsc.rc.cur=n;
            this.onDelete=false;
        }else{
        this.vue.rsc.saveRule(this.onCreate);
        }
        this.vue.rsc.removeEles();
        this.onCreate=false;
        this.vue.rsc.switch(n);


    }
    save() {
        this.vue.rsc.saveRule(this.onCreate);

    }
    cancel() {
        this.hide();
        this.vue.removeRuleButton(this.vue.rsc.rc.cpt)
        this.vue.rsc.cancelRule();

    }
    hide() {
        document.getElementById("lhs").setAttribute("style", "display:none");
        document.getElementById("rhs").setAttribute("style", "display:none");
        document.getElementById("delete").setAttribute("style", "display:none");
    }
    show() {
        document.getElementById("lhs").setAttribute("style", "display:inline-flex");
        document.getElementById("rhs").setAttribute("style", "display:inline-flex");
        document.getElementById("delete").setAttribute("style", "display:block");
    }

    addRuleButton(n) {
        document.getElementById('ruleset').innerHTML += '<li class="nav-item" id="navrule' + n + '"><button type="button" onclick="onSwitchRule(event)" id="' + n + '"class="btn btn-light"><img id="rulelhs' + n + '"><img  id="rulerhs' + n + '" ></button></li > ';
        document.getElementById('inclusionset').innerHTML += '<li class="nav-item inavrule" id="inavrule' + n + '" style="display:none" ><button type="button" onclick="printRule(event)" id="i' + n + '"class="btn btn-light"><img id="irulelhs' + n + '"><img  id="irulerhs' + n + '" ></button></li > ';
        document.getElementById('globalset').innerHTML += '<li class="nav-item gnavrule" id="navrule' + n + '"><button type="button" onclick="printRule(event)" id="g' + n + '"class="btn btn-light"><img id="grulelhs' + n + '"><img  id="grulerhs' + n + '" ></button></li > ';
    }
   



}