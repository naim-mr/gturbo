var { GraphInclusionComponent } = require('./GraphInclusionComponent')
var { Rule, RuleObserver } = require('../../model/Rule.js')
var { RuleInclusion, RuleInclusionObserver } = require('../../model/RuleInclusion.js')

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
      
      this.lgcI = new GraphInclusionComponent(inc.lgraphI, ['lhs2', 'lhs1'])
      this.rgcI = new GraphInclusionComponent(inc.rgraphI, ['rhs2', 'rhs1'])
      this.inc = inc
      this.create=false;
      this.incObs = new RuleInclusionComponent.IncObs(this, inc)
      this.cur = 0
      this.cpt = 0
    }

    deleteInclusion () {

    };

    updateEdgesMap (sub, over, edgesInCy, edgesInGraph) {
      this.lgcI.updateEdgesMap(edgesInCy[over].left, edgesInGraph[over].left, true)
      this.lgcI.updateEdgesMap(edgesInCy[sub].left, edgesInGraph[sub].left, false)
      this.rgcI.updateEdgesMap(edgesInCy[over].left, edgesInGraph[over].left, true)
      this.rgcI.updateEdgesMap(edgesInCy[sub].left, edgesInGraph[sub].left, false)
      this.create=false;
    }

    update (inc) {
      if(this.inc != undefined)this.inc.unregister(this.incObs)
      this.inc = inc
      this.lgcI.updateComponent(inc.lgraphI)
      this.rgcI.updateComponent(inc.rgraphI)
      this.create=false;
      this.incObs = new RuleInclusionComponent.IncObs(this, inc)
    }

    coloredInclusion () {
      this.create=true;
      this.lgcI.coloredInclusion()
      this.rgcI.coloredInclusion()
    }

    loadInclusion () {
      this.lgcI.loadInclusion()
      this.rgcI.loadInclusion()
    }
}

module.exports = RuleInclusionComponent 
