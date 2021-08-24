

const removeElement = (array, elem) => {
    var index = array.indexOf(elem)
    console.log(index)
    if (index > -1) {
      array.splice(index, 1)
    } 
}

class Base {

    static base(morphism){
        let b = new Base(morphisms);
        return b;
    }
    constructor(morphisms){
        this.base=[];
        this.saturation=[]
        this.generateBase(morphisms);   
    }
    generateBase (morphisms) {
        this.base = []
        const identity = this.popIdentity(morphisms)
        this.saturation.push(identity)
        let a
        let s
        let t
        let fifo = []
        while (morphisms.length > 0) {
          a = morphisms.shift()
          this.base.push(a)
          fifo.push(a)
          while (fifo.length > 0) {

            s = fifo.shift()
            t = this.compose(s, a);
            this.deleteAutoInc(t, morphisms)
            if (!this.inSatutration(t)) { 
                fifo.push(t);
                this.saturation.push(t);
            }
            if (!this.checkEquality(a, s)) {
              t = this.compose(a, s)
            
                this.deleteAutoInc(t, morphisms)
                if (!this.inSatutration(t)) { 
                    fifo.push(t) 
                    this.saturation.push(t);
                }
            
            }                       
        }
       /* fifo=[];
        let sat=[];
        for(let  i=0;i< this.base.length;i++){
            let b=this.base[i];
            for(let  j=0; j< this.base.length;j++){
                if(i!=j){
                    let b2=this.base[j];
                    let c1= this.compose(b,b2)
                    let c2= this.compose(b2,b)
                    sat.push(c1)
                    sat.push(c2)
                    fifo.push(c1);
                    fifo.push(c2);
                    while(fifo.length>0){
                        
                        let f= fifo.shift()
                        if(this.inBase(f)){
                                console.log(f);
                                this.deleteAutoInc(f,this.base)
                        }
                        for(let  s of sat){
                            
                            let k2=this.compose(f,s);
                            if(this.inBase(k2) )
                            
                            {
                              this.deleteAutoInc(k2,this.base)
                            }
                            let k1=this.compose(s,f);
                            if(this.inBase(k1) )
                            
                            {
                              this.deleteAutoInc(k1,this.base)
                             }

                        }   
                    }
                }
            }
        }*/
          
    }
  
        return this.base
      }
      compose (s, a) {
        const nodeMap = {}
        const edgeMap = {}
        for (const n in a.nodeMap) {
          nodeMap[n] = s.nodeMap[a.nodeMap[n]]
        }
        for (const src in a.edgeMap) {
          edgeMap[src] = s.edgeMap[a.edgeMap[src]]
        }
        return {nodeMap:nodeMap, edgeMap:edgeMap}
      }
      inSatutration (a) {
        for (let i = 0; i < this.saturation.length; i++) {
          if (this.checkEquality(a, this.saturation[i])) return true
        }
        return false
      }
      inBase (t) {
        for (let i = 0; i < this.base.length; i++) {
          if (this.checkEquality(t, this.base[i])) return true
        }
        
        return false
      }
      deleteAutoInc (t, morphisms) {
        let a
        for (let i = 0; i < morphisms.length; i++) {
          a = morphisms[i]
          if (this.checkEquality(t, a)) {
            morphisms.splice(i, 1)
          }
        }
      }
  
      popIdentity (morphisms) {
        let identity = null
        for (let i = 0; i < morphisms.length; i++) {
          if (this.checkIdentity(morphisms[i].nodeMap, morphisms[i].edgeMap)) {
            identity = morphisms[i]
            morphisms.splice(i, 1)
          }
        }
        return identity
      }
  
      checkIdentity (nodeMap, edgeMap) {
        for (const src in edgeMap) if (edgeMap[src] != src) return false
        for (const n in nodeMap) if (nodeMap[n] != n) return false
        return true
      }
  
      checkEquality (t, a) {
        for (const src in t.edgeMap) if (t.edgeMap[src] != a.edgeMap[src]) return false
        for (const n in t.nodeMap) if (t.nodeMap[n] != a.nodeMap[n]) return false
        return true
      }
  

}
module.exports = { Base}