class GraphInclusionComponent{
    static GraphIObs= class extends GraphInclusionObserver{
        constructor(gic,graphI){
            super(graphI);
            this.gic=gic;
            
        }

        on_setNode(idx, idy) {}

        on_setEdge(idx, idy) {}

        on_unsetNode(idx) {}

        on_unsetEdge(idx) {}

    }
    
    
    constructor(graphI,idComp){
        this.graphI=graphI;
        new GraphInclusionComponent(this,graphI);
        this.domComp=new GraphComponent(graphI.dom,idComp[0]);
        this.codComp=  new GraphComponent(graphI.cod,idComp[1])
        
        
    }
}