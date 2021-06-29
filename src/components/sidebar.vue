<template>
    <div id="sidebar-wrapper">
        <ul class="sidebar-nav">
            <li ><button @click="switchRule">Rules</button></li>
            <li><button @click="switchInclusion">Inclusions</button> </li>
        </ul>
    </div>

</template>
<style scoped>


#sidebar-wrapper {
  width: 250px;
  box-shadow:1px 1px 1px gray;
  background:#e5e7e6;
  height: 100%;
  z-index: 1000;
  transition: all 0.4s ease 0s;
}

.sidebar-nav li{
  padding:10px;
}
.sidebar-nav {
  margin-top:50%;
  padding:0;
  list-style: none;
}
.sidebar-nav li {
  text-align: center;
  font-family: monospace;
  font-size:20px;
  color:#2c3e50;
}
.sidebar-nav button{
  border :none;
  background: none;
}
.sidebar-nav li:hover {
  border: 2px solid cadetblue;
  transition: all 0.4s ease 0s;
}
</style>
<script>

export default {
  data(){
    return{
    onglet:0
    }
  },
  methods:{
    switchInclusion(){
        if(this.onglet==1)(this.$emit("leaveRule"));
        this.$router.push("/inclusions");
        this.onglet=2;
    },
    switchRule(){
      this.onglet=1;
      this.$router.push("/rules")
    } 
  }
}
</script>
