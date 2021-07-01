<template>
     <div class="colContent">
            <div  class="rowContent">
                <div id="lhs1" class="cyhalf">

                </div>    
                <div id="rhs1" class="cyhalf">
                </div>
            </div>
            <div  class="rowContent">
                <div id="lhs2" class="cyhalf">
                </div>    
                <div id="rhs2" class="cyhalf">
                </div>

            </div>
<!--            <div  class="rowContent">
            <img v-on:click="switchLeftInc" id="larrow" v-bind:src="img"> 
            <img v-on:click="switcRightInc" id="rarrow" v-bind:src="img">
    
            </div>
 -->   
        <button @click="$emit('backInc')"> Back</button>
     </div>
    
</template>
<style scoped>
.rowContent{
        width:100%;
        height:100%;
        display:flex;
        flex-direction: row;
} 
#rarrow {
        height:30%;
}
#larrow {
        height: 30%;
        transform: rotate(180deg)
}
.colContent {

        display:flex;
        flex-direction: column;
        width:100%;
        height:100%;
}
.cyhalf{
        
        margin-left:auto;
        margin-right: auto;
        border:1    px solid black;
        border-radius: 6px 6px 6px 6px;
        width: 45%;
        
        background:#e5e7e6;
        box-shadow: 3px 3px 3px 3px #798a83;
}
.colContent button {     
        background:#e5e7e6;
        box-sizing: border-box;
        border-radius: 6px 6px 6px 6px;
        width:20%;
        box-shadow: 1px 1px 1px 1px #798a83;
        
}
    

</style>
<script>
import arrow from "../assets/imgs/arrow.png"
export default {
    data(){
        return {
            img:arrow
        } 
    },
    methods: {
        unfixed(){
            console.log("icic");
            this.$emit("unfixed");
        }
     
    },
    mounted(){
    }
    
}
</script>
