class VueStateInclusion extends VueState {
    constructor(vue) {
        super(vue);
        this.index = 0;
        this.onCreate = false;


    }
    
    hide() {
        document.getElementById("lhs1").setAttribute("style", "display:none");
        document.getElementById("rhs1").setAttribute("style", "display:none");
        document.getElementById("lhs2").setAttribute("style", "display:none");
        document.getElementById("rhs2").setAttribute("style", "display:none");;
        document.getElementById("delete").setAttribute("style", "display:none");

    }
    show() {
        document.getElementById("lhs1").setAttribute("style", "display:flex");
        document.getElementById("rhs1").setAttribute("style", "display:flex");
        document.getElementById("lhs2").setAttribute("style", "display:flex");
        document.getElementById("rhs2").setAttribute("style", "display:flex");
        document.getElementById("delete").setAttribute("style", "display:block");
    }
    createInclusion() {

        
        if (this.vue.rsc.rs.rules.cpt==0) alert("You have to create at least 1 rule ");
        else {
            this.hideInclusionButton();
            this.vue.rsc.removeElesI();
            this.showRulesButton();
            

        }
    }
    delete(){
        this.vue.rsc.deleteInclusion();
    }
    printRule(n) {
        this.hideInclusionButton();
        this.showRulesButton();
        if (n > this.vue.rsc.rc.cpt) throw "Error: printRule n is greater than the number of rule";
        if (this.index) {
            this.over = n;
            let cpt = this.vue.rsc.createInclusion(this.sub, this.over);
            this.addInclusionButton(cpt);
            this.vue.rsc.coloredInclusion();
            this.index = 0;
            this.hideRulesButton();
            this.showInclusionButton();
        } else {
            this.index++;
            this.sub = n;
        }
    }
    switch (n) {
        this.hideRulesButton();
        this.showInclusionButton();
        this.onCreate = false;
        this.vue.rsc.removeElesI();
        this.vue.rsc.loadInclusion(n);
    }
    addInclusionButton(n) {
        let inclusionset = document.getElementById('inclusionset');
        inclusionset.innerHTML += '<li class="nav-item navinc" style="display:none" id="inclusion' + n + '" ><button type="button" onclick="onSwitchInclusionRule(event)"  id="' + n + '"class="btn btn-light">Inclusion ' + n + '</button></li > ';
    }
    showRulesButton() {
        let htmlcollection = document.getElementsByClassName("inavrule");
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:block");
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
        for (let i = 0; i < htmlcollection.length; i++) htmlcollection.item(i).setAttribute("style", "display:block");
    }

 



}