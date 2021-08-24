<template>
    <q-toolbar class="bg-purple text-white  shadow-2 ">
      <q-btn @click="home" flat > GT WebEditor</q-btn>
      <q-space></q-space>

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->
      <q-tabs v-model="tab" shrink>
        <q-tab v-on:click="home" name="GlobalVue" label="Global Vue"></q-tab>
        <q-tab v-on:click="" name="Memory" label="My RuleSets "></q-tab>
        <q-tab v-on:click="this.$emit('login')" name="User" >{{ login }}</q-tab>
      </q-tabs>
    </q-toolbar>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    home(){
      this.$emit("home");
    }
  },
  computed: {
    login(){
      if(this.$store.state.logged) return "Hi "+this.$store.state.username+" !";
      else return "Log In "
    }
  }
}
</script>
