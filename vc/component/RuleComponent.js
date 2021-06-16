class RuleComponent {
    static RuleObs = class extends RuleObserver {
        constructor(rc, r) {
            super(r);
            this.rc = rc;
        }
    }
    constructor(lgc, rgc, rule) {
        this.ruleObserver = new RuleComponent.RuleObs(this, rule);
        this.rule = rule;
        this.cpt = 0;
        this.cur = 0;
        this.lgc = lgc;
        this.rgc = rgc;
        // this.nodeRgc={};
        //this.edgeRgc={}
    }
    update(n, rule, edgesInGraph, edgesInCy) {
        this.cur = n;
        this.updateRule(rule)
        this.lgc.updateEdgesMap(edgesInCy[n]['left'], edgesInGraph[n]['right']);
        this.rgc.updateEdgesMap(edgesInCy[n]['right'], edgesInGraph[n]['left']);
        this.refresh();
    }


    updateRule(rule) {
        this.lgc.updateGraph(rule.lhs);
        this.rgc.updateGraph(rule.rhs);
        this.rule.unregister(this.ruleObserver);
        this.rule = rule;
        this.ruleObserver = new RuleComponent.RuleObs(this, rule);
    }
    save() {
        let n = this.cur;
        this.lgc.save(n, "lhs");
        this.rgc.save(n, "rhs");
    }
    refresh() {
        this.lgc.refresh();
        this.rgc.refresh();
    }

    edgesInGraph() {
        return { left: this.lgc.edgesInGraph, right: this.rgc.edgesInGraph }
    }
    edgesInCy() {
        return { left: this.lgc.edgesInCy, right: this.rgc.edgesInCy }
    }
}