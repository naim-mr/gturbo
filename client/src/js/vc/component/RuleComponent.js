
var {Rule,RuleObserver}  = require('../../model/Rule.js')
var {GraphComponentObserver} = require('./GraphComponent');


class RuleComponent {
    static RuleObs = class extends RuleObserver {
        constructor(rc, r) {
            super(r);
            this.rc = rc;
        }
       
    }
    static GraphComponentObs= class extends GraphComponentObserver{
        constructor(rc , g){
            super(g);
            this.rc=rc;
        }
        on_update(){
            this.rc.save();
        }
    }

    constructor(lgc, rgc, rule) {
        this.ruleObserver = new RuleComponent.RuleObs(this, rule);
        this.rule = rule;
        this.cpt = 0;
        this.cur = 0;
        this.lgc = lgc;
        this.rgc = rgc;
        
        new RuleComponent.GraphComponentObs(this,lgc);
        new RuleComponent.GraphComponentObs(this,rgc);
        
    }
    deleteRule(){
        
       this.rule={};
       this.cur=0;
       
    }
    update(n, rule, edgesInGraph, edgesInCy) {
        this.cur = n;
        this.updateRule(rule)
        this.lgc.updateEdgesMap(edgesInCy[n]['left'], edgesInGraph[n]['left']);
        this.rgc.updateEdgesMap(edgesInCy[n]['right'], edgesInGraph[n]['right']);
        this.refresh();
    }


    updateRule(rule) {
       
        this.lgc.updateGraph(rule.lhs);
        this.rgc.updateGraph(rule.rhs);
        if(this.rule.length>0)   this.rule.unregister(this.ruleObserver);
        this.rule = rule;
        this.ruleObserver = new RuleComponent.RuleObs(this, rule);
    }
    save() {
        
        
        this.lgc.save(this.cur, "lhs");
        this.rgc.save(this.cur, "rhs");
    }
    refresh() {

        this.lgc.refresh();
        this.rgc.refresh();
    }
    deleteEdges(){
        this.lgc.deleteEdges();
        this.rgc.deleteEdges();
    }
    edgesInGraph() {
        return { left: this.lgc.edgesInGraph, right: this.rgc.edgesInGraph }
    }
    edgesInCy() {
        return { left: this.lgc.edgesInCy, right: this.rgc.edgesInCy }
    }
}

module.exports= {RuleComponent};
