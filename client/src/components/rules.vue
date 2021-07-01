<template>
    <div class="colContent">
        <div class="rowContent">
           <div id="lhs" class="cy"></div>
           <div id="rhs" class="cy"></div>
         </div>
         <div  class="rowButton">
            <button v-on:click="back" >back </button>
            <button @click="autoInclusion" id="autoInc" >auto inclusion </button>
         </div>
    </div>    
               
   
</template>
<style>
    .rowContent{
        width:100%;
        height:100%;
        display:flex;
        flex-direction: row;
    }
    
    .colContent{
        
        display:flex;
        flex-direction:column;
        width:100%;
        height:100%;
    }
    .cy{
        margin:auto;
        border-radius: 6px 6px 6px 6px;
        height: 80%;
        width: 45%;
        background:#e5e7e6;
        border:1px solid black;
        box-shadow: 3px 3px 3px 3px #798a83;
                
    }
    .colContent .rowButton button {     
        background:#e5e7e6;
        box-sizing: border-box;
        border-radius: 6px 6px 6px 6px;
        width:20%;
        box-shadow: 1px 1px 1px 1px #798a83;
        
    }
    
    .colContent button:hover{
        border-color:rgb(51, 51, 51);
    }
</style>
<script>
import arrow from "../assets/imgs/arrow.png";
export default {
    components:{
        },
    data(){
        return {
            img:arrow,
        } 
    },
    methods: {
        autoInclusion(){
            this.$emit('autoInclusion');
        },
        addRule(){
            this.$emit('addRule');
            
        },
        back(){
           this.$emit("back");
        },
        switchLeft(){
            this.$emit('switchLeft');
        },
        switchRight(){
            this.$emit('switchRight');
        }
    },
    mounted(){
        this.$emit("rulesMounted")
    }
    
}
</script>

