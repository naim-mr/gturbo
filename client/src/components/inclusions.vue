<template>
        <div class="rowContent">
            <cyInc />
            <button v-on:click="backInc" >back </button>
        </div>

</template>
<style>
.rowContent {
    display:flex;
    flex-direction: row;
}
.rowContent button {
    height:5%;
    width:5%;
}
</style>
<script>
import cyInc from './cyInc.vue'
export default {
  components: {
    cyInc
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
    }
  },
  mounted () {
    this.$emit('initRsc')
  }

}
</script>
