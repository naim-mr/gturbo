//TODO : clean le début 
// suppr + ctrl z/y
// origine graph
let cylist;

let myVue = new MyVue(cylist);


const onHide = () => myVue.hide();
const onShow = () => myVue.show();

const onSave = () => myVue.save();

const onCancel = () => myVue.cancel();
const onDelete = () => myVue.delete();

const printRule = (event) => {
    console.log("printRule");
    myVue.printRule(event);

}

const onCreateRule = (event) => { myVue.state.createRule() }

const onCreateInclusion = (event) => { myVue.state.createInclusion() }

const onSwitchVueGlobal = (event) => {}
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
        console.log(myVue.state);
        myVue.switchVue(VueState.INCLUSION);
        console.log(myVue.state);
        myVue.printVue();
        myVue.cylist = new CytoList("inclusion");
    } else {
        myVue.hide();
        myVue.switchVue(VueState.INCLUSION);
        myVue.printVue();
        myVue.cylist.clear();
        myVue.cylist.fit();
        myVue.cylist.freeStorage();
        myVue.cylist.changeCytoState("inclusion");
    }


}
const onChangeMode = (event) => {
    myVue.cylist.changeState();
}
const onPrintInclusion = (event) => {
    myVue.state.printInclusion(event);
}