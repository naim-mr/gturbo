<template>


  <div class="comp" v-show="glob"> <global  @initRsc="initRsc" /></div>
  <div class="comp" v-show="rule" ><rules  @rulesMounted="rulesMounted" @back="back" /></div>

  
</template>
<style>
html,body{
     height:100%;
     width: 100%;
}
.comp {
    height: 100%;
    width: 100%;
}
 #app{
     display:flex;

     flex-direction: row;
     height:100%;
     width: 100%;
 }
</style>
<script>
var {RuleSystemComponent,RuleSystemComponentObserver} =require('./js/vc/component/RuleSystemComponent');
var Observer = require('./js/util/Observer.js')
var Observable = require('./js/util/Observable.js')
var {RuleSystem,RuleSystemObserver} =require('./js/model/RuleSystem');

import global from "./views/GlobalView.vue"
import rules from "./views/Rules.vue"
export default {
  components: {
      global,
      rules,
  },
  name: 'App',
  
  data() {
      return {
          RuleSysObserver: class extends RuleSystemObserver{
                constructor(rsc,app){
                    super(rsc);
                    this.app=app;
                }
                on_editRule(){
                this.app.glob=false;
                this.app.rule=true;

                }
                on_addRule(){
                }
                on_addInclusion(){

                }
                on_deleteRule(){

                }
                on_deleteInclusion(){

                }
          },

          rsc: null,
          rscObs: null,
          onCreate:true,
          cptRule:0,
          onDelete:false,
          glob:true,
          rule:false,
      }
  },
  methods:{
      initRsc(){
        console.log("ok"+ this.glob);
        if(this.rsc==null){
            this.rsc= new RuleSystemComponent(new RuleSystem()),
            this.rscObs= new this.RuleSysObserver(this.rsc,this,this.$router);
         }
        
      },
      rulesMounted(){
          
        
      },
      back(){
          this.rule=false;
          this.glob=true;
      },
      saveCur(){
          this.rsc.saveRule(this.onCreate);
      },
      addRule(){
          this.rsc.saveRule(this.onCreate);
          this.$store.commit("addRule");
          this.rsc.removeEles()
          this.onCreate = true
          this.rsc.createRule()
          this.rsc.saveRule(this.onCreate);           
          
          this.onCreate = false  
      },
      switchLeft(){
          this.switchRule(this.$store.getters.getPrevious)
      },
      switchRule(n){
          this.$store.state.index=n;
            if (this.onDelete) {
                this.rsc.rc.cur = n
                this.onDelete = false
            }   else {
                this.rsc.saveRule(this.onCreate)
            }
            this.rsc.removeEles()
            this.onCreate = false
            this.rsc.switch(n)
            
      },
      createInclusion(sub,over){
         this.rsc.createInclusion(sub,over);
      },
      topRule(){

      },
      botRule(){

      }
      
  }

}
</script>
