<template>
    
    <div id="boy">
            <cyInc v-show="fix"  @unfixed="unfixed"/>
            <div v-show="!fix" class="footer">
              
                <select  name="topruleList" class="rule-select">
                    <option value="">Choisir une la règle du haut </option>
                    <option  v-for="ele in this.$store.state.rulesId" :key="ele" v-bind:value="ele" v-on:click="setOver(ele)">
                                 {{ ele }}
                    </option>
                </select>
                <select  name="botruleList" class="rule-select">
                    <option value="">Choisir une la règle du bas </option>
                    <option  v-for="ele in this.$store.state.rulesId" :key="ele" v-bind:value="ele" v-on:click="setSub(ele)">
                                 {{ ele }}
                    </option>
                </select>
                <button  @click="fixed" id="valider">Valider</button>
              
            </div> 
               
    </div>
    
    
</template>
<style>
    
    .footer{
        display:flex;
        flex-direction: row;
    }
    .footer .rule-select{
        width:300px;
        height:50px;
    
    }
   
    #boy{
        height: 100%;
        width:100%;
        background:#699fc8
    }
    #boy img {
        cursor:pointer;
    }
 
    #valider{
        background: rgba(74, 255, 74, 0.849);
    }
    #content button:hover{
        border-color:rgb(51, 51, 51);
    }
</style>
<script>
import cyInc from "./cyInc.vue"
export default {
    components:{
        cyInc
    },
    data(){
        return {
            fix:false,
            over:null,
            sub:null
        } 
    },
    methods: {
        setOver(ele){
            console.log('setOver ' + ele);
            this.over=ele;
        },
        setSub(ele){
            this.sub=ele;
        },
        addInclusion(){
            this.fix=false;
            this.$emit("addInclusion");
        },
        unfixed(){
            this.fix=false;
        },
        fixed(){
            this.fix=true;
            this.createInclusion();
            
        },
        createInclusion(){
            console.log("ici");
            this.$emit("createInclusion",this.sub,this.over);
        }
     
    },
    mounted(){
        this.$emit("initRsc")
    }
    
}
</script>