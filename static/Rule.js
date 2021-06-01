const HS = {
    RHS: 'rhs',
    LHS: 'lhs'
}
class RuleList {
    constructor() {
        this.list = [new Rule()];
        this.counter = 0;
        this.current = 0;
    }
    push(rule) {
        this.list.push(rule);
        this.counter++;
    }
    getRule(n) {
        return this.list[n];
    }
    length() {
        return this.list.length;
    }
    getCurrent() {
        return this.list[this.current];
    }
    setCurrent(n) {
        this.current = n;
    }
}
class Rule {
    constructor() {
        this.rhs = new Handside(HS.RHS);
        this.lhs = new Handside(HS.LHS);

    }
    updateNodes(nlhs, nrhs) {
        this.lhs.nodes = nlhs;
        this.rhs.nodes = nrhs;
    }
    updateEdges(edlhs, edrhs) {
        this.lhs.edges = edlhs;
        this.rhs.edges = edrhs;
    }

}

class Handside {
    constructor(hs) {
        this.nodes = null;
        this.edges = null;
        this.hs = hs;
    }
    getEdges() {
        return this.edges;
    }
    getNodes() {
        return this.nodes;
    }
}