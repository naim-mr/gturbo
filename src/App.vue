<template>

  
  <global v-show="global"/>
  <rules v-show="global">
  
</template>
<style>
html,body{
     height:100%;
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
                constructor(rsc,app,router){
                    super(rsc);
                    this.app=app;
                    this.router=router;
                }
                on_editRule(){
                    this.router.push("/rules");
                    app.global=false;
                    app.rules=true;

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
          global:true,
          rules:false,
      }
  },
  methods:{
      initRsc(){
         console.log('init');
        if(this.rsc==null){
            this.rsc= new RuleSystemComponent(new RuleSystem()),
              this.rscObs= new this.RuleSysObserver(this.rsc,this,this.$router);
         }
          
      },
      initRc(){
          this.rsc.createRc();
      },
      switchRight(){
          this.switchRule(this.$store.getters.getNext)
      },
      saveCur(){
          alert("ici");
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
          console.log(n);
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
        console.log("app "+sub +" "+over);

         this.rsc.createInclusion(sub,over);
      },
      topRule(){

      },
      botRule(){

      }
      
  }

}
</script>
