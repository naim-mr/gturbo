<template>
    <div  class="row text-center justify-center" style="margin-top:300px;">
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="email" />
              <q-input square filled clearable v-model="password" type="password" label="password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn unelevated color="light-green-9" size="lg" class="full-width" label="Login" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
             <p class="text-blue-10" id="register" @click="this.$emit('register')">Create an Account</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
</template>

<script>
export default {

  data(){
    return {
      email: '',
      password: ''
    }
  }
}
</script>

<style>
#register{
    color: cyan;
    font-style:bold;
    cursor:pointer;
}
.q-card {
  width: 360px;
}
</style>