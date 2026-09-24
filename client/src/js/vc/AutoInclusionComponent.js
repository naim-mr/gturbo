var { GraphInclusionComponent } = require('./GraphInclusionComponent')
var { Rule, RuleObserver } = require('../model/Rule.js')
var { RuleInclusion, RuleInclusionObserver } = require('../model/RuleInclusion.js')

class AutoInclusionComponent {
    static IncObs = class extends RuleInclusionObserver {
      constructor (ric, inc) {
        super(inc)
        this.ric = ric
      }

      // otherwise add a parameter telling left from right
      on_setNodeL (idx, idy) {}

      on_setEdgeL (idx, idy) {}

      on_unsetNodeL (idx, idy) {}

      on_unsetEdgeL (idx, idy) {}

      on_setNodeR (idx, idy) {}

      on_setEdgeR (idx, idy) {}

      on_unsetNodeR (idx, idy) {}

      on_unsetEdgeR (idx, idy) {}
    }

    // An auto-inclusion edge stands for one generator of the automorphisms of
    // the lhs (inc.lgraphI, fixed). The user picks which automorphism of the rhs
    // (rule.rgraphI[curR]) it is sent to.
    constructor (rule, inc) {
      rule.generateGIncs()
      this.rule = rule
      this.inc = inc
      this.curR = this.indexOfChosen()
      this.lgcI = new GraphInclusionComponent(inc.lgraphI, ['a_lhs2', 'a_lhs1'], false)
      this.rgcI = new GraphInclusionComponent(rule.rgraphI[this.curR], ['a_rhs2', 'a_rhs1'], false)
      this.loadInclusion()
    }

    // index of the rhs automorphism already chosen for this inclusion, 0 if none
    indexOfChosen () {
      const same = (a, b) => JSON.stringify(a.nodeMap) === JSON.stringify(b.nodeMap) &&
        JSON.stringify(a.edgeMap) === JSON.stringify(b.edgeMap)
      const i = this.rule.rgraphI.findIndex((g) => same(g, this.inc.rgraphI))
      return i < 0 ? 0 : i
    }

    destroyObserver () {}

    update (r, inc) {
      this.rule = r
      this.inc = inc
      this.curR = this.indexOfChosen()
      this.lgcI.updateComponent(inc.lgraphI)
      this.rgcI.updateComponent(r.rgraphI[this.curR])
      this.loadInclusion()
    }

    goToRight (i) {
      if (i === this.curR || i < 0 || i >= this.rule.rgraphI.length) return
      this.curR = i
      this.inc.validated = false
      this.rgcI.updateComponent(this.rule.rgraphI[this.curR])
      this.loadRight()
    }

    loadInclusion () {
      this.lgcI.removeEles()
      this.rgcI.removeEles()
      this.lgcI.loadInclusion()
      this.rgcI.loadInclusion()
    }

    loadRight () {
      this.rgcI.removeEles()
      this.rgcI.loadInclusion()
    }

    fit () {
      this.lgcI.fit()
      this.rgcI.fit()
    }

    // bind the lhs generator to the chosen rhs automorphism and validate
    confirmAuto () {
      this.inc.rgraphI = this.rule.rgraphI[this.curR]
      this.inc.validated = true
    }
}

module.exports = { AutoInclusionComponent }
