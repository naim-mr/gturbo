
var {RuleSystem,RuleSystemObserver}=  require('../../model/RuleSystem.js')
var {GlobalView,GlobalViewObserver}=  require('./GlobalView.js')
var { GraphComponent, GraphComponentObserver } = require('./GraphComponent')
var {RuleComponent}=  require('./RuleComponent.js')
var RuleInclusionComponent=  require('./RuleInclusionComponent.js')
var Observer=  require('../../util/Observer.js')
var Observable=  require('../../util/Observable.js')
const { Rule } = require('../../model/Rule.js')

class RuleSystemComponentObserver extends Observer {
    constructor(rsc){
        super(rsc);
        
    }
    on_createRule(){};
    on_createInclusion(){};
    on_deleteInclusion(n){};
    on_deleteRule(n){};
    on_editRule(){};
}


class RuleSystemComponent extends Observable {
    
    static RuleSystemObs = class extends RuleSystemObserver {
        constructor(rsc, rs) {
            super(rs);
            
            this.rsc = rsc;
        }


        on_createRule(rule) {
            if(this.rsc.rc==undefined)this.rsc.rc=new RuleComponent(new GraphComponent(rule.lhs, "lhs"), new GraphComponent(rule.rhs, "rhs"), rule);
            this.rsc.rc.updateRule(rule);        
        }

        on_createInclusion(inc, sub, over) {
            if (this.rsc.ric == undefined) {
                this.rsc.ric = new RuleInclusionComponent(inc);
                this.rsc.ric.updateEdgesMap(sub , over , this.rsc.edgesInCy, this.rsc.edgesInGraph);
            } else {
                this.rsc.ric.update(inc);
                this.rsc.ric.updateEdgesMap(sub   , over , this.rsc.edgesInCy, this.rsc.edgesInGraph);
            }
        }
        on_deleteRule(id){
            this.rsc.notify("on_deleteRule",id)
            this.rsc.rc.deleteRule();
        }
        on_deleteInclusion(id){
            this.rsc.notify("on_deleteInclusion",id);
            this.rsc.ric.deleteInclusion();

        }
        
    }
    static GlobalViewObs= class extends GlobalViewObserver{
        constructor(gv,rsc){
            super(gv);
            this.rsc=rsc;

        }
        on_editRule(){
            this.rsc.notify("on_editRule");
        }
    }
 
    constructor(rs) {
        super();
        this.rs = rs;
        this.globalView= new GlobalView(rs.graph,"rcomp");
        new RuleSystemComponent.GlobalViewObs(this.globalView,this);
    
        this.edgesInCy = [];
        this.edgesInGraph = [];
        
        new RuleSystemComponent.RuleSystemObs(this, rs);
       
    }
    pushEdgesIds() {
        this.edgesInGraph.push(this.rc.edgesInGraph());
        this.edgesInCy.push(this.rc.edgesInCy());
    }
    saveEdgesIds() {
        
        let n = this.rc.cur;
        console.log(n)
        this.edgesInCy[n] = this.rc.edgesInCy();
        this.edgesInGraph[n] = this.rc.edgesInGraph();
    }
    
    

    switch (n) {
        let rule = this.getRule(n);
        this.rc.update(n , rule, this.edgesInGraph, this.edgesInCy)
    }

    createRule()  {
        
        this.rs.createRule();
        this.rc.cur=this.rc.cpt;
        this.rc.cpt++;
    }
    deleteRule(){

        let r= this.rc.rule;
        this.rs.deleteRule(r);
      
        
    }
    getRule(n) {
        return this.rs.rules[n];
    }
    getCurrentRule(){
        return this.rc.cur;
    }
    cancelRule() {
        this.rs.deleteRule(this.rc.rule);
    }
    saveRule(onCreate) {
        if (onCreate) {
            this.rc.save();
            this.pushEdgesIds();
        } else {
            
            this.saveEdgesIds();
            this.rc.save();


        }
    }
    
    
    removeEles() {
        this.rc.deleteEdges();
        this.rc.lgc.cy.remove(this.rc.lgc.cy.elements(''));
        this.rc.rgc.cy.remove(this.rc.rgc.cy.elements(''));
    }



    createInclusion(sub, over) {
        this.removeElesI()
        this.rs.createInclusion(sub, over);
        this.ric.cpt++;
        this.ric.cur=this.ric.cpt;
        this.coloredInclusion()

    }
    deleteInclusion(){
        let i= this.ric.inc;
        this.rs.deleteInclusion(i);
    }

    loadInclusion(n) {
        if (this.rs.inclusions[n] != this.ric.inc) {
            let inc = this.rs.inclusions[n];
            this.ric.update(inc);
        }
        this.ric.cur = n;
        this.ric.loadInclusion();
    }

    coloredInclusion() {
        this.ric.coloredInclusion();
    }

    removeElesI() {
        if (this.ric 
            != undefined) {
            this.ric.lgcI.removeEles();
            this.ric.rgcI.removeEles();
        }
    }


}

module.exports= {RuleSystemComponent,RuleSystemComponentObserver}