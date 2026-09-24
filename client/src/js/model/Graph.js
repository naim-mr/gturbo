const removeElement = (array, elem) => {
  var index = array.indexOf(elem)
  if (index > -1) {
    array.splice(index, 1)
  }
}

var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')

class GraphObserver extends Observer {
  constructor (g) {
    super(g)
  }

  on_addNode (id) {}
  on_loadNode (id,data) {}

  on_addEdge (id, src, dst) {}
  on_loadEdge (id,data) {}
  on_removeNode (id) {}

  on_removeEdge (id) {}

  on_updateNode (id, data) {}

  on_updateEdge (id, data) {}
}

class Graph extends Observable {
  constructor () {
    super()
    this.nodeCpt = 0
    this.edgeCpt = 0
    this.nodes = {}
    this.edges = {}
  }

  // pre-cond:
  //
  addNode () {
    const id = this.nodeCpt
    this.nodeCpt++
    this.nodes[id] = {
      incoming: [],
      outgoing: [],
      data: {}
    }

    this.notify('on_addNode', id)
    return id
  }

  // pre-cond:
  //   src, dst in this.nodes
  addEdge (src, dst) {
    const id = this.edgeCpt
    this.edgeCpt++
    this.edges[id] = {
      src: src,
      dst: dst,
      data: {}
    }
    this.nodes[src].outgoing.push(id)
    this.nodes[dst].incoming.push(id)
    this.notify('on_addEdge', id, src, dst)
    return id
  }

  // pre-cond:
  //   id in this.nodes
  removeNode (id) {
    // ids come as strings from the windows, numbers elsewhere
    id = parseInt(id)
    if (this.nodes[id] === undefined) return
    for (const eid of [].concat(this.nodes[id].outgoing)) {
      this.removeEdge(eid)
    }
    for (const eid of [].concat(this.nodes[id].incoming)) {
      this.removeEdge(eid)
    }
    this.notify('on_removeNode', id)
    delete this.nodes[id]
  }


  // pre-cond:
  //   id in this.edges
  removeEdge (id) {
    id = parseInt(id)
    // an edge that is already gone (or never was) is not an error
    if (this.edges[id] === undefined) return
    this.notify('on_removeEdge', id)
    removeElement(this.nodes[this.edges[id].src].outgoing, id)
    removeElement(this.nodes[this.edges[id].dst].incoming, id)
    delete this.edges[id]
  }

  // pre-cond:
  //   id in this.nodes
  updateNode (id, update) {
    this.nodes[id].data = update(this.nodes[id].data)
    this.notify('on_updateNode', id, this.nodes[id].data)
    /*
        updateNode(id, (data) => {
           return JSON.stringify({x:data['x'],y:data['y']})
        })
        (data) => {
           return JSON.stringify({src:data['src'],y:data['dst']})
        })
        */
  }

  // pre-cond:
  //   id in this.edges
  updateEdge (id, update) {
    this.edges[id].data = update(this.edges[id].data)
    this.notify('on_updateEdge', id, this.edges[id].data)
  }

  toJSON (toJSONNodeData, toJSONEdgeData) {
    return JSON.stringify({
      nodeCpt: this.nodeCpt,
      edgeCpt: this.edgeCpt,
      nodes: Object.keys(this.nodes).reduce((result, key) => {
        result[key] = {
          incoming: this.nodes[key].incoming,
          outgoing: this.nodes[key].outgoing,
          data: toJSONNodeData(this.nodes[key].data)
        }

        return result
      }, {}),
      edges: Object.keys(this.edges).reduce((result, key) => {
        result[key] = {
          src: this.edges[key].src,
          dst: this.edges[key].dst,
          data: toJSONEdgeData(this.edges[key].data)
        }
        return result
      }, {})
    })
  }

  static ofJSON (str, ofJSONNodeData, ofJSONEdgeData) {
    const o = JSON.parse(str)
  
    const g = new Graph( )
    g.nodeCpt = parseInt(o.nodeCpt)
    g.edgeCpt = parseInt(o.edgeCpt)
    
    
    g.nodes = Object.keys(o.nodes).reduce((result, key) => {
      result[parseInt(key)] =   {
        incoming: o.nodes[key].incoming.map((value,index,array)=>parseInt(value)),
        outgoing: o.nodes[key].outgoing.map((value,index,array)=>parseInt(value)),
        data: ofJSONNodeData(o.nodes[key].data)
      }
      
      return result
    }, {}),
    g.edges = Object.keys(o.edges).reduce((result, key) => {
      result[parseInt(key)] = {
        src: parseInt(o.edges[key].src),
        dst: parseInt(o.edges[key].dst),
        data: ofJSONEdgeData(o.edges[key].data,g.nodes[parseInt(o.edges[key].src)].data,g.nodes[parseInt(o.edges[key].dst)].data)
      }
      return result
    }, {})
    
    // The edges are the truth: rebuild what each node knows about them. Saved
    // data could hold ids of edges that no longer exist, which made the node
    // impossible to delete.
    for (const n of Object.keys(g.nodes)) {
      g.nodes[n].incoming = []
      g.nodes[n].outgoing = []
    }
    for (const e of Object.keys(g.edges).map((k) => parseInt(k)).sort((a, b) => a - b)) {
      const { src, dst } = g.edges[e]
      g.nodes[src].outgoing.push(e)
      g.nodes[dst].incoming.push(e)
    }
    return g
  }
  refresh(){
    
    for(let n in this.nodes){

        this.notify("on_addNode",parseInt(n));
        this.notify("on_loadNode",parseInt(n),this.nodes[n].data);
    }
    for(let e in this.edges){
      
      // the ids of the edges are numbers, like the ones addEdge gives
      this.notify("on_addEdge",parseInt(e), this.edges[e].src,this.edges[e].dst);
      this.notify("on_loadEdge",parseInt(e),this.edges[e].data);
    }
  }
}

module.exports = { Graph, GraphObserver }
