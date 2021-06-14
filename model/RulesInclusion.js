
class RuleInclusionObserver extends Observer {

    constructor(rinc) {
        super(rinc);
    }

    on_setNodeL(idx, idy) {}

    on_setEdgeL(idx, idy) {}

    on_unsetNodeL(idx) {}

    on_unsetEdgeL(idx) {}

    on_setNodeR(idx, idy) {}

    on_setEdgeR(idx, idy) {}

    on_unsetNodeR(idx) {}

    on_unsetEdgeR(idx) {}
  
}

class RuleInclusion extends Observable {
    static LGraphIObs= class extends GraphInclusionObserver{
        constructor(rinc,lgraphI){
            super(lgraphI);
            this.rinc=rinc;
            
        }
        on_setNode(idx, idy) {
            this.rinc.notify("on_setNodeL",idx,idy);
        }

        on_setEdge(idx, idy) {
            this.rinc.notify("on_setEdgeL",idx,idy);
        }
    
        on_unsetNode(idx) {
            this.rinc.notify("on_setNodeL",idx,idy);
        }
    
        on_unsetEdge(idx) {
            this.rinc.notify("on_setEdgeL",idx,idy);
        }
    }
    static RGraphIObs= class extends GraphInclusionObserver{
        constructor(rinc,rgraphI){
            super(rgraphI);
            this.rinc=rinc;
            
        }
        on_setNode(idx, idy) {
            this.rinc.notify("on_setNodeR",idx,idy);
        }

        on_setEdge(idx, idy) {
            this.rinc.notify("on_setEdgeR",idx,idy);
        }
    
        on_unsetNode(idx) {
            this.rinc.notify("on_undesetNodeR",idx,idy);
        }
    
        on_unsetEdge(idx) {
            this.rinc.notify("on_undesetEdgeR",idx,idy);
        }
    }
    static Sub = class extends RuleObserver {
        constructor(rinc, r) {
            super(r);
            this.rinc = rinc;
           
        }
    }

    static Over = class extends RuleObserver {
        constructor(rinc,r) {
            super(r);
            this.rinc = rinc;
        }
    }
    // eleOver dictionary { idSub : idOver}
    constructor(sub, over,lgraphI,rgraphI) {
        super();
        this.sub = sub;
        this.over = over;
        this.lgraphI=lgraphI;
        this.rgraphI=rgraphI;
        new RuleInclusion.Sub(this, sub);
        new RuleInclusion.Over(this, over);
        new RuleInclusion.LGraphIObs(this,this.lgraphI);
        new RuleInclusion.RGraphIObs(this,this.rgraphI);
    }
    

}   