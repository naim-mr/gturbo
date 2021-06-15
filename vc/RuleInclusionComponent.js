class RuleInclusionComponent {
    static IncObs= class extends RuleInclusionObserver{
        constructor(ric,inc){
            super(inc);
            this.ric=ric;
        }
         //Sinon rajouter un paramètre définissant gauche ou droite
        on_setNodeL(idx, idy) {}

        on_setEdgeL(idx, idy) {}

        on_unsetNodeL(idx,idy) {}

        on_unsetEdgeL(idx,idy) {}

        on_setNodeR(idx, idy) {}

        on_setEdgeR(idx, idy) {}

        on_unsetNodeR(idx,idy) {}

        on_unsetEdgeR(idx,idy) {}
    }
    
    constructor(inc){
        this.lgcI=new GraphInclusionComponent(inc.lgraphI,["lhs2","lhs1"]) ;
        this.rgcI=new GraphInclusionComponent(inc.rgraphI,["rhs2","rhs1"]) ;
        this.inc=inc;
        this.incObs= new RuleInclusionComponent.IncObs(this,inc);
        this.cur=0;
        this.cpt=0;
    }



    update(inc){
        this.inc=inc;
        this.lgcI.graphI=inc.lgraphI;
        this.lgcI.domComp.graph=inc.lgraphI.dom;
        this.lgcI.codComp.graph=inc.lgraphI.cod;
        new GraphInclusionComponent.GraphIObs(this.lgcI,inc.lgraphI);
        this.rgcI.domComp.graph=inc.rgraphI.dom;
        this.rgcI.codComp.graph=inc.rgraphI.cod;
        this.rgcI.graphI=inc.rgraphI;
        new GraphInclusionComponent.GraphIObs(this.rgcI,inc.rgraphI);
         //this.ric.incObs.inc.unregister(this.ric.incObs);
        new RuleInclusionComponent.IncObs(this,inc);
    }

    coloredInclusion(){
        this.lgcI.coloredInclusion();
        this.rgcI.coloredInclusion();
    }
    loadInclusion(){
        this.lgcI.loadInclusion();
        this.rgcI.loadInclusion();
    }
}