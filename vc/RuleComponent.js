class RuleComponent{
    static RuleObs= class extends RuleObserver{
        constructor(rc,r){
            super(r);
            this.rc=rc;
        }
    }
    constructor(lgc,rgc,rule){
        this.ruleObserver= new RuleComponent.RuleObs(this,rule);
        this.rule=rule;
        this.cpt=0;
        this.cur=0;
        this.lgc=lgc;
        this.rgc=rgc;
       // this.nodeRgc={};
       //this.edgeRgc={}
    }
    save(n){
        this.lgc.save(n,"lhs");
        this.rgc.save(n,"rhs");      
    }
    refresh(){
        this.lgc.refresh();
        this.rgc.refresh();     
    }
}


