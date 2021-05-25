const HS = {
    RHS: 'rhs',
    LHS: 'lhs'
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