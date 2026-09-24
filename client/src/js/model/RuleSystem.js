// Problem: where to notify
const removeElement = (array, elem) => {
  var index = array.indexOf(elem)
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
const { SERVER_URL } = require('../util/config.js')
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
  on_validateInclusion (id) {};
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
        this.rs.inclusions[id].validated=data.validated;
        
      }
      on_loadNode(id,data){
        
        this.rs.rules[id].lhs=data.lhs;
        this.rs.rules[id].rhs=data.rhs;
        this.rs.rules[id].base=data.base||[];
        this.rs.rules[id].rautoInclusions=data.rautoInclusions||[];
        this.rs.rules[id].name=data.name||'';
        // what was saved is taken as computed
        this.rs.rules[id].markComputed();
        
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
        this.rs.notify('on_createRule', r) // workaround
        // when a saved system is being loaded, its inclusions come with it
        if (!this.rs.loading) this.rs.autoAddInclusion(r)
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

        this.rs.notify('on_createInclusion', inc, sub, over) // workaround
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
      this.loading = false
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
      inc.edgeId = id
      new RuleSystem.RuleInclusionObs(this, inc)
      return inc
    }

    // what the server says about the inclusions of graph a into graph b
    post (a, b) {
      const json = (g) => JSON.parse(g.toJSON((data) => { return data }, (data) => { return data }))
      return axios.post(SERVER_URL + '/Inclusion', [json(a), json(b)]).then((res) => res.data)
    }

    // Ask, all at once, everything the inclusions of a rule need: its lhs
    // against every lhs (both ways) and its rhs against itself. The requests
    // travel together instead of one after the other.
    async prefetch (id) {
      const jobs = {}
      for (const idr in this.rules) {
        jobs[id + ':' + idr] = this.post(this.rules[id].lhs, this.rules[idr].lhs)
        if (idr != id) jobs[idr + ':' + id] = this.post(this.rules[idr].lhs, this.rules[id].lhs)
      }
      jobs[id + ':rhs'] = this.post(this.rules[id].rhs, this.rules[id].rhs)
      const keys = Object.keys(jobs)
      const answers = await Promise.all(keys.map((k) => jobs[k]))
      const out = {}
      keys.forEach((k, i) => { out[k] = answers[i] })
      return out
    }

    async autoAddInclusion (rule) {
      var id
      this.memory=[]
      this.morphisms=[];
      for (const idr in this.rules) {
        if (this.rules[idr] == rule)id = idr
      }
      rule.markComputed()
      let answers
      try {
        answers = await this.prefetch(id)
      } catch (error) {
        console.error('Inclusion server unreachable or failed:', error)
        rule.computedSignature = null
        return
      }
      // the automorphisms of the rule first: the base of the other inclusions depends on them
      for (const idr of [id, ...Object.keys(this.rules).filter((k) => k != id)]) {
        await this.generateInclusion(id, idr, answers)
        if(idr!=id)await this.generateInclusion(idr, id, answers)
      }
    }
    async updateInclusion (id) {
      const rule = this.rules[id]
      // The rule is as it was when its inclusions were computed (opened and
      // closed without changes, or changed and changed back): keep them, and
      // what the user validated with them.
      if (rule.isUpToDate()) return true
      // Ask the server first: if it fails, nothing is deleted, so the inclusions
      // of the rule are not lost.
      rule.markComputed()
      let answers
      try {
        answers = await this.prefetch(id)
      } catch (error) {
        console.error('Inclusion server unreachable or failed, inclusions kept:', error)
        rule.computedSignature = null
        return false
      }
      for (const inc of Object.keys(this.inclusions)) {
        const i = this.inclusions[inc]
        if (i && (i.sub == rule || i.over == rule) && i.over != i.sub) {
          this.deleteInclusion(i)
        }
      }
      this.morphisms = []
      // the automorphisms of the rule first: the base of the other inclusions depends on them
      for (const idr of [id, ...Object.keys(this.rules).filter((k) => k != id)]) {
        await this.generateInclusion(id, idr, answers)
        if (idr != id) await this.generateInclusion(idr, id, answers)
      }
      return true
    }

    // Go through here so that the notification (and the cascade deletion) happens.
    // Before: deleting a rule deleted its inclusions without notifying about them.
    deleteRuleById (id) {
      this.notify('on_deleteRule', id)
      delete this.rules[id]
    }

    deleteInclusionById (id) {
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

    // the group of the automorphisms of the lhs of a rule, from its generators
    groupOf (id) {
      const rule = this.rules[id]
      return Base.closure(rule.base || [], Base.identityOf(rule.lhs))
    }

    // an inclusion the user has nothing to decide about is validated at once
    autoValidate (inc) {
      inc.validated = true
      this.notify('on_validateInclusion', inc.edgeId)
    }

    // A self-inclusion with nothing to choose is validated: the rhs has a single
    // automorphism, or the lhs automorphism is the identity, whose image can only
    // be the identity.
    autoValidateSelf (inc, rule) {
      if (rule.rgraphI === undefined || rule.rgraphI.length === 0) return
      const rhs = rule.rgraphI.length === 1
        ? rule.rgraphI[0]
        : (Base.isIdentity(inc.lgraphI) ? rule.rgraphI.find((g) => Base.isIdentity(g)) : undefined)
      if (rhs === undefined) return
      inc.rgraphI = rhs
      this.autoValidate(inc)
    }

    // An inclusion whose source has an empty rhs leaves nothing to bind: the lhs
    // binding given by the server is all there is (this is the case of an empty rule).
    autoValidateInter (inc) {
      const rhs = inc.sub.rhs
      if (Object.keys(rhs.nodes).length === 0 && Object.keys(rhs.edges).length === 0 && inc.isComplete()) {
        this.autoValidate(inc)
      }
    }

    // Inclusions saved before these rules existed get the same treatment.
    autoValidateAll () {
      for (const id of Object.keys(this.inclusions)) {
        const inc = this.inclusions[id]
        if (!inc || inc.validated) continue
        inc.edgeId = parseInt(id)
        if (inc.sub === inc.over) {
          inc.sub.generateGIncs()
          this.autoValidateSelf(inc, inc.sub)
        } else {
          this.autoValidateInter(inc)
        }
      }
    }

    // answers: what prefetch returned; anything missing is asked to the server
    async generateInclusion (n, m, answers) {
      const lhs1 = this.rules[n].lhs
      const lhs2 = this.rules[m].lhs
      if (n == m) {
        for (const inc of Object.keys(this.inclusions)) {
          if (this.inclusions[inc] && this.inclusions[inc].sub == this.rules[n] && this.inclusions[inc].over == this.rules[n]) {
            this.deleteInclusion(this.inclusions[inc])
          }
        }
      }
      let morphisms = null
      try {
        morphisms = (answers && answers[n + ':' + m]) || await this.post(lhs1, lhs2)
      } catch (error) {
        console.error('Inclusion server unreachable or failed:', error)
      }
      if (n == m) {
        // the rhs automorphisms are needed to complete the self-inclusions
        try {
          this.rules[n].rautoInclusions = (answers && answers[n + ':rhs']) || await this.post(this.rules[n].rhs, this.rules[n].rhs)
        } catch (error) {
          console.error(error)
        }
      }
      if (morphisms == null) return

      const rule = this.rules[n]
      if (n == m) {
        // only the generators of the automorphisms are shown, the others follow by composition
        rule.generateBase(morphisms)
        rule.generateGIncs()
        for (let i = 0; i < rule.lgraphI.length; i++) {
          const inc = this.createInclusion(n, m)
          inc.lgraphI = rule.lgraphI[i]
          this.autoValidateSelf(inc, rule)
        }
        return
      }

      // Between two rules, only a base of the inclusions is shown: the others are
      // an inclusion composed with automorphisms of the source and of the target.
      const autosSub = this.groupOf(n)
      const autosOver = this.groupOf(m)
      const orbit = (a) => {
        const keys = []
        for (const h of autosSub) {
          const ha = Base.then(h, a)
          for (const g of autosOver) keys.push(Base.key(Base.then(ha, g)))
        }
        return keys
      }
      const norm = (o) => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [parseInt(k), parseInt(v)]))
      const asMorphism = (g) => ({ nodeMap: norm(g.nodeMap), edgeMap: norm(g.edgeMap) })
      // what is already shown covers its whole orbit (also protects from two
      // computations overlapping when rules are created in quick succession)
      const covered = new Set()
      for (const i of Object.values(this.inclusions)) {
        if (i && i.sub == this.rules[n] && i.over == this.rules[m]) {
          for (const k of orbit(asMorphism(i.lgraphI))) covered.add(k)
        }
      }
      for (let i = 0; i < morphisms.length; i++) {
        const auto = asMorphism(morphisms[i])
        if (covered.has(Base.key(auto))) continue
        for (const k of orbit(auto)) covered.add(k)
        this.morphisms.push(morphisms[i])
        const inc = this.createInclusion(n, m)
        for (const node in auto.nodeMap) inc.lgraphI.setNode(parseInt(node), auto.nodeMap[node])
        for (const src in auto.edgeMap) inc.lgraphI.setEdge(parseInt(src), auto.edgeMap[src])
        this.autoValidateInter(inc)
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
