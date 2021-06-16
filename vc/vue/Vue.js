const VueEnum = {
    RULE: "rule",
    INCLUSION: "inclusion",
    GLOBAL: "global"

}

const createVue = (str) => {
    document.getElementById('vue').innerHTML += str;
}

class Vue {
    constructor(rsc) {
        this.state = new VueStateRule(this);
        this.stateToStr = VueEnum.RULE;
        this.rsc = rsc;
        let str = (this.div_str(1, 'lhs') + this.div_str(1, 'rhs') + this.div_str(2, 'lhs') + this.div_str(2, 'rhs'));
        createVue(str);
        createVue(this.div_str(0, 'lhs') + this.div_str(0, 'rhs'));

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
    switch (n) {
        this.state.switch(n);
    }
    cancel() {
        this.state.cancel();
    }
}