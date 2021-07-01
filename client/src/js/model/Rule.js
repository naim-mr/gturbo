var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('./Graph.js')

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
      this.autoInclusion = {}
      this.lhsObserver = new Rule.Lhs(this, lhs)
      this.rhsObserver = new Rule.Rhs(this, rhs)
      this.nodeRgc = {}
      this.edgeRgc = {}
    }

    toJSON () {
      return JSON.stringify({
        lhs: JSON.parse(this.lhs.toJSON( (data)=> { return  data}, (data)=> { return  data}     )),
        rhs: JSON.parse(this.rhs.toJSON(  (data)=> { return  data}, (data)=> { return  data}    ))
      })
    }

    addAutoInclusion (nodeMap, edgeMap) {

    }

    checkAutoInclusion () {

    }
}

module.exports = { Rule, RuleObserver }
