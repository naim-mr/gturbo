

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
            new RuleSystem.RuleObs(this.rs, r)
            this.rs.graph.updateNode(id, (data) => {
                data["rule"] = r;
                return data;
            })
            this.rs.rules[id] = r;
        }
        on_addEdge(sub,over){
            let sub = this.rules[sub];
            let over= this.rules[over];
            let inc= new RuleInclusion(sub,over);
            new RuleSystem.RuleInclusionObs(this,inc)
            this.rs.graph.updateEdge(id,(data)=> {
                data["inc"]=inc;
            })
            this.rs.inclusions[id]=inc;
        }
        on_removeNode(id) {
            this.rs.rules[id].unregister(this);
            delete this.rs.rules[id];
            this.rs.graph.updateNode(id, (data) => {
                delete data["rule"];
                return data;
            });
        }
        on_removeEdge(id){
            this.rs.inclusions[id].unregister(this);
            delete this.rs.inclusion[id];
            this.rs.graph.updateEdge(id,(data)=>{
                delete data["inc"];
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
    deleteF(x,fn){
        
    }
    deleteRule(r) {
        Object.keys(this.rules).reduce(function(result, id) {
            if (this.rules[id] == r) {
                this.graph.removeNode(id)
            }
            return null
        }, null);
    }
    createInclusion(sub,over){  
        let id= this.graph.addEdge(sub,over);
        return this.graph.edges[id].data["rinc"];

    }
    deleteInclusion(i){
        Object.keys(this.inclusions).reduce(function(result, id) {
            if (this.inclusion[id] == i) {
                this.graph.removeEdge(id)
            }
            return null
        }, null);

    }
}