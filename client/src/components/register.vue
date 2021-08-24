<template>
    <div  class="row text-center justify-center" style="margin-top:300px;">
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="username" type="text" label="username" />
              <q-input square filled clearable v-model="password" type="password" label="password" />
              <q-input square filled clearable v-model="confirmP" type="password" label="confirm password" />
            </q-form>
          </q-card-section>
          <q-card-actions  v-on:click="reg" class="q-px-md">
            <q-btn unelevated  color="light-green-9" size="lg" class="full-width" label="Register" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-blue-10" @click="this.$emit('login')">Back to log in panel</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {

  data(){
    return {
      username: '',
      password: '',
      confirmP:'',
    }
  },
  methods: {
      reg(){
         
          if(this.password === this.confirmP){
               axios.post('http://127.0.0.1:5000/signup',{'username':this.username,'password':this.password} )
                .then(()=>{
                    this.$emit('login')
                    console.log('ici');
                })
                .catch((error)=> console.log(error))
          }
      }
  }
}
</script>

<style>
#comp {
    
}
.q-card {
  width: 360px;
}
</style>