//TODO : clean le début 
// suppr + ctrl z/y
// origine graph


let rs= new RuleSystem();
let vue = new Vue(rs);


const onCancel = ()=> vue.cancel();
const onHide = () => vue.hide();
const onShow = () => vue.show();
var lastButton=null ; 
const onCreateRule= (event)=> {     
    vue.state.createRule();
    vue.show();
}

const onCreateInclusion = (event)=> {
        vue.show();
        vue.state.createInclusion();
        
}

const printRule =(event)=>{
        let id=event.target.id;
        let n = 0;
        if(id.length==2) 
                n= parseInt((id).slice(1,2));
        else 
                n= parseInt(id.slice(8,9));
        vue.state.printRule(n);

}

const onSwitchInclusionRule= (event)=> {
        let id=event.target.id;
        let n = 0;
        vue.show();
        if(id.length==1) 
                n= parseInt(id);
        else 
                n= parseInt(id.slice(7,8));
        vue.switch(n);

}
const onSwitchRule= (event)=>{
        if(lastButton!=null) 
           lastButton.classList.remove("selectedButton");
        let id=event.target.id;
        vue.show();
        let n = 0;
        if(id.length==1)
           n= parseInt(id);
        else 
           n= parseInt(id.slice(7,8));
        lastButton=document.getElementById("navrule"+n);
        lastButton.classList.add('selectedButton');        
        console.log(lastButton);
        vue.switch(n);
}
const onSave= (event)=> {
        vue.hide();
        vue.save();
}
const onDelete= (event)=> {

        if(confirm("Êtes vous sûr ? ") ){
                 vue.hide();
                 vue.delete();
        }
}

const onSwitchVueGlobal = (event) => {
        vue.hide();
        vue.state(VueEnum.GLOBAL);
        
}
const onSwitchVueRule = (event) => {
        vue.hide();
        vue.changeState(VueEnum.RULE);
       
}

const onSwitchVueInclusion = (event) => {
        vue.hide();
        vue.changeState(VueEnum.INCLUSION);
        
       
}

