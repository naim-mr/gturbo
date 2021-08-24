<template>
     <div  class="row justify-center" style="margin-top:10px;" >
          <div id="lhs1" class=" cyhalf col-5">
          </div>
          <div id="rhs1" class="col-5  cyhalf">
          </div>
          
      </div>
      <div  class="row justify-center" style="margin-top:10px;">
        <div id="lhs2" class=" col-5 cyhalf">
        </div>
        <div id="rhs2" class="cyhalf  col-5">
        </div>
      </div>
      <div class="row justify-center" id="Btn">
            <button  class="col-4" v-on:click="backInc"  >Back</button>
      </div>

</template>
<style>
#lhs1, #lhs2{
  margin-right:10px;
}
 #Btn {
   margin-top:10px;
   height:50px;
   font-size:20px;
   
 }
#lhs1, #rhs1,#rhs2, #lhs2{
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
      sub: null
    }
  },
  methods: {
    backInc () {
      this.$emit('backInc')
    },
  },
  mounted () {
    this.$emit('initRsc')
  }

}
</script>
