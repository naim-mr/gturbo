<template>

        <sidebar/>
        <router-view @initRsc="initRsc" @addRule="addRule" @switchRight="switchRight" @switchLeft="switchLeft" @switchRule="switchRule"/>
    
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
import sidebar from './components/sidebar.vue'
var {RuleSystemComponent,RuleSystemComponentObserver} =require('./js/vc/component/RuleSystemComponent');
var Observer = require('./js/util/Observer.js')
var Observable = require('./js/util/Observable.js')
var {RuleSystem,RuleSystemObserver} =require('./js/model/RuleSystem');

export default {
  components: { sidebar },
  name: 'App',
  
  data() {
      return {
          rsc: null,
          rscObs: null,
          onCreate:true,
          cptRule:0,
          onDelete:false,
      }
  },
  methods:{
      initRsc(){
          this.rsc= new RuleSystemComponent(new RuleSystem()),
          this.rscObs=new RuleSystemComponentObserver(this.rsc);
          
      },
      switchRight(){
          this.switchRule(this.$store.getters.getNext)
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
            
      }
      
  }

}
</script>
