//TODO : clean le début 
// suppr + ctrl z/y
// origine graph
// node handle eh

let cylist;

let myVue = new MyVue(cylist);


const onHide = () => myVue.hide();
const onShow = () => myVue.show();

const onSave = () => myVue.save();

const onCancel = () => myVue.cancel();
const onDelete = () => myVue.delete();

const printRule = (event) => {
    myVue.printRule(event);
}

const onCreateRule = (event) => { myVue.state.createRule() }

const onCreateInclusion = (event) => { myVue.state.createInclusion() }

const onSwitchVueGlobal = (event) => {
    if (myVue.cylist == undefined) {
        myVue.switchVue(VueState.GLOBAL);
        myVue.printVue();
        myVue.show()
        myVue.cylist = new CytoList("global");
    } else {

        myVue.hide();
        myVue.switchVue(VueState.GLOBAL);
        myVue.printVue();
        myVue.show()
        myVue.cylist.clear();
        myVue.cylist.freeStorage();
        myVue.cylist.changeCytoState("global");
    }
}
const onSwitchVueRule = (event) => {
    if (myVue.cylist == undefined) {
        myVue.printVue();
        myVue.cylist = new CytoList("rule");
    } else {
        myVue.hide();
        myVue.switchVue(VueState.RULE);
        myVue.printVue();
        myVue.cylist.clear();
        myVue.cylist.freeStorage();
        myVue.cylist.changeCytoState("rule");
    }

}

const onSwitchVueInclusion = (event) => {
    if (myVue.cylist == undefined) {
        myVue.switchVue(VueState.INCLUSION);
        myVue.printVue();
        myVue.cylist = new CytoList("inclusion");
    } else {
        myVue.hide();
        myVue.switchVue(VueState.INCLUSION);
        myVue.printVue();
        myVue.cylist.clear();
        myVue.cylist.fit();
        myVue.cylist.freeStorage();
        console.log(myVue.cylist);
        myVue.cylist.changeCytoState("inclusion");
    }

}
const onChangeMode = (event) => {
    myVue.cylist.changeState();
}
const onPrintInclusion = (event) => {
    myVue.state.printInclusion(event);
}