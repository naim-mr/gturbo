class RuleObserver extends Observer {

    constructor(r) {
        super(r);
    }
    

}

class Rule extends Observable {
    //checker si c'est nécessaire 
    static Lhs = class extends GraphObserver {
        constructor(rule, g) {
            super(g);

            this.rule = rule;
        }
      /*  on_addNode(id) {
            let idr= this.rule.rhs.addNode();
            let dataL= this.rule.lhs.nodes[id].data["x"];
            console.log("ajout droite");
            console.log(dataL); 
            this.rule.rhs.updateNode(idr, (data)=> {data=dataL;return data;} )     ;    
            this.rule.nodeRgc[id]=idr;
        }
        on_addEdge(ide,src,dest){
            let idr=this.rule.rhs.addEdge(this.rule.nodeRgc[src],this.rule.nodeRgc[dest]);
            this.rule.edgeRgc[ide]=idr;
        }
        on_removeEdge(id){
            this.rule.rhs.removeEdge(this.rule.edgeRgc[id]);
        }
        on_removeNode(id){
            this.rule.rhs.removeNode(this.rule.nodeRgc[id]);
        }
       
    */
    }

    static Rhs = class extends GraphObserver {
        constructor(rule, g) {
            super(g);
            this.rule = rule;
        }

    }

    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.lhsObserver=new Rule.Lhs(this, lhs);
        this.rhsObserver=new Rule.Rhs(this, rhs);
        this.nodeRgc={};
        this.edgeRgc={};
    }
    
    toJSON() {
        return JSON.stringify({
            lhs: JSON.parse(this.lhs.toJSON()),
            rhs: JSON.parse(this.rhs.toJSON()),
        })
    }

}

