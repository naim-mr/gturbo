<template>
     <div class="legend">
       Source (bottom): rule {{ sub }} &rarr; target (top): rule {{ over }}.
       Click an element of the source, then an element of the target, to bind them (same color).
     </div>
     <div  class="row justify-center" style="margin-top:10px;" >
          <div class="col-5 cell lcell">
            <div class="cap">lhs1 &middot; target</div>
            <div id="lhs1" class="cyhalf"></div>
          </div>
          <div class="col-5 cell">
            <div class="cap">rhs1 &middot; target</div>
            <div id="rhs1" class="cyhalf"></div>
          </div>
      </div>
      <div  class="row justify-center" style="margin-top:10px;">
          <div class="col-5 cell lcell">
            <div class="cap">lhs2 &middot; source</div>
            <div id="lhs2" class="cyhalf"></div>
          </div>
          <div class="col-5 cell">
            <div class="cap">rhs2 &middot; source</div>
            <div id="rhs2" class="cyhalf"></div>
          </div>
      </div>
      <div class="row justify-center items-center" id="Btn">
            <button  class="col-3" v-on:click="backInc"  >Back</button>
            <div class="col-4 text-center" :class="validated ? 'inc-valid' : 'inc-editing'">
              {{ validated ? 'Inclusion validated' : 'Inclusion being edited' }}
              <div v-if="message" class="inc-message">{{ message }}</div>
            </div>
            <button  class="col-3" v-on:click="validateInc" >Validate</button>
      </div>

</template>
<style>
.lcell { margin-right:10px; }
.cap { font-weight: bold; margin-bottom: 2px; }
.legend { text-align: center; margin-top: 8px; }
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
#Btn {
   height:auto;
}
.inc-valid { color: #117733; font-weight: bold; }
.inc-editing { color: #996600; font-weight: bold; }
.inc-message { font-size: 14px; font-weight: normal; color: #882255; }
</style>
<script>
export default {
  components: {
  },
  props: {
    validated: { type: Boolean, default: false },
    sub: { type: [String, Number], default: '' },
    over: { type: [String, Number], default: '' },
    message: { type: String, default: '' }
  },
  data () {
    return {
      fix: false
    }
  },
  methods: {
    backInc () {
      this.$emit('backInc')
    },
    validateInc () {
      this.$emit('validateInc')
    },
  },
  mounted () {
    this.$emit('initRsc')
  }

}
</script>
