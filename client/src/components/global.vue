<template>
    <div class="colComp">
        <div id="rcomp" class="cy">
        </div>
        <button  id="saveB" @click="save">Save</button>
    </div>
</template>
<style>
    .colComp{

        display:flex;
        flex-direction:column;
        width:100%;
        height:100%;
    }
    .cy{
        border:1px solid black;
        border-radius: 6px 6px 6px 6px;
        height: 80%;
        width: 80%;
        background:#e5e7e6;
        box-shadow: 3px 3px 3px 3px #798a83;
    }
    .colComp button {

        background:#e5e7e6;
        box-sizing: border-box;
        border-radius: 6px 6px 6px 6px;
        margin:auto;
        width:20%;
        box-shadow: 1px 1px 1px 1px #798a83;

    }
    .colComp button:hover{
        border-color:rgb(51, 51, 51);
    }
</style>
<script>
import arrow from '../assets/imgs/arrow.png'
export default {
  components: {
  },
  data () {
    return {
      img: arrow
    }
  },
  methods: {

    addRule () {
      this.$emit('addRule')
    },
    switchLeft () {
      this.$emit('switchLeft')
    },
    switchRight () {
      this.$emit('switchRight')
    },
    save () {
      this.$emit('save')
    }
  },
  mounted () {
    console.log('mountedd')
    this.$emit('initRsc')
  }

}
</script>
