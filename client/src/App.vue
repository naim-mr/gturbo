<template>
<div id="app"  class=" full-width full-height">
   <navbar @home="home" @login='login'/>
   <div class="comp" v-show="glob"> <global @save="save" @initRsc="initRsc" /></div>
   <div class="comp" v-show="rule" ><rules @autoInclusion="autoInclusion"  @rulesMounted="rulesMounted" @back="back" /></div>
   <div class="comp" v-show="inc " ><inclusion  @backInc="backInc"/></div>
   <div class="comp" v-show="autoInc " ><rulesAuto @backAuto="backAuto" @goToRight="goToLRight" @initAutoRule="initAutoRule" @confirm="confirmAuto" @nextRAuto="nextRAuto" @nextLAuto="nextLAuto" @prevLAuto="prevLAuto" @prevRAuto="prevRAuto" @back="back"/></div>
   <div class="comp" v-show="log" ><logPanel @register="register"/></div>
   <div class="comp" v-show="reg" ><registerPanel @login='login' /></div>
   <q-btn @click="this.rsc.saveAsFile()"> Save as File</q-btn>
   <q-btn @click="this.rsc.loadFile()"> Load File</q-btn>
</div>

</template>
<style>
html,body{
  height:auto;
  width:auto;
  
}
body{
  background-color:rgb(247, 227, 227)
}
.comp {
    margin:auto;
}
#saveB {
    border:
}
 #app{
  height:auto;
  width:auto;
 }

</style>
<script>
import global from './views/GlobalView.vue'
import rulesAuto from './views/RulesAuto.vue'
import logPanel from './views/logPanel.vue'
import registerPanel from './views/Register.vue'
import rules from './views/Rules.vue'
import inclusion from './views/Inclusions.vue'
import navbar from './components/navbar.vue'
import axios from 'axios'

var { RuleSystemComponent, RuleSystemComponentObserver } = require('./js/vc/RuleSystemComponent')
var Observer = require('./js/util/Observer.js')
var Observable = require('./js/util/Observable.js')
var { RuleSystem, RuleSystemObserver } = require('./js/model/RuleSystem')
export default {
  components: {
    navbar,
    global,
    rules,
    logPanel,
    rulesAuto,
    inclusion,
    registerPanel
  },
  name: 'App',

  data () {
    return {
      RuleSysObserver: class extends RuleSystemObserver {
        constructor (rsc, app) {
          super(rsc)
          this.app = app
          this.last=null;
        }

        on_editRule (id) {
          this.app.glob = false
          this.app.rule = true
          this.app.inc = false
        }

        on_editInclusion (id) {
          this.app.glob = false
          this.app.rule = false
          this.app.inc = true
          this.app.autoInc = false
        }
        on_editAutoInclusion (id) {
          this.app.inc = false
          this.app.rule = false
          this.app.glob = false
          
          if(this.last!=id || this.last==null){
            this.app.$store.state.rautoLen = this.app.rsc.getAutoRight()
          
            this.app.$store.state.confirmed=[];
            for(let i=0 ; i<this.app.$store.state.rautoLen;i++)this.app.$store.state.confirmed.push(false);        
          }
          this.last=id;
          this.app.autoInc = true
          this.app.$store.state.cur = 0
        }
        on_addRule () {

        }

        on_addInclusion () {

        }

        on_deleteRule () {

        }

        on_deleteInclusion () {

        }

        on_save (rs) {
          axios.post('http://127.0.0.1:5000/json', rs)
            .then((res) => {
              console.log(res.data)
            })
        }
      },

      rsc: null,
      msg: '',
      path: 'http://localhost:5000',
      rscObs: null,
      onCreate: true,
      cptRule: 0,
      onDelete: false,
      glob: true,
      rule: false,
      inc: false,
      autoInc: false,
      log:false,
      reg:false,
    }
  },
  methods: {
    initRsc () {
      if (this.rsc == null) {
        
        this.rsc = new RuleSystemComponent(new RuleSystem()),
        this.rscObs = new this.RuleSysObserver(this.rsc, this, this.$router)
        console.log(this.rsc);
      }
    },
    save () {
      this.rsc.save()
    },
    
    home(){
      this.rule = false
      this.glob = true
      this.inc = false
      this.autoInc = false
      this.log=false;
      this.reg=false;
    },
    back () {
      this.reg=false;
      this.rule = false
      this.glob = true
      this.inc = false
      this.log=false;
      this.autoInc = false
      this.rsc.updateInclusion()
    },
    backInc () {
      this.rule = false
      this.glob = true
      this.log=false;
      this.inc = false
      this.autoInc = false
      this.rsc.stylized(this.rsc.ric.cur)
    },
    
    goToLRight(id){
      this.rsc.goToRight(id);
      this.$store.state.cur = this.rsc.aic.curR
    },
    prevRAuto () {
      this.rsc.prevRAuto()
    },
    nextRAuto () {
      this.rsc.nextRAuto()
    },
    confirmAuto () {
      this.rsc.confirmAuto();
    },
    backAuto(){
        this.reg=false;
        this.rule = false
        this.glob = true
        this.inc = false
        this.autoInc = false,
        this.rsc.confirmAuto()
    },
    login(){
    //  this.$store.state.username="Marshal";
      this.reg=false;
      this.log=true;
      this.rule = false
      this.glob = false
      this.inc = false
      this.autoInc = false
    },
    register(){
      this.reg=true;
      this.log=false;
      this.rule = false
      this.glob = false
      this.inc = false
      this.autoInc = false

    }

  },
  
  
  
}

</script>

