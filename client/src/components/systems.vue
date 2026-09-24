<template>
  <div class="sys-wrap">
    <h5 class="sys-title">Rewriting systems</h5>

    <div v-if="systems.length === 0" class="sys-empty">
      No rewriting system yet. Create one to start editing, or load one from a .txt file.
    </div>
    <table v-else class="sys-table">
      <thead>
        <tr><th>Name</th><th>Status</th><th>Rules</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="s in systems" :key="s.id" :class="{ 'sys-current': s.id === currentId }">
          <td>
            <input class="sys-input" :value="s.name" @change="$emit('rename', { id: s.id, name: $event.target.value })" />
            <span v-if="s.id === currentId" class="sys-badge">open</span>
          </td>
          <td>
            <span class="sys-status" :class="status(s).full ? 'sys-full' : 'sys-partial'">
              {{ status(s).full ? 'fully defined' : 'partially defined' }}
            </span>
            <span class="sys-detail">{{ status(s).validated }}/{{ status(s).inclusions }} inclusions validated</span>
          </td>
          <td class="sys-count">{{ status(s).rules }}</td>
          <td class="sys-actions">
            <q-btn dense flat label="Open" @click="$emit('open', s.id)" />
            <q-btn v-if="status(s).full" dense flat color="green-9" label="Playground" @click="$emit('playground', s.id)" />
            <q-btn dense flat label="Save .txt" @click="$emit('save', s.id)" />
            <q-btn dense flat label="Delete" @click="remove(s)" />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="sys-new">
      <input class="sys-input" v-model="newName" placeholder="Name of the new system" @keyup.enter="create" />
      <q-btn color="blue-grey-8" label="New rewriting system" @click="create" />
      <q-btn outline color="blue-grey-8" label="Load from .txt" @click="pickFile" />
    </div>

    <div v-if="pending" class="sys-new">
      <span>Name for the loaded system:</span>
      <input class="sys-input" v-model="pending.name" @keyup.enter="confirmPending" />
      <q-btn color="blue-grey-8" label="Add" @click="confirmPending" />
      <q-btn flat label="Cancel" @click="pending = null" />
    </div>
    <div v-if="error" class="sys-error">{{ error }}</div>
  </div>
</template>

<style>
.sys-wrap { max-width: 760px; margin: 24px auto; padding: 0 12px; }
.sys-title { margin: 0 0 12px 0; }
.sys-empty { color: #555; margin-bottom: 16px; }
.sys-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; background: #fff; }
.sys-table th, .sys-table td { border-bottom: 1px solid #d5d9dd; padding: 6px 8px; text-align: left; }
.sys-current { background: #eef2f6; }
.sys-count { width: 70px; }
.sys-actions { text-align: right !important; white-space: nowrap; }
.sys-input { border: 1px solid #b8bec4; border-radius: 4px; padding: 5px 8px; min-width: 220px; }
.sys-status { font-weight: bold; }
.sys-full { color: #117733; }
.sys-partial { color: #B8860B; }
.sys-detail { display: block; font-size: 12px; color: #666; }
.sys-badge { margin-left: 8px; font-size: 12px; color: #117733; }
.sys-new { display: flex; gap: 8px; align-items: center; margin-top: 10px; flex-wrap: wrap; }
.sys-error { color: #882255; margin-top: 8px; }
</style>

<script>
var library = require('../js/util/library.js')
export default {
  props: {
    systems: { type: Array, default: () => [] },
    currentId: { type: String, default: null }
  },
  data () {
    return { newName: '', pending: null, error: '' }
  },
  methods: {
    status (s) {
      return library.status(s.json)
    },
    create () {
      this.error = ''
      this.$emit('create', this.newName.trim() || 'System ' + (this.systems.length + 1))
      this.newName = ''
    },
    remove (s) {
      if (window.confirm('Delete the rewriting system "' + s.name + '"?')) this.$emit('remove', s.id)
    },
    pickFile () {
      this.error = ''
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.txt,.json,text/plain'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
          try {
            const text = ev.target.result.replace(/(?:\\[r,n])+/g, '')
            const content = JSON.parse(text)
            if (content.rs === undefined || content.edgesInCyList === undefined) throw new Error('bad format')
            this.pending = { json: text, name: content.name || file.name.replace(/\.[^.]*$/, '') }
          } catch (err) {
            this.error = 'This file is not a rewriting system saved by the editor.'
          }
        }
        reader.readAsText(file, 'UTF-8')
      }
      input.click()
    },
    confirmPending () {
      this.$emit('add', { name: this.pending.name.trim() || 'Untitled', json: this.pending.json })
      this.pending = null
    }
  }
}
</script>
