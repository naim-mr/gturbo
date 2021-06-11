const removeElement = (array, elem) => {
    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
}



class GraphObserver extends Observer {

    constructor(g) {
        super(g);
    }
    getNode(id){
        return this.g.nodes[id];
    }
    getEdge(id){
        return this.g.edges[id];
    }

    on_addNode(id, px, py) {}

    on_addEdge(id, src, dst) {}

    on_removeNode(id) {}

    on_removeEdge(id) {}

    on_updateNode(id, x, y) {}

}

class Graph extends Observable {

    constructor() {
        super();
        this.nodeCpt = 0;
        this.edgeCpt = 0;
        this.nodes = {};
        this.edges = {};
    }
    //precond
    //
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
    // pre-cond:
    //    px, py: double
    
    addNode(px, py) {
        
        let id = this.nodeCpt;
        this.nodeCpt++;
        this.nodes[id] = {
            data:{},
            x: px,
            y: py,
            incoming: [],
            outgoing: [],
            visited:false
        };
        this.notify("on_addNode", id, px, py);
        return id;
    }

    // pre-cond:
    //   src, dst in this.nodes
    addEdge(src, dst) {
        let id = this.edgeCpt;
        this.edgeCpt++;
        this.edges[id] = {
            src: src,
            dst: dst,
        };
        this.nodes[src].outgoing.push(id);
        this.nodes[dst].incoming.push(id);
        console.log("on_addEdge "+ id+' ' +src +' ' +dst);
        this.notify("on_addEdge", id, src, dst);
        return id;
    }

    // pre-cond:
    //   id in this.nodes
    removeNode(id) {
        console.log("ici id: "+id);
        for (const eid of [].concat(this.nodes[id].outgoing)) {
            this.removeEdge(eid);
        }
        for (const eid of [].concat(    
            this.nodes[id].incoming)) {
            this.removeEdge(eid);
        }
        this.notify("on_removeNode", id);
        delete this.nodes[id];
    }

    // pre-cond:
    //   id in this.edges
    removeEdge(id) {
        console.log("on remove edge "+id);
        this.notify("on_removeEdge", id);
        removeElement(this.nodes[this.edges[id].src].outgoing, id);
        removeElement(this.nodes[this.edges[id].dst].incoming, id);
        delete this.edges[id];
    }

    // pre-cond:
    //   id in this.nodes
    updateNode(id, x, y) {
        this.nodes[id].x = x;
        this.nodes[id].y = y;
        this.notify("on_updateNode", id, x, y);
    }

}


