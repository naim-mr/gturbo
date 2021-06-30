<template>
    <div id="rowContent">
    <div id="lhs" class="cy"></div>
    <div id="rhs" class="cy"></div>

    </div>
    <button v-on:click="back" >back </button>
               
   
</template>
<style>
    #rowContent{
        width:100%;
        height:100%;
        display:flex;
        flex-direction: row;
    }
    .footer{
        display:flex;
        flex-direction: row;
    }
    .footer #rule-select{
        margin:auto;
        width:10%;
        height: 20%;
    
    }
    #content {
        display:flex;
        flex-direction: column;
        width:100%;
        height:100%;
    }
    #boy{
        height: 100%;
        width:100%;
        background:#699fc8
    }
    #rarrow {
        width: 10%;
        margin-left:80%;
    }
    #larrow {
        width: 10%;
        transform: rotate(180deg)
    }
    #boy img {
        cursor:pointer;
    }
    .cy{
        margin:auto;
        border-radius: 6px 6px 6px 6px;
        height: 80%;
        width: 80%;
        background:#e5e7e6;
        box-shadow: 3px 3px 3px 3px #798a83;
                
    }
    #content button {
        
        background:#e5e7e6;
        border-color:2px solid transparent;
        box-sizing: border-box;
        margin-bottom: 5%;
        margin-left:auto;
        margin-right:auto;
        width:25%;
        border-radius: 6px 6px 6px 6px;
        box-shadow: 1px 1px 1px 1px #798a83;

    }
    #content button:hover{
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

