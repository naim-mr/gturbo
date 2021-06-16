class RuleSystemComponent {
    static RuleSystemObs= class extends RuleSystemObserver{
        constructor(rsc,rs){
            super(rs);
            this.rsc=rsc;
        }
      
    
        on_createRule(rule){
            this.rsc.rc.updateComponents(rule);
           
        }

        on_createInclusion(inc,sub,over){
            if(this.rsc.ric==undefined) {
                this.rsc.ric=new RuleInclusionComponent(inc);
                this.rsc.ric.updateEdgesMap(sub-1,over-1,this.rsc.edgesInCy,this.rsc.edgesInGraph);
            }
            else {
                this.rsc.ric.update(inc);
                this.updateEdgesMap(sub-1,over-1,this.rsc.edgesInCy,this.rsc.edgesInGraph);
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
    pushEdgesIds(){
        this.edgesInGraph.push(this.rc.edgesInGraph());
        this.edgesInCy.push(this.rc.edgesInCy());
    }
    saveEdgesIds(){
        let n=this.rc.cur-1;
        this.edgesInCy[n]=this.rc.edgesInCy();
        this.edgesInGraph[n]=this.rc.edgesInGraph();
    }
    switch(n){
        this.removeEles();
        let rule= this.getRule(n);
        this.rc.update(n-1,rule,this.edgesInCy,this.edgesInGraph)
    }

    createRule() {       
        let rule = this.rs.createRule();
        this.rc.save();
    }
    getRule(n){
        return this.rs.rules[n];
    }
    save( onCreate){
        if(onCreate){
            this.saveRule();
            this.pushEdgesIds();
            this.removeEles();
        }else{
            this.vue.rsc.saveEdgesIds();
            this.vue.rsc.saveRule();

        }
    }
    saveRule(){
        this.rc.save(); 
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