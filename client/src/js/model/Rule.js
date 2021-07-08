var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('./Graph.js')
const { GraphInclusion } = require('./GraphInclusion.js')

class RuleObserver extends Observer {
  constructor (r) {
    super(r)
  }

  on_update (hs) {};
}

class Rule extends Observable {
    // checker si c'est nécessaire
    static Lhs = class extends GraphObserver {
      constructor (rule, g) {
        super(g)

        this.rule = rule
      }

      on_addNode (id) {
      //     this.rule.rhs.addNode();
        this.rule.notify('on_update', 'lhs')
      }

      on_addEdge (ide, src, dest) {
        // this.rule.rhs.addEdge(src,dest);
        this.rule.notify('on_update', 'lhs')
      }

      on_removeEdge (id) {
        this.rule.notify('on_update', 'lhs')
      }

      on_removeNode (id) {
        this.rule.notify('on_update', 'lhs')
      }

      on_updateNode (id, dataN) {
        this.rule.notify('on_update', 'lhs')
      }

      on_updateEdge (id, dataE) {
        this.rule.notify('on_update', 'lhs')
      }
    }

    static Rhs = class extends GraphObserver {
      constructor (rule, g) {
        super(g)
        this.rule = rule
      }

      on_addNode (id) {
        //     this.rule.rhs.addNode();
        this.rule.notify('on_update', 'rhs')
      }

      on_addEdge (ide, src, dest) {
        this.rule.notify('on_update', 'rhs')
      }

      on_removeEdge (id) {
        this.rule.notify('on_update', 'rhs')
      }

      on_removeNode (id) {
        this.rule.notify('on_update', 'rhs')
      }

      on_updateNode (id, dataN) {
        this.rule.notify('on_update', 'rhs')
      }

      on_updateEdge (id, dataE) {
        this.rule.notify('on_update', 'rhs')
      }
    }

    static emptyRule () {
      return new Rule(null, null)
    }

    constructor (lhs, rhs) {
      super()
      this.lhs = lhs
      this.rhs = rhs
      this.rautoInclusions = []
      this.lhsObserver = new Rule.Lhs(this, lhs)
      this.rhsObserver = new Rule.Rhs(this, rhs)
      this.nodeRgc = {}
      this.edgeRgc = {}
      this.base = []
      this.saturation = []
    }

    generateGIncs () {
      this.rgraphI = []
      this.lgraphI = []
      for (let i = 0; i < this.base.length; i++) {
        const b = this.base[i]
        const ginc = GraphInclusion.ofJSON(this.lhs, this.lhs, JSON.stringify(b))
        this.lgraphI.push(ginc)
      }
      for (let i = 0; i < this.rautoInclusions.length; i++) {
        const a = this.rautoInclusions[i]
        const ginc = GraphInclusion.ofJSON(this.rhs, this.rhs, JSON.stringify(a))
        this.rgraphI.push(ginc)
      }
      if (this.rautoInclusions.length == 0) this.rgraphI.push(new GraphInclusion(this.rhs, this.rhs))
      if (this.base.length == 0) this.lgraphI.push(new GraphInclusion(this.lhs, this.lhs))
    }

    toJSON () {
      return JSON.stringify({
        lhs: JSON.parse(this.lhs.toJSON((data) => { return data }, (data) => { return data })),
        rhs: JSON.parse(this.rhs.toJSON((data) => { return data }, (data) => { return data }))
      })
    }

    compose (s, a) {
      const nodeMap = {}
      const edgeMap = {}
      for (const n in a.nodeMap) {
        nodeMap[n] = s.nodeMap[a.nodeMap[n]]
      }
      for (const src in a.edgeMap) {
        edgeMap[src] = s.edgeMap[a.edgeMap[src]]
      }
      return [nodeMap, edgeMap]
    }

    generateBase (autoInclusions) {
      this.base = []
      const identity = this.popIdentity(autoInclusions)
      if (identity != null) this.base.push(identity)
      this.saturation.push(identity)
      let a
      let s
      let t
      const fifo = []
      while (autoInclusions.length > 0) {
        a = autoInclusions.shift()
        this.base.push(a)
        fifo.push(a)
        while (fifo.length > 0) {
          s = fifo.shift()
          t = this.compose(s, a)
          this.deleteAutoInc(t, autoInclusions)
          if (!this.inSatutration(t)) { fifo.push(t) }
          if (!this.checkEquality(a, s)) {
            t = this.compose(a, s)
            this.deleteAutoInc(t, autoInclusions)
            if (!this.inSatutration(t)) { fifo.push(t) }
          }
        }
      }

      return this.base
    }

    inSatutration (a) {
      for (let i = 0; i < this.saturation.length; i++) {
        if (this.checkEquality(a, this.saturation[i])) return true
      }
      return false
    }

    deleteAutoInc (t, autoInclusions) {
      let a
      for (let i = 0; i < autoInclusions.length; i++) {
        a = autoInclusions[i]
        if (this.checkEquality(t, a)) {
          autoInclusions.splice(i, 1)
        }
      }
    }

    popIdentity (autoInclusions) {
      let identity = null
      for (let i = 0; i < autoInclusions.length; i++) {
        if (this.checkIdentity(autoInclusions[i].nodeMap, autoInclusions[i].edgeMap)) {
          identity = autoInclusions[i]
          autoInclusions.splice(i, 1)
        }
      }
      return identity
    }

    checkIdentity (nodeMap, edgeMap) {
      for (const src in edgeMap) if (edgeMap[src] != src) return false
      for (const n in nodeMap) if (nodeMap[n] != n) return false
      return true
    }

    checkEquality (t, a) {
      for (const src in t.edgeMap) if (t.edgeMap[src] != a.edgeMap[src]) return false
      for (const n in t.nodeMap) if (t.nodeMap[n] != a.nodeMap[n]) return false
      return true
    }
}

module.exports = { Rule, RuleObserver }
