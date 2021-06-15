class RuleInclusionComponent {
    static IncObs= class extends RuleInclusionObserver{
        constructor(ric,inc){
            super(inc);
            this.ric=ric;
        }
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


    updateEdgesIds(sub,over){
        this.lgcI.domComp.edgesInCy=this.rsc.edgesInCy[sub]['left'];
        this.lgcI.codComp.edgesInCy=this.rsc.edgesInCy[over]['left'];
        this.lgcI.domComp.edgesInGraph=this.rsc.edgesInGraph[sub]['left'];
        this.lgcI.codComp.edgesInGraph=this.rsc.edgesInGraph[over]['left'];
        this.rgcI.domComp.edgesInCy=this.rsc.edgesInCy[sub]['right'];
        this.rgcI.codComp.edgesInCy=this.rsc.edgesInCy[over]['right'];
        this.rgcI.domComp.edgesInGraph=this.rsc.edgesInGraph[sub]['right'];
        this.rgcI.codComp.edgesInGraph=this.rsc.edgesInGraph[over]['right'];
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