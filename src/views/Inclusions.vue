<template>
    <inclusion v-show="$store.state.rulesId.length>0"/>
    <strong id="errorMsg" v-if="$store.state.rulesId.length==0">Impossible de définir une inclusion. <br/>Veuillez définir au moins une règle </strong>        
        
</template>
<style scoped>
    #errorMsg{  
        color:red;
        font-style: bold;
        text-align: center;
        margin:auto;
        font-size:40px;
        font-family: monospace;
    }
</style>
<script>
import inclusion from "@/components/inclusions.vue";
import RuleChoice from '../components/ruleChoice.vue';
export default {
    components: {
        inclusion,
        RuleChoice
    },
    methods:{
       
    }
}
</script>
