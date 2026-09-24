
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

      on_validateInclusion (id) {
        this.rsc.stylized(id)
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
          const inc = this.rsc.rs.inclusions[id]
          // the rule of the inclusion itself, not the last edited one
          if (this.rsc.aic == undefined) this.rsc.aic = new AutoInclusionComponent(inc.sub, inc)
          else this.rsc.aic.update(inc.sub, inc)
          this.rsc.aic.incId = id
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
      return this.aic.rule.rgraphI.length
    }

    updateInclusion (toDelete) {
      this.rs.updateInclusion(this.getCurrentRule(),toDelete)
    }

    goToRight (i) {
      this.aic.goToRight(i)
    }

    // validate the auto-inclusion being edited
    confirmAuto () {
      this.aic.confirmAuto()
      this.stylized(this.aic.incId)
    }

    // green when the inclusion has been validated, orange dashed otherwise
    stylized (id) {
      this.globalView.stylizedInc(id, this.rs.inclusions[id].validated)
    }

    // called once the inclusion window is visible
    fitInclusion () {
      if (this.ric != undefined) {
        this.ric.lgcI.fit()
        this.ric.rgcI.fit()
      }
    }

    // Validate the inclusion being edited. Returns the list of what is missing.
    validateInclusion () {
      const inc = this.ric.inc
      if (!inc.isComplete()) return inc.missing()
      inc.validated = true
      this.stylized(this.ric.cur)
      return null
    }

    toJSON(){
      // keep the maps of the rule being displayed up to date
      if (this.rc != undefined && this.rc.lgc && this.rs.rules[this.rc.cur] !== undefined) this.saveEdgesIds()
      return { rs: this.rs.toJSON(),edgesInCyList:this.edgesInCyList,edgesInGraphList:this.edgesInGraphList}
    }
    saveAsFile(){
      var FileSaver = require('../util/FileSaver');
      var blob = new Blob([JSON.stringify(this.toJSON())], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "rs.txt");      
    }

    // rebuild the rule system from what toJSON produced
    loadJSON (content) {
      const n = content.edgesInCyList.length
      this.edgesInGraphList = content.edgesInGraphList
      this.edgesInCyList = content.edgesInCyList
      this.rs.loading = true
      try {
        this.rs.ofJSON(content.rs)
        this.globalView.updateGraph(this.rs.graph)
        this.rs.refreshGraph()
      } finally {
        this.rs.loading = false
      }
      this.rs.autoValidateAll()
      for (const id of Object.keys(this.rs.inclusions)) this.stylized(id)
      for (const id of Object.keys(this.rs.rules)) this.globalView.setLabel(id, this.rs.rules[id].name)
      // refreshing announced every rule again, which appended empty maps
      this.edgesInGraphList.length = n
      this.edgesInCyList.length = n
      if (this.ric != undefined) this.ric.loadInclusion()
    }

    loadFile() {
      var input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => { 
        var file = e.target.files[0]; 
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
          this.loadJSON(JSON.parse(readerEvent.target.result.replace(/(?:\\[r,n])+/g, '')))
        }
      } 
      input.click();
    }

    setRuleName (id, name) {
      this.rs.rules[id].name = name
      this.globalView.setLabel(id, name)
    }

    // one line per rule, for the "Rules Set" tab
    ruleSummaries () {
      const count = (o) => Object.keys(o).length
      return Object.keys(this.rs.rules).map((id) => {
        const r = this.rs.rules[id]
        return {
          id,
          name: r.name || '',
          lhsNodes: count(r.lhs.nodes),
          lhsEdges: count(r.lhs.edges),
          rhsNodes: count(r.rhs.nodes),
          rhsEdges: count(r.rhs.edges)
        }
      })
    }

    // windows created while hidden have no size until they are shown
    resizeWindows (view) {
      const resize = (gc) => { if (gc && gc.cy) gc.cy.resize() }
      if (view === 'global') resize(this.globalView)
      if (view === 'rule' && this.rc) { resize(this.rc.lgc); resize(this.rc.rgc) }
    }

    // release the windows (before the system is replaced by another one)
    destroy () {
      const kill = (gc) => {
        if (!gc) return
        gc.mouseover = false
        gc.ctrlKey = false
        // the document keeps the listeners of this window: make them harmless
        gc.onDelete = () => {}
        gc.onClick = () => {}
        try { gc.cy.destroy() } catch (e) {}
      }
      kill(this.globalView)
      if (this.rc) { kill(this.rc.lgc); kill(this.rc.rgc) }
      for (const c of [this.ric, this.aic]) {
        if (c) for (const g of [c.lgcI, c.rgcI]) { kill(g.domComp); kill(g.codComp) }
      }
    }
}

module.exports = { RuleSystemComponent, RuleSystemComponentObserver }

