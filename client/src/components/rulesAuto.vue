<template>
      <div  class="row justify-center" style="margin-top:10px;" >
          <div id="a_lhs1" class=" cyhalfA col-5">
          </div>
          <div id="a_rhs1" class="col-5  cyhalfA">
          </div>
          
      </div>

     <div  class="row justify-center" style="margin-top:10px;">
        <div id="a_lhs2" class=" col-5 cyhalfA">
        </div>
        <div id="a_rhs2" class="cyhalfA col-5">
        </div>
      </div>
      <div class="row" >
       <div class="offset-md-6">
              <q-btn   v-for="id in this.$store.state.rautoLen"  @click="goToRight(id)" :style="style(id)"  :color="btnColor(id)" :label="id" text-color="black"  ></q-btn>    
        </div>
        
        
      </div>
      <q-btn color="white" label="Back" v-on:click='back' text-color="black"></q-btn>         
</template>

<style>
#a_lhs1, #a_lhs2 {
  margin-right:10px;
}
#a_lhs1, #a_rhs1,#a_rhs2, #a_lhs2{
        border:1px solid black;
        border-radius: 6px 6px 6px 6px;
        height:400px;
        
        
        background:#e5e7e6;
        box-shadow: 1px 1px 1px 1px #798a83;
}

</style>
<script>
export default {
  components: {
  },

  data () {
    return {
      fix: false,
      over: null,
      sub: null,
      cur: 0,
      state: false

    }
  },
  methods: {
    back () {
      
      this.$emit('backAuto')
    },
    btnColor(id){
      if(!this.$store.state.confirmed[id-1]) return "white"
      else return "secondary"
    },
    style(id){
      if(this.$store.state.cur==id-1) return "border:2px solid red";
      else return "";
    },
    nextR () {
      this.$emit('nextRAuto')
    },
    goToRight(id){
      this.$emit("goToRight",id-1);
      this.state=true;
    },
    prevR () {
      this.$emit('prevRAuto')
      this.state = true
    },
   
  },
  mounted () {
    
    this.$emit('initRsc')
  },
  updated(){
    
  }

}
</script>
