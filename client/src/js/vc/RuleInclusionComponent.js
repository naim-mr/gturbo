var { GraphInclusionComponent } = require('./GraphInclusionComponent')
var { Rule, RuleObserver } = require('../model/Rule.js')
var { RuleInclusion, RuleInclusionObserver } = require('../model/RuleInclusion.js')

class RuleInclusionComponent {
    static IncObs = class extends RuleInclusionObserver {
      constructor (ric, inc) {
        super(inc)
        this.ric = ric
      }

      // Sinon rajouter un paramètre définissant gauche ou droite
      on_setNodeL (idx, idy) {}

      on_setEdgeL (idx, idy) {}

      on_unsetNodeL (idx, idy) {}

      on_unsetEdgeL (idx, idy) {}

      on_setNodeR (idx, idy) {}

      on_setEdgeR (idx, idy) {}

      on_unsetNodeR (idx, idy) {}

      on_unsetEdgeR (idx, idy) {}
    }

    constructor (inc) {
      this.lgcI = new GraphInclusionComponent(inc.lgraphI, ['lhs2', 'lhs1'],false)
      this.rgcI = new GraphInclusionComponent(inc.rgraphI, ['rhs2', 'rhs1'],true)
      this.inc = inc
      this.incObs = new RuleInclusionComponent.IncObs(this, inc)
      this.cur = 0
      this.cpt = 0
      this.create = true
    }

    destroyObserver () {
      if (this.inc != undefined) this.inc.unregister(this.incObs)
    }

    updateEdgesMap (sub, over, edgesInCyList, edgesInGraphList) {
      this.lgcI.updateEdgesMap(edgesInCyList[over].left, edgesInGraphList[over].left, true)
      this.lgcI.updateEdgesMap(edgesInCyList[sub].left, edgesInGraphList[sub].left, false)
      this.rgcI.updateEdgesMap(edgesInCyList[over].left, edgesInGraphList[over].left, true)
      this.rgcI.updateEdgesMap(edgesInCyList[sub].left, edgesInGraphList[sub].left, false)
      this.create = false
    }

    update (inc) {
      this.destroyObserver()
      this.inc = inc
      this.lgcI.updateComponent(inc.lgraphI)
      this.rgcI.updateComponent(inc.rgraphI)
      this.create = true
      this.incObs = new RuleInclusionComponent.IncObs(this, inc)
    }

    printNewInclusion () {
      this.create = true
      this.removeEles()
      this.lgcI.printNewInclusion()
      this.rgcI.printNewInclusion()
    }

    removeEles () {
      this.lgcI.removeEles()
      this.rgcI.removeEles()
    }

    loadInclusion () {
      this.removeEles()
      this.lgcI.loadInclusion()
      this.rgcI.loadInclusion()
    }
}

module.exports = RuleInclusionComponent
