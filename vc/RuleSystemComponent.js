class RuleSystemComponent {
    static RuleSystemObs= class extends RuleSystemObserver{
        constructor(rsc,rs){
            super(rs);
            this.rsc=rsc;
        }
      
        updateEdgesIds(sub,over){
            this.rsc.ric.lgcI.domComp.edgesInCy=this.rsc.edgesInCy[sub]['left'];
            this.rsc.ric.lgcI.codComp.edgesInCy=this.rsc.edgesInCy[over]['left'];
            this.rsc.ric.lgcI.domComp.edgesInGraph=this.rsc.edgesInGraph[sub]['left'];
            this.rsc.ric.lgcI.codComp.edgesInGraph=this.rsc.edgesInGraph[over]['left'];
            this.rsc.ric.rgcI.domComp.edgesInCy=this.rsc.edgesInCy[sub]['right'];
            this.rsc.ric.rgcI.codComp.edgesInCy=this.rsc.edgesInCy[over]['right'];
            this.rsc.ric.rgcI.domComp.edgesInGraph=this.rsc.edgesInGraph[sub]['right'];
            this.rsc.ric.rgcI.codComp.edgesInGraph=this.rsc.edgesInGraph[over]['right'];
        }
        on_createRule(rule){
            new GraphComponent.GraphObs(this.rsc.rc.lgc,rule.lhs);
            new GraphComponent.GraphObs(this.rsc.rc.rgc,rule.rhs);
            new RuleComponent.RuleObs(this.rsc.rc,rule);
            this.rsc.rc.rule=rule;
            this.rsc.setGraph(rule.lhs,rule.rhs); 
        }

        on_createInclusion(inc,sub,over){
            if(this.rsc.ric==undefined) {
                
                this.rsc.ric=new RuleInclusionComponent(inc);
                this.updateEdgesIds(sub-1,over-1);
                this.rsc.ric.cur=0;
                this.rsc.ric.cur=0;
            }
            else {
                this.rsc.ric.cpt++;
                this.rsc.ric.cur++;
                this.rsc.ric.inc=inc;
                this.rsc.ric.lgcI.graphI= inc.lgraphI;
                this.rsc.ric.rgcI.graphI= inc.rgraphI;
                new GraphInclusionComponent.GraphIObs(this.rsc.ric.lgcI,inc.lgraphI);
                new GraphInclusionComponent.GraphIObs(this.rsc.ric.rgcI,inc.rgraphI);
                this.updateEdgesIds(sub-1,over-1);
            }
        }
    }
    constructor(rs){
        this.rs=rs;
        let rule = this.rs.createRule();
        this.rc= new RuleComponent(new GraphComponent(rule.rhs,"lhs"),new GraphComponent(rule.lhs,"rhs"),rule);
        this.edgesInCy=[];
        this.edgesInGraph=[];
        this.rsObs=new RuleSystemComponent.RuleSystemObs(this,rs);
        

    }
    
    
   
    cancelRule(){
        this.rs.deleteRule(this.rc.rule);
      
        
    }
    pushEdgesIds(idrc,idrg,idlc,idlg){
        this.edgesInGraph.push({left:idlg,right:idrg});
        this.edgesInCy.push({left:idlc,right:idrc});
    }
    saveEdgesIds(n,idlc,idrc,idrg,idlg){
        n--;
        this.edgesInCy[n]['left']=idlc;
        this.edgesInCy[n]['right']=idrc;
        this.edgesInGraph[n]['right']=idrg;
        this.edgesInGraph[n]['left']=idlg;

    }
 
    freeIds(){
        this.rc.lgc.edgesInCy={};
        this.rc.rgc.edgesInCy={};
        this.rc.lgc.edgesInGraph={};
        this.rc.rgc.edgesInGraph={};
        
    }



    createRule() {       
        this.rc.cpt++;
        this.rc.cur=this.rc.cpt;
        let rule = this.rs.createRule();
        return this.rc.cpt;
    }
    getRule(n){
        return this.rs.rules[n];
    }
    save(n){
        this.rc.save(n);
        this.setCur(n);
    }
    setCur(n){
        this.cur=n;
    }
    setGraph(g1,g2){        
        this.rc.lgc.graph=g1;
        this.rc.rgc.graph=g2;
    }
    setRule(rule){
        this.rc.rule=rule;
    }
    removeEles(){
        this.rc.lgc.cy.remove(this.rc.lgc.cy.elements(''));
        this.rc.rgc.cy.remove(this.rc.rgc.cy.elements(''));
    }
   
    createInclusion(sub,over){
        this.rs.createInclusion(sub,over);    
        return this.ric.cpt; 
      }
    loadInclusion(n){
        if(this.rs.inclusions[n] != this.ric.inc){
          let inc = this.rs.inclusions[n];
          this.ric.update(inc);
  
        }
        this.ric.cur=n;
        this.ric.loadInclusion();
          
    }
  
    coloredInclusion(){
        this.ric.coloredInclusion();
    }
    removeElesI(){
        if(this.ric!=undefined){
            this.ric.lgcI.removeEles();
            this.ric.rgcI.removeEles();
        }
    }
   
    

}