
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
  on_save (json) {};
}

class RuleSystemComponent extends Observable {
    static RuleSystemObs = class extends RuleSystemObserver {
      constructor (rsc, rs) {
        super(rs)

        this.rsc = rsc
      }

      on_createRule (rule) {
        if (this.rsc.rc == undefined) this.rsc.rc = new RuleComponent(new GraphComponent(rule.lhs, 'lhs'), new GraphComponent(rule.rhs, 'rhs'), rule)
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
        this.rsc.loadInclusion(id)
        this.rsc.notify('on_editInclusion', id)
      }
    }

    // precond rs in RuleSystem
    constructor (rs) {
      super()
      this.onCreate = true
      this.onDelete = false

      this.rs = rs
      this.globalView = new GlobalView(rs.graph, 'rcomp')
      new RuleSystemComponent.GlobalViewObs(this.globalView, this)

      this.edgesInCyList = []
      this.edgesInGraphList = []

      new RuleSystemComponent.RuleSystemObs(this, rs)
    }

    pushEdgesIds () {
      this.edgesInGraphList.push(this.rc.edgesInGraph())
      this.edgesInCyList.push(this.rc.edgesInCy())
    }

    saveEdgesIds () {
      const n = this.rc.cur
      this.edgesInCyList[n] = this.rc.edgesInCy()
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
        console.log(inc)
        this.ric.update(inc)
      }
      this.ric.cur = n
      this.ric.loadInclusion()
    }

    printNewInclusion (n) {
      /* this.removeElesI();
        if (this.rs.inclusions[n] != this.ric.inc) {
            let inc = this.rs.inclusions[n];
            this.ric.update(inc);
        }
        this.ric.cur = n;
        this.ric.printNewInclusion();
        */
      this.loadInclusion(n)
    }

    removeElesI () {
      if (this.ric !=
            undefined) {
        this.ric.lgcI.removeEles()
        this.ric.rgcI.removeEles()
      }
    }

    async generateAutoInclusion () {
      await this.rs.generateInclusion(this.getCurrentRule(), this.getCurrentRule())
        .then(() => {
          if (this.aic == undefined) this.aic = new AutoInclusionComponent(this.rs.rules[this.getCurrentRule()])
          else this.aic.update(this.rs.rules[this.getCurrentRule()])
        }
        )
    }

    getBaseLeft () {
      return this.rs.rules[this.getCurrentRule()].base.length
    }

    updateInclusion () {
      this.rs.updateInclusion(this.getCurrentRule())
    }

    prevLAuto () {
      this.aic.prevL()
    }

    prevRAuto () {
      this.aic.prevR()
    }

    nextLAuto () {
      this.aic.nextL()
    }

    nextRAuto () {
      this.aic.nextR()
    }

    confirmAuto () {
      const tab = this.aic.confirmAuto()
      const lgraphI = tab[0]
      const rgraphI = tab[1]
      const inc = this.rs.createInclusion(this.getCurrentRule(), this.getCurrentRule())
      this.globalView.stylizedRule(this.getCurrentRule())
      inc.lgraphI = lgraphI
      inc.rgraphI = rgraphI
      console.log('tab')
      console.log(tab)
      this.ric.update(inc)
      let full = true
      for (let i = 0; i < this.aic.checkListLeft.length; i++) if (!this.aic.checkListLeft[i]) full = false
      return full
    }

    save () {
      this.notify('on_save', this.rs.toJSON())
    }

    stylized (id) {
      this.globalView.stylizedInc(id)
    }
}

module.exports = { RuleSystemComponent, RuleSystemComponentObserver }
