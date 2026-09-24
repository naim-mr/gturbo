<template>
  <div class="pg-wrap">
    <div class="pg-head">
      <q-btn flat label="Back" @click="$emit('back')" />
      <span class="pg-title">Playground &mdash; {{ name }}</span>
    </div>
    <div class="pg-help">
      Ctrl + click adds a node. Drag the handle that appears above a node onto another node
      (or the same one) to add an edge. Delete removes the selection.
    </div>

    <div class="pg-bar">
      <label>Steps <input class="pg-steps" type="number" min="1" max="10" :value="steps"
                          @change="$emit('update:steps', Math.max(1, Math.min(10, parseInt($event.target.value) || 1)))" /></label>
      <q-btn color="blue-grey-8" label="Run" :loading="running" @click="$emit('run')" />
      <label>Layout
        <select :value="layout" @change="$emit('layout', $event.target.value)">
          <option value="cose">force-directed</option>
          <option value="breadthfirst">layers</option>
          <option value="circle">circle</option>
          <option value="grid">grid</option>
        </select>
      </label>
    </div>

    <div v-if="error" class="pg-error">
      {{ error }}
      <ul v-if="details.length"><li v-for="(d, i) in details" :key="i">{{ d }}</li></ul>
    </div>

    <div class="pg-windows">
      <div class="pg-cell">
        <div class="pg-cap">Input graph</div>
        <div id="pgcomp"></div>
      </div>
      <div class="pg-cell">
        <div class="pg-cap">Result<span v-if="stepCount"> &mdash; step {{ cur + 1 }} / {{ stepCount }}
          ({{ info }})</span></div>
        <div id="pgresult"></div>
        <div v-if="stepCount" class="pg-steprow">
          <input type="range" min="0" :max="stepCount - 1" :value="cur"
                 @input="$emit('step', parseInt($event.target.value))" />
          <q-btn dense outline color="blue-grey-8" label="Use as input" @click="$emit('useAsInput')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pg-wrap { max-width: 1300px; margin: 16px auto; padding: 0 12px; }
.pg-head { display: flex; align-items: center; gap: 12px; }
.pg-title { font-weight: bold; color: #2b3a4a; }
.pg-help { color: #555; margin: 8px 0; }
.pg-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
.pg-steps { width: 60px; border: 1px solid #b8bec4; border-radius: 4px; padding: 4px 6px; }
.pg-error { color: #882255; margin-bottom: 8px; }
.pg-error ul { margin: 4px 0 0 0; }
.pg-windows { display: flex; gap: 12px; }
.pg-cell { flex: 1; min-width: 0; }
.pg-cap { font-weight: bold; margin-bottom: 2px; }
.pg-steprow { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
.pg-steprow input { flex: 1; }
#pgcomp, #pgresult {
  height: 520px;
  border: 1px solid black;
  border-radius: 6px;
  background: #e5e7e6;
  box-shadow: 3px 3px 3px 3px #798a83;
}
</style>

<script>
export default {
  props: {
    name: { type: String, default: '' },
    steps: { type: Number, default: 3 },
    running: { type: Boolean, default: false },
    layout: { type: String, default: 'cose' },
    error: { type: String, default: '' },
    details: { type: Array, default: () => [] },
    stepCount: { type: Number, default: 0 },
    cur: { type: Number, default: 0 },
    info: { type: String, default: '' }
  }
}
</script>
