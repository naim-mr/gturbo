class RuleInclusionComponent {
    static IncObs = class extends RuleInclusionObserver {
        constructor(ric, inc) {
                super(inc);
                this.ric = ric;
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

    constructor(inc) {
        this.lgcI = new GraphInclusionComponent(inc.lgraphI, ["lhs2", "lhs1"]);
        this.rgcI = new GraphInclusionComponent(inc.rgraphI, ["rhs2", "rhs1"]);
        this.inc = inc;
        this.incObs = new RuleInclusionComponent.IncObs(this, inc);
        this.cur = 0;
        this.cpt = 0;
    }


    updateEdgesMap(sub, over, edgesInCy, edgesInGraph) {
        this.lgcI.updateEdgesMap(edgesInCy[over]['left'], edgesInGraph[over]['left'], true);
        this.lgcI.updateEdgesMap(edgesInCy[sub]['left'], edgesInGraph[sub]['left'], false);
        this.rgcI.updateEdgesMap(edgesInCy[over]['left'], edgesInGraph[over]['left'], true);
        this.rgcI.updateEdgesMap(edgesInCy[sub]['left'], edgesInGraph[sub]['left'], false);

    }
    update(inc) {
        this.rsc.ric.cpt++;
        this.rsc.ric.cur = this.cpt;
        this.ric.inc.unregister(this.ric.incObs);
        this.inc = inc;
        this.lgcI.update(inc.lgraphI);
        this.rgcI.update(inc.rgraphI);
        this.incObs = new RuleInclusionComponent.IncObs(this, inc);
    }

    coloredInclusion() {
        this.lgcI.coloredInclusion();
        this.rgcI.coloredInclusion();
    }
    loadInclusion() {
        this.lgcI.loadInclusion();
        this.rgcI.loadInclusion();
    }
}