const removeElement = (array, elem) => {
  var index = array.indexOf(elem)
  console.log(index)
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

  on_addEdge (id, src, dst) {}

  on_removeNode (id) {}

  on_removeEdge (id) {}

  on_updateNode (id, data) {}

  on_updateEdge (id, data) {}
}

class LogGraphObserver extends GraphObserver {
  constructor (g) {
    super(g)
  }

  on_addNode (id) { console.log('') }

  on_addEdge (id, src, dst) { console.log('') }

  on_removeNode (id) { console.log('') }

  on_removeEdge (id) { console.log('') }

  on_updateNode (id, data) { console.log('') }

  on_updateEdge (id, data) { console.log('') }
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
    this.notify('on_removeEdge', id)

    removeElement(this.nodes[this.edges[id].src].outgoing, id)
    removeElement(this.nodes[this.edges[id].dst].incoming, id)
    console.log('dans remove edge' + id)
    console.log(this.nodes[this.edges[id].src])
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
    const g = new Graph()
    g.nodeCpt = o.nodeCpt
    g.edgeCpt = o.edgeCpt
    g.nodes = Object.keys(o.nodes).reduce((result, key) => {
      result[key] = {
        incoming: o.nodes[key].incoming,
        outgoing: o.nodes[key].outgoing,
        data: ofJSONNodeData(o.nodes[key].data)
      }
      return result
    }, {}),
    g.edges = Object.keys(o.edges).reduce((result, key) => {
      result[key] = {
        src: o.edges[key].src,
        dst: o.edges[key].dst,
        data: ofJSONEdgeData(o.edges[key].data)
      }
      return result
    }, {})
    return g
  }
}

module.exports = { Graph, GraphObserver }

/*     //precond
    //*
    resetVisited(){
        for(let i=0;i<this.nodes.length;i++){
            this.nodes[i].visited=false;

        }
        for(let i=0;i<this.edges.length;i++){
            this.edges[i].visited=false;
        }
    }
    //precond
    //
    pasteNode(id,px,py,translation){
        let cid;
        if(!this.nodes[id].visited){
            cid = this.addNode(px+translation['x'],py+translation['y']);
            this.nodes[id].visited=true;
            this.nodes[cid].visited=true;
        }
        for (const eid of [].concat(this.nodes[id].outgoing)) {
            this.copyEdge(eid,translation,'out',cid);
        }
        for(const eid of [].concat(this.nodes[id].incoming)){
           this.copyEdge(eid,translation,'in',cid);
        }

    }
    // precond
    //
    pasteEdge(eid,translation,sod,cid){

        if(!this.edges[eid].visited){
            let src= this.edges[eid].src;
            let dest= this.edges[eid].dst;
            if(sod==="out" && cid!= undefined) src= cid;
            else if(sod==="in" && cid!= undefined)dest= cid;
            let newSrc= src;
            let newDest=dest;
            if(!this.nodes[src].visited){
                newSrc = this.addNode(this.nodes[src].x+translation['x'],this.nodes[src].y+translation['y']);
                this.nodes[src].visited=true;
                this.nodes[newSrc].visited=true;
            }
            if(!this.nodes[dest].visited){
                newDest = this.addNode(this.nodes[dest].x+translation['x'],this.nodes[dest].y+translation['y']);
                this.nodes[dest].visited=true;
                this.nodes[newDest].visited=true;
            }
            this.addEdge(newSrc,newDest);
            this.edges[eid].visited=true;
        }
    }
 */
