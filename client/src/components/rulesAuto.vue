<template>
    <div class="rowContent">
        <div class="colContent">
            <cyAutoInc />
            <div class="rowButton">

                <div class="rowContent" >
                    <button v-on:click="prevR" >Prev </button>
                    <button v-on:click="nextR" >next </button>

                </div>
            </div>
        </div>
        <div class="colButton">
            <button v-on:click="prevL" >Prev </button>
            <button v-on:click="nextL" >next </button>
            <button v-on:click="confirm" >Confirm</button>
            <select name="goto" id="auto-select">
                <option value="">--Please choose a left base morphism--</option>
                <option v-for="id in this.$store.state.baseLen">base {{ id }} </option>

            </select>
            <p v-if="state" v-for="id in this.$store.state.baseLen">  Etat {{ id}}  :{{ this.confirmed[id-1]}}  </p>
            <p> Current {{ this.$store.state.cur}}</p>
          </div>

    </div>

</template>

<style>
.rowButton{
    display:flex;
    flex-direction: row;
}
.rowButton .rowContent{
    margin-left:50%;
}
.rowButton .rowContent button{
    margin-right:1%;
}
.rowButton button  {
    box-shadow: 1px 1px 1px 1px #798a83;
}
.colButton{
    display:flex;
    flex-direction:column;
}
.colContent{

    display:flex;
    flex-direction:column;
    width:100%;
    height:100%;
}
</style>
<script>
import cyAutoInc from './cyAutoInc.vue'
export default {
  components: {
    cyAutoInc
  },

  data () {
    return {
      fix: false,
      over: null,
      sub: null,
      cur: 0,
      confirmed: [],
      state: false

    }
  },
  methods: {
    back () {
      this.$emit('back')
      this.state = true
    },
    nextR () {
      this.$emit('nextRAuto')
      this.state = true
    },
    nextL () {
      this.$emit('nextLAuto')
      this.state = true
    },
    prevL () {
      this.$emit('prevLAuto')

      this.state = true
    },
    prevR () {
      this.$emit('prevRAuto')
      this.state = true
    },
    confirm () {
      this.state = true
      this.confirmed[this.$store.state.cur] = true
      let check = true
      for (const b of this.confirmed) {
        check = check && b
        console.log(b)
      }
      console.log(check)
      if (check) this.$emit('confirm')
    },
    printState () {
      this.state = true
      for (let i = 0; i < this.$store.state.baseLen; i++) this.confirmed.push('false')
    }
  },
  mounted () {
    this.$emit('initRsc')
  }

}
</script>
