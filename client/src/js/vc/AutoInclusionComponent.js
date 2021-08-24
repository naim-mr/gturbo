var { GraphInclusionComponent } = require('./GraphInclusionComponent')
var { Rule, RuleObserver } = require('../model/Rule.js')
var { RuleInclusion, RuleInclusionObserver } = require('../model/RuleInclusion.js')

class AutoInclusionComponent {
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

    constructor (rule,inc) {
      rule.generateGIncs()
      this.lgcI = new GraphInclusionComponent(rule.lgraphI[0], ['a_lhs2', 'a_lhs1'],false)
      this.rgcI = new GraphInclusionComponent(rule.rgraphI[0], ['a_rhs2', 'a_rhs1'],false)
      this.rule = rule
      this.inc=inc;
      // this.incObs = new RuleInclusionComponent.IncObs(this, inc)
      this.curR = 0
      this.curL = 0
      this.loadInclusion()
      this.checkListLeft = []
      this.checkListRight = []
      for (let i = 0; i < this.rule.lgraphI.length; i++) this.checkListLeft.push(false)
      for (let i = 0; i < this.rule.rgraphI.length; i++) this.checkListRight.push(false)
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

    /* update (inc) {
      this.destroyObserver();
      this.inc = inc
      this.lgcI.updateComponent(inc.lgraphI)
      this.rgcI.updateComponent(inc.rgraphI)
      this.create=true
      this.incObs = new RuleInclusionComponent.IncObs(this, inc)

    } */
    update (r,inc) {
      this.rule = r
      this.lgcI.updateComponent(inc.lgraphI)
      this.rgcI.updateComponent(r.rgraphI[0])
      this.loadInclusion()
    }

    nextL () {
      if (this.curL + 1 < this.rule.lgraphI.length) {
        this.curL++
        this.lgcI.updateComponent(this.rule.lgraphI[this.curL])
        this.loadLeft()
      }
    }

    nextR () {
      if (this.curR + 1 < this.rule.rgraphI.length) {
        this.curR++
        this.rgcI.updateComponent(this.rule.rgraphI[this.curR])
        this.loadRight()
      }
    }

    prevL () {
      if (this.curL > 0) {
        this.curL--
        this.lgcI.updateComponent(this.rule.lgraphI[this.curL])
        this.loadLeft()
      }
    }

    prevR () {
      if (this.curR > 0) {
        this.curR--
        this.rgcI.updateComponent(this.rule.rgraphI[this.curR])
        this.loadRight()
        
      }
    }
    goToRight(id){
      this.curR=id;
      this.rgcI.updateComponent(this.rule.rgraphI[this.curR])
      this.loadRight()

    }
    loadInclusion () {
      this.lgcI.removeEles()
      this.rgcI.removeEles()
      console.log('load')
      this.lgcI.loadInclusion()
      this.rgcI.loadInclusion()
    }

    loadRight () {
      this.rgcI.removeEles()
      this.rgcI.loadInclusion()
    }

    loadLeft () {
      this.lgcI.removeEles()
      this.lgcI.loadInclusion()
    }

    confirmAuto () {
      this.checkListLeft[this.curL] = true
      this.checkListRight[this.curR] = true
      
      const lgraphI = this.rule.lgraphI[this.curL];
      const rgraphI = this.rule.rgraphI[this.curR]
      this.inc.lgraphI = lgraphI
      this.inc.rgraphI = rgraphI
       
    }
}

module.exports = { AutoInclusionComponent }
