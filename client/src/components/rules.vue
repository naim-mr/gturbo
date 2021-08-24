<template>
    
      <div class="row justify-center">
           <div id="lhs" class=" col-md-5" ></div>
           <div id="rhs" class=" col-md-5  "></div>
      </div>
      <div  id="btn-r" class="row justify-center">
         
         <button  v-on:click="back" >back </button>
      </div>

</template>
<style>
#lhs{
  margin-right:10px;
}
#lhs,#rhs{
    border-radius: 6px 6px 6px 6px;
    margin-top:10px;
    height:800px;
    background:#e5e7e6;
    border:1px solid black;
    box-shadow: 3px 3px 3px 3px #798a83;
}
#btn-r{
    margin-top:20px;
    height:50px;
  }
#autoInc{
     margin-right:10px;
}
button {
    background:#e5e7e6;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 6px 6px 6px 6px;
    box-shadow: 1px 1px 1px 1px #798a83;
}
button:hover{
    border-color:rgb(51, 51, 51);
}
</style>
<script>
export default {
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
    autoInclusion () {
      this.$emit('autoInclusion')
    },
    back () {
      this.$emit('back')
    },
  },
  mounted () {
    this.$emit('rulesMounted')
  }

}
</script>
