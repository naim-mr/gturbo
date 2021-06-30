class ObservableSeq {
    constructor(){
        this.observables=[];
        this.callBack=[];
    }
   
    pushCallBack(cb){
         this.callBack.push(cb);
           
    }
    notify(){
        let cb=this.callBack.shift();
        cb.obs[cb.op].apply(cb.obs,cb.args);        
            
    }
}

module.exports= { ObservableSeq }