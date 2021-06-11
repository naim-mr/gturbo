

class RuleSystem {
    static RuleObs= class extends RuleObserver{
        constructor(rs,r){
            
            super(r);
            this.rs=rs;
        }
    }
    constructor(){
        this.rulelist= [];
        this.inclusionlist=[];
        this.ruleCpt=0;
        this.ruleCur=0;
        this.ruleTemp;
        this.idInGraph=[];
        this.idInCy=[];
    }
    createRule(){
        let g1= new Graph();
        let g2 = new Graph();
    

    }
    pushRule(r){
        new RuleSystem.RuleObs(this,r);
        this.rulelist.push(r);
    }
    
    
}