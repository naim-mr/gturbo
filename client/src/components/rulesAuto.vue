<template>
      <div class="legend">
        Rule {{ rule }}: the lhs automorphism (left) is sent to the rhs automorphism you choose (right).
        Source at the bottom, target at the top.
      </div>
      <div  class="row justify-center" style="margin-top:10px;" >
          <div class="col-5 cell lcell">
            <div class="cap">lhs1 &middot; target</div>
            <div id="a_lhs1" class="cyhalfA"></div>
          </div>
          <div class="col-5 cell">
            <div class="cap">rhs1 &middot; target</div>
            <div id="a_rhs1" class="cyhalfA"></div>
          </div>
      </div>
      <div  class="row justify-center" style="margin-top:10px;">
          <div class="col-5 cell lcell">
            <div class="cap">lhs2 &middot; source</div>
            <div id="a_lhs2" class="cyhalfA"></div>
          </div>
          <div class="col-5 cell">
            <div class="cap">rhs2 &middot; source</div>
            <div id="a_rhs2" class="cyhalfA"></div>
          </div>
      </div>
      <div class="row justify-center items-center" id="autoBtn">
        <q-btn color="white" label="Back" @click="back" text-color="black"></q-btn>
        <div class="col text-center">
          <span class="auto-help">Rhs automorphism (target of the rhs):</span>
          <q-btn v-for="id in count" :key="id" @click="$emit('select', id - 1)" :style="style(id)"
                 color="white" text-color="black" :label="id"></q-btn>
          <div :class="validated ? 'inc-valid' : 'inc-editing'">
            {{ validated ? 'Inclusion validated' : 'Inclusion being edited' }}
          </div>
        </div>
        <q-btn color="white" label="Validate" @click="$emit('validateAuto')" text-color="black"></q-btn>
      </div>
</template>

<style>
.lcell { margin-right:10px; }
.cap { font-weight: bold; margin-bottom: 2px; }
.legend { text-align: center; margin-top: 8px; }
#a_lhs1, #a_rhs1,#a_rhs2, #a_lhs2{
        border:1px solid black;
        border-radius: 6px 6px 6px 6px;
        height:400px;
        
        
        background:#e5e7e6;
        box-shadow: 1px 1px 1px 1px #798a83;
}

#autoBtn {
  margin-top: 10px;
}
.auto-help { margin-right: 8px; }
.inc-valid { color: #117733; font-weight: bold; }
.inc-editing { color: #996600; font-weight: bold; }
</style>
<script>
export default {
  props: {
    count: { type: Number, default: 0 },
    cur: { type: Number, default: 0 },
    validated: { type: Boolean, default: false },
    rule: { type: [String, Number], default: '' }
  },
  methods: {
    back () {
      this.$emit('backAuto')
    },
    style (id) {
      return this.cur === id - 1 ? 'border:2px solid red' : ''
    }
  }
}
</script>
