
var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { GraphInclusion, GraphInclusionObserver } = require('./GraphInclusion.js')
var { Rule, RuleObserver } = require('./Rule.js')

class RuleInclusionObserver extends Observer {
  constructor (rinc) {
    super(rinc)
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

class RuleInclusion extends Observable {
    static LGraphIObs = class extends GraphInclusionObserver {
      constructor (rinc, lgraphI) {
        super(lgraphI)
        this.rinc = rinc
      }

      on_setNode (idx, idy) {
        this.rinc.validated = false
        this.rinc.notify('on_setNodeL', idx, idy)
      }

      on_setEdge (idx, idy) {
        this.rinc.validated = false
        this.rinc.notify('on_setEdgeL', idx, idy)
      }

      on_unsetNode (idx, idy) {
        this.rinc.validated = false
        this.rinc.notify('on_setNodeL', idx, idy)
      }

      on_unsetEdge (idx, idy) {
        this.rinc.validated = false
        this.rinc.notify('on_setEdgeL', idx, idy)
      }
    }

    static RGraphIObs = class extends GraphInclusionObserver {
      constructor (rinc, rgraphI) {
        super(rgraphI)
        this.rinc = rinc
      }

      on_setNode (idx, idy) {
        this.rinc.validated = false
        this.rinc.notify('on_setNodeR', idx, idy)
      }

      on_setEdge (idx, idy) {
        this.rinc.validated = false
        this.rinc.notify('on_setEdgeR', idx, idy)
      }

      on_unsetNode (idx, idy) {
        this.rinc.validated = false
        // revenir ici attention
        // this.rinc.notify("on_undesetNodeR", idx,idy);
      }

      on_unsetEdge (idx, idy) {
        this.rinc.validated = false
        // this.rinc.notify("on_undesetEdgeR", idx,idy);
      }
    }

    static Sub = class extends RuleObserver {
      constructor (rinc, r) {
        super(r)
        this.rinc = rinc
      }
    }

    static Over = class extends RuleObserver {
      constructor (rinc, r) {
        super(r)
        this.rinc = rinc
      }
    }

    // eleOver dictionary { idSub : idOver}
    constructor (sub, over) {
      super()
      this.sub = sub
      this.over = over
      // an inclusion is only valid once the user has confirmed it
      this.validated = false
      this.lgraphI = new GraphInclusion(sub.lhs, over.lhs)
      this.rgraphI = new GraphInclusion(sub.rhs, over.rhs)
      new RuleInclusion.Sub(this, sub)
      new RuleInclusion.Over(this, over)
      new RuleInclusion.LGraphIObs(this, this.lgraphI)
      new RuleInclusion.RGraphIObs(this, this.rgraphI)
    }

    toJSON () {
      return JSON.stringify({
        lgraphI: JSON.parse(this.lgraphI.toJSON((data) => { return data }, (data) => { return data })),
        rgraphI: JSON.parse(this.rgraphI.toJSON((data) => { return data }, (data) => { return data })),
        validated: this.validated
      })
    }


    // what is still unbound in the source rule (lhs and rhs, nodes and edges)
    missing () {
      const count = (o) => Object.keys(o).length
      return {
        lhsNodes: count(this.sub.lhs.nodes) - count(this.lgraphI.nodeMap),
        lhsEdges: count(this.sub.lhs.edges) - count(this.lgraphI.edgeMap),
        rhsNodes: count(this.sub.rhs.nodes) - count(this.rgraphI.nodeMap),
        rhsEdges: count(this.sub.rhs.edges) - count(this.rgraphI.edgeMap)
      }
    }

    isComplete () {
      return Object.values(this.missing()).every((n) => n === 0)
    }

    static ofJSON (json,dom,cod) {
      
      let jlgI=  JSON.stringify(JSON.parse(json)["lgraphI"]);
      let jrgI=  JSON.stringify(JSON.parse(json)["rgraphI"]);      
      let lgraphI= GraphInclusion.ofJSON(jlgI,dom.lhs,cod.lhs);
      let rgraphI=GraphInclusion.ofJSON(jrgI,dom.rhs,cod.rhs);
      return {
        lgraphI: lgraphI,
        rgraphI: rgraphI,
        validated: JSON.parse(json)['validated'] === true
      }
    }
}

module.exports = { RuleInclusion, RuleInclusionObserver }
