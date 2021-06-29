//Problème où faire le notify

var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('./Graph.js')
var { Rule, RuleObserver } = require('./Rule.js')
var { RuleInclusion, RuleInclusionObserver } = require('./RuleInclusion.js')

class RuleSystemObserver extends Observer {
  constructor (rs) {
    super(rs)
  }

  on_createRule (rule) {};
  on_deleteRule (id) {};
  on_createInclusion (inc, sub, over) {};
  on_deleteInclusion (id) {};
}

class RuleSystem extends Observable {
    static GraphObs = class extends GraphObserver {
      constructor (rs, g) {
        super(g)
        this.rs = rs
      }

      on_addNode (id) {
        const lhs = new Graph()
        const rhs = new Graph()
        const r = new Rule(lhs, rhs)
        new RuleSystem.RuleObs(this.rs, r)
        this.rs.graph.updateNode(id, (data) => {
          data.rule = r
          return data
        })
      
        this.rs.notify('on_createRule', r) // solution au problème
        this.rs.rules[id] = r
      }

      on_addEdge (id, sub, over) {
        const subTemp = this.rs.rules[sub]
        const overTemp = this.rs.rules[over]
        const inc = new RuleInclusion(subTemp, overTemp)
        new RuleSystem.RuleInclusionObs(this, inc)
        this.rs.graph.updateEdge(id, (data) => {
          data.inc = inc
          return data
        })
      
        this.rs.notify('on_createInclusion', inc,sub,over) // solution au problème
        this.rs.inclusions[id] = inc
      }

      on_removeNode (id) {
        this.rs.rules[id].unregister(this)
        this.rs.deleteRuleById(id)
        /* this.rs.graph.updateNode(id, (data) => {
                delete data["rule"];
                return data;
            }); */
      }

      on_removeEdge (id) {
        this.rs.inclusions[id].unregister(this)
        this.rs.deleteInclusionById(id)
        /*   this.rs.graph.updateEdge(id, (data) => {
                delete data["inc"];
                return data;
            })
            */
      }
    }

    static RuleObs = class extends RuleObserver {
      constructor (rs, r) {
        super(r)
        this.rs = rs
      }
    }

    static RuleInclusionObs = class extends RuleInclusionObserver {
      constructor (rs, i) {
        super(i)
        this.rs = rs
      }
    }

    constructor () {
      super()
      this.graph = new Graph()
      this.rules = []
      this.inclusions = []
      new RuleSystem.GraphObs(this, this.graph)
    }

    createRule () {
      const id = this.graph.addNode()
      const rule = this.graph.nodes[id].data.rule
      new RuleSystem.RuleObs(this, rule)
      return rule
    }

    deleteF (x, fn) {

    }

    deleteRule (r) {
      r.unregisterAll()
      let idr
      Object.keys(this.rules).reduce((result, id) => {
        if (this.rules[id] == r) {
          idr = id
          this.graph.removeNode(id)
        }
        return null
      }, null)
    }

    createInclusion (sub, over) {
      const id = this.graph.addEdge(sub, over)
      const inc = this.graph.edges[id].data.inc
      new RuleSystem.RuleInclusionObs(this, inc)
      return inc
    }

    // Je passe par la pour bien notifier et donc faire une suppression en cascad
    // Avant : suppression règle => suppression d'inclsuion mais pas de notify sur l'inclusion :/
    deleteRuleById (id) {
      this.notify('on_deleteRule', id)
      delete this.rules[id]
    }

    deleteInclusionById (id) {
      console.log(this.graph)
      this.notify('on_deleteInclusion', id)
      delete this.inclusions[id]
    }

    deleteInclusion (i) {
      i.unregisterAll()
      let idI
      Object.keys(this.inclusions).reduce((result, id) => {
        // ATTENTION typeof(id)==string
        if (this.inclusions[id] == i) {
          this.graph.removeEdge(parseInt(id))
        }
        return null
      }, null)
    }
}

module.exports = {RuleSystem, RuleSystemObserver}
