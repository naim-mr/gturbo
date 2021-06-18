const VueEnum = {
    RULE: "rule",
    INCLUSION: "inclusion",
    GLOBAL: "global"

}

const createVue = (str) => {
    document.getElementById('vue').innerHTML += str;
}

class Vue {

    static RuleSystemComponentObs= class extends RuleSystemComponentObserver{
        constructor(vue,rsc){
            super(rsc);
            this.vue=vue;
        }
        on_deleteRule(n){
            console.log("deleteRule")
            this.vue.removeRuleButton(n);
        }
        on_deleteInclusion(n){
            console.log("deteInclusion");
            this.vue.removeInclusionButton(n);
        }
        on_createRule(){

        }
        on_createInclusion(){

        }
    }
    constructor(rs) {
        let str = (this.div_str(1, 'lhs') + this.div_str(1, 'rhs') + this.div_str(2, 'lhs') + this.div_str(2, 'rhs'));
        createVue(str);
        createVue(this.div_str(0, 'lhs') + this.div_str(0, 'rhs'));



        this.state = new VueStateRule(this);
        this.stateToStr = VueEnum.RULE;
        this.rsc = new RuleSystemComponent(rs);
       
        document.getElementById("cyto_button").innerHTML += '<button id="delete" onclick="onDelete()" style="display:none">Delete</button>'
        document.getElementById("cyto_button").innerHTML += '<button id="save" onclick="onSave()" style="display:none">Save</button>'
     
        new Vue.RuleSystemComponentObs(this,this.rsc);
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
    save() {
        this.state.save();
    }
    delete(){
        this.state.delete();
    }
    switch (n) {
        this.state.switch(n);
    }
    cancel() {
        this.state.cancel();
    }
    removeRuleButton(n) {
        let button = document.getElementById("navrule" + n);
        document.getElementById('ruleset').removeChild(button);
        button = document.getElementById("inavrule" + n);
        document.getElementById('inclusionset').removeChild(button);

    }
    removeInclusionButton(n){
        
        let button = document.getElementById("inclusion" + n)
        console.log("remove inc" +n);
        console.log(button);
      if(button!=null)  document.getElementById('inclusionset').removeChild(button);
        
}
}