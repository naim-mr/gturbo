// Problème où faire le notify
const removeElement = (array, elem) => {
  var index = array.indexOf(elem)
  console.log(index)
  if (index > -1) {
    array.splice(index, 1)
  }
}

var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('./Graph.js')
var { Rule, RuleObserver } = require('./Rule.js')
var { RuleInclusion, RuleInclusionObserver } = require('./RuleInclusion.js')
var axios = require('axios')
const { GraphInclusion } = require('./GraphInclusion.js')
const { Base } = require('./Base.js')

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
      on_loadEdge(id,data){
        
        this.rs.inclusions[id].lgraphI=data.lgraphI;
        this.rs.inclusions[id].rgraphI=data.rgraphI;
        
      }
      on_loadNode(id,data){
        
        this.rs.rules[id].lhs=data.lhs;
        this.rs.rules[id].rhs=data.rhs;
        
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
        this.rs.rules[id] = r
        this.rs.notify('on_createRule', r) // solution au problème
        this.rs.autoAddInclusion(r)
      }

      on_addEdge (id, sub, over) {
        const subTemp = this.rs.rules[sub]
        const overTemp = this.rs.rules[over]
        console.log("on add_edge ")
        console.log(subTemp)
        console.log(overTemp)
        const inc = new RuleInclusion(subTemp, overTemp)
        new RuleSystem.RuleInclusionObs(this, inc)
        this.rs.graph.updateEdge(id, (data) => {
          data.inc = inc
          return data
        })

        this.rs.notify('on_createInclusion', inc, sub, over) // solution au problème
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
      this.rules = {}
      this.inclusions = {}
      this.base=[]
      this.morphisms=[]
      this.memory=[]
      this.graphObs=new RuleSystem.GraphObs(this, this.graph)
    }

    createRule () {
      const id = this.graph.addNode()
      const rule = this.graph.nodes[id].data.rule
      new RuleSystem.RuleObs(this, rule)
      return rule
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

    async autoAddInclusion (rule) {
      var id
      this.memory=[]
      this.morphisms=[];
      for (const idr in this.rules) {
        if (this.rules[idr] == rule)id = idr
      }
      for (const idr in this.rules) {
        await this.generateInclusion(id, idr)
        if(idr!=id)await this.generateInclusion(idr, id)
   
      }

    }
    updateAutoInclusion(id){
        
    }
    async  updateInclusion (id) {
      for (const inc in this.inclusions) {
        if ((this.inclusions[inc].sub == this.rules[id] || this.inclusions[inc].over == this.rules[id]) && this.inclusions[inc].over != this.inclusions[inc].sub) {
          this.deleteInclusion(this.inclusions[inc])
        }
      }
      this.morphisms=[];
      for (const idr in this.rules) {
        await this.generateInclusion(id, idr)
        if(idr!=id) await this.generateInclusion(idr, id)
      }
     }
    
    
    // Je passe par la pour bien notifier et donc faire une suppression en cascad
    // Avant : suppression règle => suppression d'inclsuion mais pas de notify sur l'inclusion :/
    deleteRuleById (id) {
      this.notify('on_deleteRule', id)
      delete this.rules[id]
    }

    deleteInclusionById (id) {
      this.notify('on_deleteInclusion', id)
      delete this.inclusions[id]
    }

    deleteInclusion (i) {
      console.log(i)
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

    async generateInclusion (n, m) {
      const lhs1 = this.rules[n].lhs
      const lhs2 = this.rules[m].lhs
      var base
      if (n == m) {
        for (const inc in this.inclusions) {
          if (this.inclusions[inc].sub == this.rules[n] && this.inclusions[inc].over == this.rules[n]) {
            this.deleteInclusion(this.inclusions[inc])
          }
        }
      }
      await axios.post('http://127.0.0.1:5000/Inclusion', [JSON.parse(lhs1.toJSON((data) => { return data }, (data) => { return data })), JSON.parse(lhs2.toJSON((data) => { return data }, (data) => { return data }))])
        .then((res) => {
          const morphisms = []
          for (const inc of res.data) {
            morphisms.push(JSON.parse(inc))
          }
          if (n == m) {
            this.rules[n].generateBase(morphisms)
            this.rules[n].generateGIncs();
            for (let i = 0; i < this.rules[n].lgraphI.length; i++) {
              let inc = this.createInclusion(n, m)
              inc.lgraphI=this.rules[n].lgraphI[i];
            }            
          } else {
            
            for (let i = 0; i < morphisms.length; i++) {
              const auto = morphisms[i];
              this.morphisms.push(auto);
              const inc = this.createInclusion(n, m)
              for (const node in auto.nodeMap) {
                  inc.lgraphI.setNode(parseInt(node), parseInt(auto.nodeMap[node]))
                }
                for (const src in auto.edgeMap) {
                  inc.lgraphI.setEdge(parseInt(src), parseInt(auto.edgeMap[src]))
                }
            }
              
              
            }
          }
        )
        .catch((error) => {
          console.error(error)
        })
        if (n == m) {
          const rhs = this.rules[n].rhs
          await axios.post('http://127.0.0.1:5000/Inclusion', [JSON.parse(rhs.toJSON((data) => { return data }, (data) => { return data })), JSON.parse(rhs.toJSON((data) => { return data }, (data) => { return data }))])
            .then((res) => {
              const rautoInclusions = []
              for (const inc of res.data) {
                rautoInclusions.push(JSON.parse(inc))
              }

              this.rules[n].rautoInclusions = rautoInclusions
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }

    toJSON () {
      return this.graph.toJSON((data) => { return data.rule.toJSON(data.x,data.y)} , (data) => { return data.inc.toJSON(data.x,data.y) })
    }

    ofJSON(json){
      this.graph.unregister(this.graphObs);
      this.graph= Graph.ofJSON(json, (data) => { return Rule.ofJSON(data)}, (data,dom,cod) => { return RuleInclusion.ofJSON(data,dom,cod)})
      this.graphObs=new RuleSystem.GraphObs(this,this.graph)
      
    }
    refreshGraph(){
      this.graph.refresh();
      
    }





    
}
module.exports = { RuleSystem, RuleSystemObserver }
