<template>
  <div class="rs-wrap">
    <h5 class="rs-title">Rules set</h5>
    <div v-if="rules.length === 0" class="rs-empty">
      This rewriting system has no rule yet. Create one in the global view (Ctrl + click).
    </div>
    <table v-else class="rs-table">
      <thead>
        <tr><th>#</th><th>Name (shown in the global view)</th><th>lhs</th><th>rhs</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="r in rules" :key="r.id">
          <td>{{ r.id }}</td>
          <td><input class="rs-input" :value="r.name" placeholder="unnamed"
                     @change="$emit('rename', { id: r.id, name: $event.target.value.trim() })" /></td>
          <td>{{ r.lhsNodes }} nodes, {{ r.lhsEdges }} edges</td>
          <td>{{ r.rhsNodes }} nodes, {{ r.rhsEdges }} edges</td>
          <td class="rs-actions"><q-btn dense flat label="Open" @click="$emit('open', r.id)" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.rs-wrap { max-width: 760px; margin: 24px auto; padding: 0 12px; }
.rs-title { margin: 0 0 12px 0; }
.rs-empty { color: #555; }
.rs-table { width: 100%; border-collapse: collapse; background: #fff; }
.rs-table th, .rs-table td { border-bottom: 1px solid #d5d9dd; padding: 6px 8px; text-align: left; }
.rs-actions { text-align: right !important; }
.rs-input { border: 1px solid #b8bec4; border-radius: 4px; padding: 5px 8px; min-width: 200px; }
</style>

<script>
export default {
  props: {
    rules: { type: Array, default: () => [] }
  }
}
</script>
