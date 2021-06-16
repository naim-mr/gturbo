
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