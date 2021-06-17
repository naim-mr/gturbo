class GraphInclusionObserver extends Observer {

    constructor(g) {
        super(g);
    }

    on_setNode(idx, idy) {}

    on_setEdge(idx, idy) {}

    on_unsetNode(idx, idy) {}

    on_unsetEdge(idx, idy) {}

}

class GraphInclusion extends Observable {

    static Dom = class extends GraphObserver {
        constructor(ginc, g) {
            super(g);
            this.ginc = ginc;
        }
        on_removeNode(id) {
            this.ginc.unsetNode(id);
        }
        on_removeEdge(id) {
            this.ginc.unsetEdge(id);
        }
    }

    static Cod = class extends GraphObserver {
        constructor(ginc, g) {
            super(g);
            this.ginc = ginc;
        }
        on_removeNode(id) {
            if (id in this.ginc.nodeInvMap) {
                this.ginc.unsetNode(this.ginc.nodeInvMap[id]);
            }
        }
        on_removeEdge(id) {
            if (id in this.g.edgeInvMap) {
                this.ginc.unsetEdge(this.g.edgeInvMap[id]);
            }
        }
    }

    constructor(dom, cod) {
        super();
        this.dom = dom;
        this.cod = cod;
        new GraphInclusion.Dom(this, dom);
        new GraphInclusion.Cod(this, cod);
        this.nodeMap = {};
        this.nodeInvMap = {};
        this.edgeMap = {};
        this.edgeInvMap = {};
    }

    setNode(idx, idy) {
       if(this.nodeMap[idx]!=idy){
            this.unsetNode(idx);
            if (idy in this.nodeInvMap) {
                this.unsetNode(this.nodeInvMap[idy]);
            }
            this.nodeMap[idx] = idy;
            this.nodeInvMap[idy] = idx;
            this.notify("on_setNode", idx, idy);
        }
    }

    setEdge(idx, idy) {
        this.unsetEdge(idx);
        if (idy in this.edgeInvMap) {
            this.unsetEdge(this.edgeInvMap[idy]);
        }
        let nidx = this.dom.edges[idx].src;
        let nidy = this.cod.edges[idy].src;
        if (this.nodeMap[nidx] != nidy) {
            this.setNode(this.dom.edges[idx].src, this.cod.edges[idy].src);

        }
        nidx = this.dom.edges[idx].dst;
        nidy = this.cod.edges[idy].dst;
        if (this.nodeMap[nidx] != nidy) {
            this.setNode(this.dom.edges[idx].dst, this.cod.edges[idy].dst);

        }
        this.edgeMap[idx] = idy;
        this.edgeInvMap[idy] = idx;
        this.notify("on_setEdge", idx, idy);
    }

    unsetNode(idx) {
        if (idx in this.nodeMap) {
            for (const ide of this.dom.nodes[idx].outgoing) {
                this.unsetEdge(ide);
            }
            for (const ide of this.dom.nodes[idx].incoming) {
                this.unsetEdge(ide);
            }
            let idy = this.nodeMap[idx];
            this.notify("on_unsetNode", idx, idy);
            delete this.nodeMap[idx];
            delete this.nodeInvMap[idy];
        }
    }

    unsetEdge(idx) {
        if (idx in this.edgeMap) {
            let idy = this.edgeMap[idx];
            this.notify("on_unsetEdge", idx, idy);
            delete this.edgeMap[idx];
            delete this.edgeInvMap[idy];
        }
    }

    toJSON() {
        return JSON.stringify({
            nodeMap: this.nodeMap,
            edgeMap: this.edgeMap,
        })
    }

    static ofJSON(dom, cod, str) {
        let o = JSON.parse(str);
        let i = new GraphInclusion(dom, cod);
        i.nodeMap = o.nodeMap;
        i.edgeMap = o.edgeMap;
        i.nodeInvMap = Object.keys(i.nodeMap).reduce((result, key) => {
            result[i.nodeMap[key]] = key
            return result
        }, {});
        i.edgeInvMap = Object.keys(i.edgeMap).reduce((result, key) => {
            result[i.edgeMap[key]] = key
            return result
        }, {});
        return i;
    }

}