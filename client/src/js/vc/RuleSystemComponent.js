
var { RuleSystem, RuleSystemObserver } = require('../model/RuleSystem.js')
var { GlobalView, GlobalViewObserver } = require('./GlobalView.js')
var { GraphComponent, GraphComponentObserver } = require('./GraphComponent')
var { RuleComponent } = require('./RuleComponent.js')
var RuleInclusionComponent = require('./RuleInclusionComponent.js')
var { AutoInclusionComponent } = require('./AutoInclusionComponent.js')
var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
const { Rule } = require('../model/Rule.js')

class RuleSystemComponentObserver extends Observer {
  constructor (rsc) {
    super(rsc)
  }

  on_createRule () {};
  on_createInclusion () {};
  on_deleteInclusion (n) {};
  on_deleteRule (n) {};
  on_editRule (id) {};
  on_editInclusion (id) {};
  on_editAutoInclusion (id) {};
  on_save (json) {};
}

class RuleSystemComponent extends Observable {
    static RuleSystemObs = class extends RuleSystemObserver {
      constructor (rsc, rs) {
        super(rs)

        this.rsc = rsc
      }

      on_createRule (rule) {
        if (this.rsc.rc == undefined) this.rsc.rc = new RuleComponent(new GraphComponent(rule.lhs, 'lhs',true), new GraphComponent(rule.rhs, 'rhs',true), rule)
        this.rsc.pushEdgesIds()
        this.rsc.rc.updateRule(rule)
        this.rsc.onCreate = true
        this.rsc.rc.cur = this.rsc.rc.cpt
        this.rsc.rc.cpt++
      }

      on_createInclusion (inc, sub, over) {
        if (this.rsc.ric == undefined) {
          this.rsc.ric = new RuleInclusionComponent(inc)
          this.rsc.ric.updateEdgesMap(sub, over, this.rsc.edgesInCyList, this.rsc.edgesInGraphList)
        } else {
          this.rsc.ric.update(inc)
          this.rsc.ric.updateEdgesMap(sub, over, this.rsc.edgesInCyList, this.rsc.edgesInGraphList)
        }
        this.rsc.onCreate = true
        this.rsc.ric.cpt++
        this.rsc.ric.cur = this.rsc.ric.cpt
        this.rsc.ric.loadInclusion()
      }

      on_deleteRule (id) {
        this.rsc.notify('on_deleteRule', id)
        this.rsc.rc.deleteRule()
      }

      on_deleteInclusion (id) {
        this.rsc.notify('on_deleteInclusion', id)
      }
    }

    static GlobalViewObs= class extends GlobalViewObserver {
      constructor (gv, rsc) {
        super(gv)
        this.rsc = rsc
      }

      on_editRule (id) {
        this.rsc.saveEdgesIds()
        this.rsc.switch(parseInt(id))
        
        this.rsc.notify('on_editRule', id)
      }

      on_editInclusion (id) {
        this.rsc.saveEdgesIds()
        
        if(this.rsc.rs.inclusions[id].sub==this.rsc.rs.inclusions[id].over ){
          
          if (this.rsc.aic == undefined) {
            this.rsc.aic = new AutoInclusionComponent(this.rsc.rs.rules[this.rsc.getCurrentRule()],this.rsc.rs.inclusions[id])
            this.rsc.aic.loadInclusion()
          }
          else {
            
            this.rsc.aic.update(this.rsc.rs.rules[this.rsc.getCurrentRule()],this.rsc.rs.inclusions[id])
            this.rsc.aic.loadInclusion()
            
          }
          this.rsc.notify('on_editAutoInclusion',id)
          
        }
        else{
          this.rsc.loadInclusion(id)
          this.rsc.notify('on_editInclusion', id)
        }
      }

    }

    // precond rs in RuleSystem
    constructor (rs) {
      super()
      this.onCreate = true
      this.onDelete = false
      this.edgesInCyList = []
      this.edgesInGraphList = []
      this.rs = rs
      this.globalView = new GlobalView(rs.graph, 'rcomp')
      new RuleSystemComponent.GlobalViewObs(this.globalView, this)
      new RuleSystemComponent.RuleSystemObs(this, rs)
    }

    pushEdgesIds () {
      console.log("puuuuuush")
      this.edgesInGraphList.push(this.rc.edgesInGraph())
      this.edgesInCyList.push(this.rc.edgesInCy())
    }

    saveEdgesIds () {
      const n = this.rc.cur
      this.edgesInCyList[n] = this.rc.  edgesInCy()
      this.edgesInGraphList[n] = this.rc.edgesInGraph()
    }

    switch (n) {
      
      const rule = this.getRule(n)
      console.log(n);
      console.log(JSON.stringify(rule));
      this.rc.update(n, rule, this.edgesInGraphList, this.edgesInCyList)
    }

    getRule (n) {
      return this.rs.rules[n]
    }

    getCurrentR () {
      return this.getRule(this.rc.cur)
    }

    getCurrentRule () {
      return (this.rc.cur)
    }

    removeEles () {
      this.rc.deleteEdges()
      this.rc.lgc.cy.remove(this.rc.lgc.cy.elements(''))
      this.rc.rgc.cy.remove(this.rc.rgc.cy.elements(''))
    }

    loadInclusion (n) {
      this.removeElesI()
      if (this.rs.inclusions[n] != this.ric.inc) {
        const inc = this.rs.inclusions[n]
        console.log(inc)
        this.ric.update(inc)
      }
      this.ric.cur = n
      this.ric.loadInclusion()
    }

    printNewInclusion (n) {
      this.loadInclusion(n)
    }

    removeElesI () {
      if (this.ric !=
            undefined) {
        this.ric.lgcI.removeEles()
        this.ric.rgcI.removeEles()
      }
    }

    
    getAutoRight () {   
      return this.rs.rules[this.getCurrentRule()].rautoInclusions.length
    }

    updateInclusion (toDelete) {
      this.rs.updateInclusion(this.getCurrentRule(),toDelete)
    }

    prevLAuto () {
      this.aic.prevL()
    }

    prevRAuto 
    () {
      this.aic.prevR()
    }

    nextLAuto () {
      this.aic.nextL()
    }

    nextRAuto () {
      this.aic.nextR()
    }
    goToRight(id){
      this.aic.goToRight(id);
    }

    confirmAuto () {
      this.aic.confirmAuto();
      this.ric.update(this.aic.inc)
      console.log(this.aic.inc.isComplete())
      this.globalView.stylizedInc(Object.keys(this.rs.inclusions).find(key => 
        this.rs.inclusions[key] === this.aic.inc));

    }

    save () {
      this.notify('on_save', this.rs.toJSON())
    }

    stylized (id) {
      if(this.rs.inclusions[id].isComplete()){
        this.globalView.stylizedInc(id);
      }
    
    }
    toJSON(){
      console.log("save")
      console.log(this.edgesInCyList)
      return { rs: this.rs.toJSON(),edgesInCyList:this.edgesInCyList,edgesInGraphList:this.edgesInGraphList}
    }
    saveAsFile(){
      var FileSaver = require('../util/FileSaver');
      var blob = new Blob([JSON.stringify(this.toJSON())], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "rs.txt");      
    }
    loadFile() {
      var input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => { 

        // getting a hold of the file reference
        var file = e.target.files[0]; 

        // setting up the reader

        var reader = new FileReader();
        
        reader.readAsText(file,'UTF-8');
            // here we tell the reader what to do when it's done reading...
            reader.onload =  readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            content=JSON.parse(content.replace(/(?:\\[r,n])+/g, ''))
            this.edgesInGraphList=content["edgesInGraphList"];
            this.edgesInCyList=content["edgesInCyList"];
            this.rs.ofJSON(content["rs"]);
            this.globalView.updateGraph(this.rs.graph);
            this.rs.refreshGraph();
            console.log(this.rs.inclusions)
            this.ric.loadInclusion();
            

          }
        
        
      } 
      input.click();
    }
}

module.exports = { RuleSystemComponent, RuleSystemComponentObserver }

