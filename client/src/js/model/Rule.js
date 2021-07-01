var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('./Graph.js')

class RuleObserver extends Observer {
  constructor (r) {
    super(r)
  }

  on_update (hs) {};
  on_baseGenerated(base){}
}

class Rule extends Observable {
    // checker si c'est nécessaire
    static Lhs = class extends GraphObserver {
      constructor (rule, g) {
        super(g)

        this.rule = rule
      }

      on_addNode (id) {
      //     this.rule.rhs.addNode();
        this.rule.notify('on_update', 'lhs')
      }

      on_addEdge (ide, src, dest) {
        // this.rule.rhs.addEdge(src,dest);
        this.rule.notify('on_update', 'lhs')
      }

      on_removeEdge (id) {
        this.rule.notify('on_update', 'lhs')
      }

      on_removeNode (id) {
        this.rule.notify('on_update', 'lhs')
      }

      on_updateNode (id, dataN) {
        this.rule.notify('on_update', 'lhs')
      }

      on_updateEdge (id, dataE) {
        this.rule.notify('on_update', 'lhs')
      }
    }

    static Rhs = class extends GraphObserver {
      constructor (rule, g) {
        super(g)
        this.rule = rule
      }

      on_addNode (id) {
        //     this.rule.rhs.addNode();
        this.rule.notify('on_update', 'rhs')
      }

      on_addEdge (ide, src, dest) {
        this.rule.notify('on_update', 'rhs')
      }

      on_removeEdge (id) {
        this.rule.notify('on_update', 'rhs')
      }

      on_removeNode (id) {
        this.rule.notify('on_update', 'rhs')
      }

      on_updateNode (id, dataN) {
        this.rule.notify('on_update', 'rhs')
      }

      on_updateEdge (id, dataE) {
        this.rule.notify('on_update', 'rhs')
      }
    }

    static emptyRule () {
      return new Rule(null, null)
    }

    constructor (lhs, rhs) {
      super()
      this.lhs = lhs
      this.rhs = rhs
      this.autoInclusion = {}
      this.lhsObserver = new Rule.Lhs(this, lhs)
      this.rhsObserver = new Rule.Rhs(this, rhs)
      this.nodeRgc = {}
      this.edgeRgc = {}
      this.base=[];
      this.saturation=[];
    }

    toJSON () {
      return JSON.stringify({
        lhs: JSON.parse(this.lhs.toJSON( (data)=> { return  data}, (data)=> { return  data}     )),
        rhs: JSON.parse(this.rhs.toJSON(  (data)=> { return  data}, (data)=> { return  data}    ))
      })
    }
  /* creerBase:
---------------------
Entrée : Ensemble d'automorphisme Aut=  { f1,f2....,fn}
Variable : B : liste représentant la base construite , 
           S : liste des composition déjà calculé 
---------------------
Algo:
    B := {};
    S:={id};
    Aut= Aut\S;
    tant que (Aut!={})
        a::Aut := Aut;
        B := B  U {a} //revenir    
        saturer(a,S,B,Aut)            
    Fin tant que 
Fin    
----------
saturer
---------------------
Entrée: Ensemble automorphisme A 
        B base de A 
        Saturation S de B\a  
        a dernier automorphisme ajouté à la base ;
Variable : Temp liste des automorphisme a ajouté dans S 
//invariant
    Temp={a}
    tant que (Temp != {})
        
        s=Temp[0];       
        supprimer s dans Temp;
        ajouter s dans S; 
        
        pour( i allant de 0  à S.taille)
            t= so S[i]; 
            si t dans A 
               supprimer t dans A; 
            FIn si
            si t pas dans S
                ajouter t dans Temp 
            FIN si 
            t= S[i]os ; 
            si t dans A 
               supprimer t dans A; 
            Fin si                    
            si t pas dans S
                ajouter t dans Temp 
            FIN si 
        Fin pour 
    Fin tant que
Fin



*/  
    compose(s,a){
      let nodeMap={};
      let edgeMap={}
      for(const n in a.nodeMap){
          nodeMap[n]= s.nodeMap[a.nodeMap[n]]
      }
      for(const src in a.edgeMap){
        edgeMap[src]= s.edgeMap[a.edgeMap[src]]
    }
      return [nodeMap,edgeMap];
    }
    generateBase(autoInclusion){ 
      this.base=[];
      this.saturation.push((this.popIdentity(autoInclusion)));
      let a;
      let s;
      let t;
      let fifo =[];
      while(autoInclusion.length>0){
        a=autoInclusion.shift();
        this.base.push(a);
        fifo.push(a);
        while( fifo.length>0){
            s=fifo.shift();            
            t= this.compose(s,a);
            this.deleteAutoInc(t,autoInclusion);
            if(! this.inSatutration(t)) 
              fifo.push(t);
            if(! this.checkEquality(a,s)){
              t= this.compose(a,s);
              this.deleteAutoInc(t,autoInclusion);
              if(! this.inSatutration(t)) 
                fifo.push(t);
            }            

        }
        console.log(this.base);
        this.notify("on_baseGenerated",this.base);
      } 

      
    }
    inSatutration(a){
      for(let i=0; i<this.saturation.length;i++){
        if(this.checkEquality(a,this.saturation[i]))return true;
      }
      return false;
    }
    deleteAutoInc(t,autoInclusion){
      let a; 
      console.log("on delet");
      console.log(autoInclusion.length)
      for(let i =0 ; i<autoInclusion.length;i++){
        a= autoInclusion[i];
        console.log("delete");
        console.log(this.checkEquality(t,a));
        if(this.checkEquality(t,a)) {
          autoInclusion.splice(i,1)
        }

      }
    }
    popIdentity(autoInclusion){
      let identity=null;
      for(let i=0;i< autoInclusion.length;i++){
        if( this.checkIdentity(autoInclusion[i].nodeMap ,autoInclusion[i].edgeMap)){
          identity= autoInclusion[i]  ;
          autoInclusion.splice(i,1)
        }
      }
      return identity
      
    }
    checkIdentity(nodeMap,edgeMap){
      for( const src in edgeMap)if(edgeMap[src] != src) return false
      for( const n in nodeMap)if(nodeMap[n] != n) return false
      return true;
    }
    checkEquality(t,a){
      for(const src in t.edgeMap) if(t.edgeMap[src] !=  a.edgeMap[src] ) return false;
      for( const n in t.nodeMap)if(t.nodeMap[n] != a.nodeMap[n]) return false;
      return true;
    }


    
}

module.exports = { Rule, RuleObserver }
