<template>
    <q-toolbar class="text-white shadow-2" style="background:#2b3a4a">
      <q-btn @click="$emit('systems')" flat> GT WebEditor</q-btn>
      <q-space></q-space>
      <q-tabs :model-value="active" shrink>
        <q-tab v-on:click="$emit('systems')" name="systems" label="Rewriting Systems"></q-tab>
        <q-tab v-on:click="$emit('home')" name="global" label="Global Vue"></q-tab>
        <q-tab v-on:click="$emit('rulesSet')" name="rulesSet" label="Rules Set"></q-tab>
      </q-tabs>
    </q-toolbar>
</template>

<script>
export default {
  props: {
    active: { type: String, default: 'systems' }
  }
}
</script>
