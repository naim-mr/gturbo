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
        const ginc = GraphInclusion.ofJSON( JSON.stringify(b),this.lhs, this.lhs)
        this.lgraphI.push(ginc)
      }
      for (let i = 0; i < this.rautoInclusions.length; i++) {
        const a = this.rautoInclusions[i]
        const ginc = GraphInclusion.ofJSON( JSON.stringify(a),this.rhs, this.rhs)
        this.rgraphI.push(ginc)
      }
      if (this.rautoInclusions.length == 0) this.rgraphI.push(new GraphInclusion(this.rhs, this.rhs))
      if (this.base.length == 0) this.lgraphI.push(new GraphInclusion(this.lhs, this.lhs))
    }

    toJSON (x,y) {
     return JSON.stringify({
        lhs: JSON.parse(this.lhs.toJSON((data) => { return data }, (data) => { return data })),
        rhs: JSON.parse(this.rhs.toJSON((data) => { return data }, (data) => { return data })),
        x:x,
        y:y
      })
    }
    generateBase(morphisms){
        let b = new Base(morphisms);
        this.base=b.base;
        console.log("base")
        console.log(this.base)
        this.saturation=b.saturation;
    }
    
    static ofJSON(json){
      
      
      let jlhs=  JSON.stringify(JSON.parse(json)["lhs"]);
      let jrhs=  JSON.stringify(JSON.parse(json)["rhs"]);
      let lhs= Graph.ofJSON(jlhs,(data) => { return data }, (data) => { return data });
      let rhs =Graph.ofJSON(jrhs,(data) => { return JSON.parse(data) }, (data) => { return JSON.parse(data) });
      lhs.refresh();
      rhs.refresh();
      
      return {
        lhs:lhs,
        rhs:rhs,
        x: JSON.parse(json)["x"],
        y: JSON.parse(json)["y"]

      }
    }
  

}

module.exports = { Rule, RuleObserver }
