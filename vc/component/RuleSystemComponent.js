


class RuleSystemComponent {
    static RuleSystemObs = class extends RuleSystemObserver {
        constructor(rsc, rs) {
            super(rs);
            this.rsc = rsc;
        }


        on_createRule(rule) {
            this.rsc.rc.updateRule(rule);

        }

        on_createInclusion(inc, sub, over) {
            if (this.rsc.ric == undefined) {
                this.rsc.ric = new RuleInclusionComponent(inc);
                this.rsc.ric.updateEdgesMap(sub , over , this.rsc.edgesInCy, this.rsc.edgesInGraph);
            } else {
                this.rsc.ric.update(inc);
                this.updateEdgesMap(sub   , over , this.rsc.edgesInCy, this.rsc.edgesInGraph);
            }
        }
    }
   
    constructor(rs) {
        this.rs = rs;
        let rule = this.rs.createRule();
        this.rc = new RuleComponent(new GraphComponent(rule.lhs, "lhs"), new GraphComponent(rule.rhs, "rhs"), rule);
        this.edgesInCy = [];
        this.edgesInGraph = [];
        new RuleSystemComponent.RuleSystemObs(this, rs);
       
    }
    
    
    pushEdgesIds() {
        this.edgesInGraph.push(this.rc.edgesInGraph());
        this.edgesInCy.push(this.rc.edgesInCy());
    }
    saveEdgesIds() {
        let n = this.rc.cur;
        this.edgesInCy[n] = this.rc.edgesInCy();
        this.edgesInGraph[n] = this.rc.edgesInGraph();
    }
    
    
    switch (n) {
        this.removeEles();
        let rule = this.getRule(n);
        this.rc.update(n , rule, this.edgesInCy, this.edgesInGraph)
    }

    createRule()  {
    
        let rule;
        if(this.rc.cpt==0)rule= this.rc.rule;
        else rule = this.rs.createRule();
        this.rc.cur=this.rc.cpt;
        this.rc.cpt++;
    }
    getRule(n) {
        return this.rs.rules[n];
    }
    getCurrentRule(){
        return this.rc.cur;
    }
    cancelRule() {
        this.rs.deleteRule(this.rc.rule);
    }
    saveRule(onCreate) {
        if (onCreate) {
            this.rc.save();
            this.pushEdgesIds();
        } else {
            this.saveEdgesIds();
            this.rc.save();


        }
    }
    
    removeEles() {
        this.rc.lgc.cy.remove(this.rc.lgc.cy.elements(''));
        this.rc.rgc.cy.remove(this.rc.rgc.cy.elements(''));
    }



    createInclusion(sub, over) {
        this.rs.createInclusion(sub, over);
        return this.ric.cpt;
    }

    loadInclusion(n) {
        if (this.rs.inclusions[n] != this.ric.inc) {
            let inc = this.rs.inclusions[n];
            this.ric.update(inc);
        }
        this.ric.cur = n;
        this.ric.loadInclusion();
    }

    coloredInclusion() {
        this.ric.coloredInclusion();
    }

    removeElesI() {
        if (this.ric != undefined) {
            this.ric.lgcI.removeEles();
            this.ric.rgcI.removeEles();
        }
    }



}