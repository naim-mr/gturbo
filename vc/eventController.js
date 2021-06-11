//TODO : clean le début 
// suppr + ctrl z/y
// origine graph
// node handle eh



const onHide = () => vue.hide();
const onShow = () => vue.show();

const onCreateRule= (event)=> {     
    vue.state.createRule();
    vue.show();
}

const onSwitchRule= (event)=>{
        
        let id=event.target.id;
        vue.show();
        let n = 0;
        if(id.length==1) n= parseInt(id);
        else n= id.splice(7,8);
        vue.switch(n);
}
const onSave= (event)=> {
        vue.hide();
        vue.save();
}

const onSwitchVueGlobal = (event) => {
        vue.hide();
        vue.state(VueEnum.GLOBAL);
        vue.create();
        vue.show()
}
const onSwitchVueRule = (event) => {
        vue.hide();
        vue.state(VueEnum.RULE);
        vue.create();
        vue.show()
}

const onSwitchVueInclusion = (event) => {
        vue.hide();
        vue.state(VueEnum.INCLUSION);
        vue.create();
        vue.show()
}

