  <template>
    <div class="row">
      <div class="col-md-8 offset-md-2 sysname">{{ name }}</div>
    </div>
    <div class="row" >
      <div id="rcomp" class="col-md-8 offset-md-2 " ></div>
    </div>
    <div class="row">
      <q-btn class="col-md-2 offset-md-5"  id="saveB"  @click="save" label="Save (.txt)"></q-btn>
    </div>
    
</template>
<style>
  .sysname { margin-top: 10px; font-weight: bold; color: #2b3a4a; }
  
  #rcomp{
        margin-top:10px;
        height:800px;
        border:1px solid black;
        border-radius: 6px 6px 6px 6px;
        background:#e5e7e6;
        box-shadow: 3px 3px 3px 3px #798a83;
    }
    #saveB {
      
        margin-top:15px;
        background:#e5e7e6;
        box-sizing: border-box;
        border-radius: 6px 6px 6px 6px;
        box-shadow: 1px 1px 1px 1px #798a83;

    }
    #saveB:hover{
    }
</style>
<script>
export default {
  props: {
    name: { type: String, default: '' }
  },
  methods: {
    save () {
      this.$emit('save')
    }
  },
  mounted () {
    this.$emit('initRsc')
  }
}
</script>
