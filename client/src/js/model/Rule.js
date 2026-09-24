var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('./Graph.js')
const { GraphInclusion } = require('./GraphInclusion.js')
var {Base} = require('./Base.js')
class RuleObserver extends Observer {
  constructor (r) {
    super(r)
  }

  on_update (hs) {};
}

class Rule extends Observable {
    // check whether this is necessary
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
      this.name = ''
      // what the graphs looked like when the inclusions were last computed
      this.computedSignature = null
      this.lhsObserver = new Rule.Lhs(this, lhs)
      this.rhsObserver = new Rule.Rhs(this, rhs)
      this.nodeRgc = {}
      this.edgeRgc = {}
      this.base = []
      this.saturation = []
    }

    // the structure of the lhs and of the rhs (not the positions of the nodes)
    signature () {
      const of = (g) => JSON.stringify([
        Object.keys(g.nodes).sort(),
        Object.keys(g.edges).sort().map((e) => [e, g.edges[e].src, g.edges[e].dst])
      ])
      return of(this.lhs) + of(this.rhs)
    }

    markComputed () {
      this.computedSignature = this.signature()
    }

    // true when the graphs are the ones the inclusions were computed for
    isUpToDate () {
      return this.computedSignature !== null && this.computedSignature === this.signature()
    }

    static identity (g) {
      const id = new GraphInclusion(g, g)
      for (const n of Object.keys(g.nodes)) id.setNode(parseInt(n), parseInt(n))
      for (const e of Object.keys(g.edges)) id.setEdge(parseInt(e), parseInt(e))
      return id
    }

    generateGIncs () {
      this.rgraphI = []
      this.lgraphI = []
      for (let i = 0; i < this.base.length; i++) {
        const b = this.base[i]
        const ginc = GraphInclusion.ofJSON( JSON.stringify(b),this.lhs, this.lhs)
        this.lgraphI.push(ginc)
      }
      for (let i = 0; i < this.rautoInclusions.length; i++) {
        const a = this.rautoInclusions[i]
        const ginc = GraphInclusion.ofJSON( JSON.stringify(a),this.rhs, this.rhs)
        this.rgraphI.push(ginc)
      }
      // no generator (or no answer from the server): the identity is the only choice
      if (this.rautoInclusions.length == 0) this.rgraphI.push(Rule.identity(this.rhs))
      if (this.base.length == 0) this.lgraphI.push(Rule.identity(this.lhs))
    }

    toJSON (x,y) {
     return JSON.stringify({
        lhs: JSON.parse(this.lhs.toJSON((data) => { return data }, (data) => { return data })),
        rhs: JSON.parse(this.rhs.toJSON((data) => { return data }, (data) => { return data })),
        x:x,
        y:y,
        base: this.base,
        rautoInclusions: this.rautoInclusions,
        name: this.name
      })
    }
    generateBase(morphisms){
        let b = new Base(morphisms);
        this.base=b.base;
        this.saturation=b.saturation;
    }
    
    static ofJSON(json){
      
      
      let jlhs=  JSON.stringify(JSON.parse(json)["lhs"]);
      let jrhs=  JSON.stringify(JSON.parse(json)["rhs"]);
      let lhs= Graph.ofJSON(jlhs,(data) => { return data }, (data) => { return data });
      let rhs =Graph.ofJSON(jrhs,(data) => { return data }, (data) => { return data });
      lhs.refresh();
      rhs.refresh();
      
      return {
        lhs:lhs,
        rhs:rhs,
        x: JSON.parse(json)["x"],
        y: JSON.parse(json)["y"],
        base: JSON.parse(json)["base"] || [],
        rautoInclusions: JSON.parse(json)["rautoInclusions"] || [],
        name: JSON.parse(json)["name"] || ''

      }
    }
  

}

module.exports = { Rule, RuleObserver }
