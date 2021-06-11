

class RuleSystem {
    static GraphObs= class extends GraphObserver{
        constructor(rs,g) {
            super(g)
            this.rs = rs
        }
        on_addNode(id) {
            let lhs = new Graph()
            let rhs = new Graph()
            let r = new Rule(lhs, rhs)
            new RuleObs(this.rs, r)
            this.rs.graph.updateNode(id, (data) => {
                data["rule"] = r;
                return data;
            })
            this.rs.rules[id] = r;
        }
        on_removeNode(id) {
            delete this.rs.rules[id];
            this.rs.graph.updateNode(id, (data) => {
                delete data["rule"]
                return data;
            })
        }
    }

    static RuleObs= class extends RuleObserver{
        constructor(rs,r){
            super(r);
            this.rs=rs;
        }
    }

    static RuleInclusionObs= class extends RuleInclusionObserver{
        constructor(rs,i){
            super(i);
            this.rs=rs;
        }
    }

    constructor() {
        this.graph = new Graph()
        this.rules = {}
        this.inclusions = {}
    }

    createRule() {
        let id = this.graph.addNode()
        return this.graph.nodes[id].data["rules"];
    }

    deleteRule(r) {
        Object.keys(this.rules).reduce(function(result, id) {
            if (this.rules[id] == r) {
                this.graph.removeNode(id)
            }
            return null
        }, null);
    }

}