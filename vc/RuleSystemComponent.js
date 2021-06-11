class RuleSystemComponent{
    
    constructor(rs,rc){
       
        this.rs=rs;
        this.rc=rc;

    }

    pushRule(rule){
        this.rs.rulelist.push(rule);
        this.rs.ruleCpt++;
    }
    pushIds(idrc,idrg,idlc,idlg){
        this.rs.idInGraph.push({left:idlg,right:idrg});
        this.rs.idInCy.push({left:idlc,right:idrc});
    }
    saveIds(n,idlc,idrc,idrg,idlg){
        this.rs.idInCy[n]['left']=idlc;
        this.rs.idInCy[n]['right']=idrc;
        this.rs.idInGraph[n]['right']=idrg;
        this.rs.idInGraph[n]['left']=idlg;

    }
 
    freeIds(){
        this.rc.lgc.idInCy={};
        this.rc.rgc.idInCy={};
        this.rc.lgc.idInGraph={};
        this.rc.rgc.idInGraph={};
        
    }
    save(n){
        this.rc.save(n);
        this.setCur(n);
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
    setCur(n){
        this.rs.ruleCur=n;
    }
    getRule(n){
       
        if(n<this.rs.rulelist.length)return this.rs.rulelist[n];
        else throw "Error : ";
    }
    cpt(){
        return this.rs.ruleCpt;
    }

}