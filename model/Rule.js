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
      /* on_addNode(id) {
           this.rule.rhs.addNode();
           
        }
        on_addEdge(ide,src,dest){
           this.rule.rhs.addEdge(src,dest);
        }
        /*
        let idr=this.rule.rhs.addEdge(this.rule.nodeRgc[src],this.rule.nodeRgc[dest]);
            this.rule.edgeRgc[ide]=idr;
        
        on_removeEdge(id){
            this.rule.rhs.removeEdge(id);
        }
        on_removeNode(id){
            this.rule.rhs.removeNode(id);
        }
        on_updateNode(id,dataN){
            this.rule.nodeRgc[id]=
            this.rule.rhs.updateNode(this.rule.rhsObserver.lastId,(data)=> {
                    data=dataN ;
                
                    return data;
            })
        }
        on_updateEdge(id,dataE){
            this.rule.rhs.updateEdge(this.rule.rhsObserver.lastEdge,(data)=> {
                    data=dataE;
                    return data;
            })
        }
        }*/
    
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
        this.lhsObserver = new Rule.Lhs(this, lhs);
        this.rhsObserver = new Rule.Rhs(this, rhs);
        this.nodeRgc = {};
        this.edgeRgc = {};
    }

    toJSON() {
        return JSON.stringify({
            lhs: JSON.parse(this.lhs.toJSON()),
            rhs: JSON.parse(this.rhs.toJSON()),
        })
    }

}