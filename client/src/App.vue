<template>
  <div id="app">
    <div class="comp" v-show="glob"> <global @save="save" @initRsc="initRsc" /></div>
    <div class="comp" v-show="rule" ><rules  @rulesMounted="rulesMounted" @back="back" /></div>
    <div class="comp" v-show="inc" ><inclusion  @backInc="backInc"/></div>
    
   </div>
</template>
<style>
html,body{
     height:100%;
     width: 100%;
}
.comp {
    margin:auto;
    height: 100%;
    width: 100%;
}
#saveB {
    border: 
}
 #app{
     display:flex;
     background-color: #e8cebf;
     flex-direction: column;
     height:100%;
     width: 100%;
 }
</style>
<script>
var {RuleSystemComponent,RuleSystemComponentObserver} =require('./js/vc/RuleSystemComponent');
var Observer = require('./js/util/Observer.js')
var Observable = require('./js/util/Observable.js')
var {RuleSystem,RuleSystemObserver} =require('./js/model/RuleSystem');

import global from "./views/GlobalView.vue"
import rules from "./views/Rules.vue"
import inclusion from "./views/Inclusions.vue"
import axios from 'axios'
export default {
  components: {
      global,
      rules,
      inclusion
  },
  name: 'App',
  
  data() {
      return {
          RuleSysObserver: class extends RuleSystemObserver{
                constructor(rsc,app){
                    super(rsc);
                    this.app=app;
                }
                on_editRule(id){
                
                this.app.glob=false;
                this.app.rule=true;
                this.app.inc=false;
                }
                on_editInclusion(id){
                    this.app.glob=false;
                    this.app.rule=false;
                    this.app.inc=true;
                }
                on_addRule(){
                    
                }
                on_addInclusion(){

                }
                on_deleteRule(){

                }
                on_deleteInclusion(){

                }
                on_save(rs){
                    
                    axios.post('http://127.0.0.1:5000/json', rs)
                           .then((res) => {
                               console.log(res.data);
                            });
                }             
          },

          rsc: null,
          msg:'',
          path:'http://localhost:5000',
          rscObs: null,
          onCreate:true,
          cptRule:0,
          onDelete:false,
          glob:true,
          rule:false,
          inc:false,
      }
  },
  methods:{
    initRsc(){
        if(this.rsc==null){
            this.rsc= new RuleSystemComponent(new RuleSystem()),
            this.rscObs= new this.RuleSysObserver(this.rsc,this,this.$router);
         }
        
    },
    save(){
       this.rsc.save();
    },
    
    back(){ 
          this.rule=false;
          this.glob=true;
          this.inc=false;
          let rules= this.rsc.rs.rules;
          
          axios.post('http://127.0.0.1:5000/patternmatching',rules)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    },
    
    backInc(){
          this.inc=false;
          this.rule=false;
          this.glob=true;
    },
    getMessage() {
      
      axios.get(this.path)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
             console.error(error);
         });
    },
  }
}

</script>
