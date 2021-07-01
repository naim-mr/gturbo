
var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var {GraphInclusion,GraphInclusionObserver}  = require('./GraphInclusion.js')
var {Rule,RuleObserver}  = require('./Rule.js')

class RuleInclusionObserver extends Observer {

    constructor(rinc) {
            super(rinc);
        }
        //Sinon rajouter un paramètre définissant gauche ou droite
    on_setNodeL(idx, idy) {}

    on_setEdgeL(idx, idy) {}

    on_unsetNodeL(idx, idy) {}

    on_unsetEdgeL(idx, idy) {}

    on_setNodeR(idx, idy) {}

    on_setEdgeR(idx, idy) {}

    on_unsetNodeR(idx, idy) {}

    on_unsetEdgeR(idx, idy) {}

}

class RuleInclusion extends Observable {
    static LGraphIObs = class extends GraphInclusionObserver {
        constructor(rinc, lgraphI) {
            super(lgraphI);
            this.rinc = rinc;

        }
        on_setNode(idx, idy) {
            this.rinc.notify("on_setNodeL", idx, idy);
        }

        on_setEdge(idx, idy) {
            this.rinc.notify("on_setEdgeL", idx, idy);
        }

        on_unsetNode(idx, idy) {
            this.rinc.notify("on_setNodeL", idx, idy);
        }

        on_unsetEdge(idx, idy) {
            this.rinc.notify("on_setEdgeL", idx, idy);
        }
    }
    static RGraphIObs = class extends GraphInclusionObserver {
        constructor(rinc, rgraphI) {
            super(rgraphI);
            this.rinc = rinc;

        }
        on_setNode(idx, idy) {
            this.rinc.notify("on_setNodeR", idx, idy);
        }

        on_setEdge(idx, idy) {
            this.rinc.notify("on_setEdgeR", idx, idy);
        }

        on_unsetNode(idx,idy) {
            //revenir ici attention 
           // this.rinc.notify("on_undesetNodeR", idx,idy);
        }

        on_unsetEdge(idx,idy) {
            //this.rinc.notify("on_undesetEdgeR", idx,idy);
        }
    }
    static Sub = class extends RuleObserver {
        constructor(rinc, r) {
            super(r);
            this.rinc = rinc;

        }
       
    }

    static Over = class extends RuleObserver {
            constructor(rinc, r) {
                super(r);
                this.rinc = rinc;
            }
            
        }
        // eleOver dictionary { idSub : idOver}
    constructor(sub, over) {
        super();
        this.sub = sub;
        this.over = over;
        this.lgraphI = new GraphInclusion(sub.lhs, over.lhs)
        this.rgraphI = new GraphInclusion(sub.rhs, over.rhs);
        new RuleInclusion.Sub(this, sub);
        new RuleInclusion.Over(this, over);
        new RuleInclusion.LGraphIObs(this, this.lgraphI);
        new RuleInclusion.RGraphIObs(this, this.rgraphI);
    }

    toJSON(){
        return {
    
        }
    }
}

module.exports={ RuleInclusion,RuleInclusionObserver}