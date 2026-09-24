<template>
<div id="app"  class=" full-width full-height">
   <navbar :active="activeTab" @systems="showSystems" @home="home" @rulesSet="showRulesSet"/>
   <div class="comp" v-show="view === 'systems'">
     <systems :systems="library.systems" :currentId="library.currentId"
              @create="createSystem" @open="openSystem" @rename="renameSystem"
              @remove="deleteSystem" @save="saveFile" @add="addSystem" @playground="openPlayground"/>
   </div>
   <div class="comp" v-show="view === 'playground'">
     <playground :name="pgName" :steps="pgSteps" :running="pgRunning" :layout="pgLayout"
                 :error="pgError" :details="pgDetails" :stepCount="pgStepCount" :cur="pgCur" :info="pgInfo"
                 @back="showSystems" @update:steps="pgSteps = $event" @run="runPlayground"
                 @layout="setPgLayout" @step="showPgStep" @useAsInput="pgUseAsInput"/>
   </div>
   <div class="comp" v-show="view === 'rulesSet'">
     <rulesSet :rules="ruleList" @rename="renameRule" @open="openRule"/>
   </div>
   <div class="comp" v-show="view === 'global'"> <global :name="currentName" @save="saveFile(library.currentId)" @initRsc="initRsc" /></div>
   <div class="comp" v-show="view === 'rule'" ><rules @back="back" /></div>
   <div class="comp" v-show="view === 'inc'" ><inclusion :validated="incValidated" :message="incMessage" :sub="incSub" :over="incOver" @backInc="backInc" @validateInc="validateInc"/></div>
   <div class="comp" v-show="view === 'autoInc'" ><rulesAuto :count="autoCount" :cur="autoCur" :validated="incValidated" :rule="incSub" @backAuto="backAuto" @select="selectAuto" @validateAuto="validateAuto"/></div>
</div>

</template>
<style>
html,body{
  height:auto;
  width:auto;
  
}
body{
  background-color:#f4f5f7
}
.comp {
    margin:auto;
}
#saveB {
    border:
}
 #app{
  height:auto;
  width:auto;
 }

</style>
<script>
import global from './views/GlobalView.vue'
import rulesAuto from './views/RulesAuto.vue'
import rules from './views/Rules.vue'
import inclusion from './views/Inclusions.vue'
import { markRaw } from 'vue'
import navbar from './components/navbar.vue'
import systems from './components/systems.vue'
import rulesSet from './components/rulesSet.vue'
import playground from './components/playground.vue'

var { RuleSystemComponent } = require('./js/vc/RuleSystemComponent')
var { RuleSystem, RuleSystemObserver } = require('./js/model/RuleSystem')
var { Playground, ResultView } = require('./js/vc/Playground')
var { buildPayload, runTransform } = require('./js/util/transform.js')
var library = require('./js/util/library.js')
var FileSaver = require('./js/util/FileSaver')

export default {
  components: {
    navbar,
    global,
    rules,
    rulesAuto,
    inclusion,
    systems,
    rulesSet,
    playground
  },
  name: 'App',

  data () {
    return {
      RuleSysObserver: class extends RuleSystemObserver {
        constructor (rsc, app) {
          super(rsc)
          this.app = app
        }

        on_editRule (id) {
          this.app.returnTo = null
          this.app.setView('rule')
        }

        on_editInclusion (id) {
          this.app.setView('inc')
          const ric = this.app.rsc.ric
          this.app.setIncRules(id)
          this.app.incValidated = this.app.rsc.rs.inclusions[id].validated
          this.app.incMessage = ''
          ric.onChange = () => {
            this.app.incValidated = false
            this.app.incMessage = ''
          }
          // the windows are only measurable once displayed
          this.app.$nextTick(() => this.app.rsc.fitInclusion())
        }

        on_editAutoInclusion (id) {
          this.app.setView('autoInc')
          this.app.setIncRules(id)
          const aic = this.app.rsc.aic
          this.app.autoCount = aic.rule.rgraphI.length
          this.app.autoCur = aic.curR
          this.app.incValidated = this.app.rsc.rs.inclusions[id].validated
          // the windows are only measurable once displayed
          this.app.$nextTick(() => aic.fit())
        }
      },

      rsc: null,
      rscObs: null,
      // the drawing window of a fully defined system, and the system it belongs to
      pg: null,
      pgSystemId: null,
      pgView: null,
      pgSteps: 3,
      pgRunning: false,
      pgLayout: 'cose',
      pgError: '',
      pgDetails: [],
      pgStepCount: 0,
      pgCur: 0,
      pgInfo: '',
      // 'systems', 'global', 'rulesSet', 'playground', 'rule', 'inc' or 'autoInc'
      view: 'systems',
      // the rewriting systems of the user; the current one is open in the editor
      library: { systems: [], currentId: null },
      pendingJson: null,
      ruleList: [],
      // tab to go back to from the rule editor (null: the global view)
      returnTo: null,
      incValidated: false,
      incMessage: '',
      incSub: '',
      incOver: '',
      autoCount: 0,
      autoCur: 0
    }
  },
  computed: {
    activeTab () {
      if (this.view === 'playground') return 'systems'
      if (this.view === 'systems' || this.view === 'rulesSet') return this.view
      return 'global'
    },
    pgName () {
      const s = this.library.systems.find(s => s.id === this.pgSystemId)
      return s ? s.name : ''
    },
    currentName () {
      const s = this.library.systems.find(s => s.id === this.library.currentId)
      return s ? s.name : ''
    }
  },
  created () {
    this.library = library.load()
    const current = this.library.systems.find(s => s.id === this.library.currentId)
    if (current) {
      this.pendingJson = current.json
      this.view = 'global'
    }
    // the current edit survives a page reload
    this.autosave = setInterval(() => { this.flushCurrent(); this.flushPlayground() }, 1500)
    window.addEventListener('beforeunload', () => { this.flushCurrent(); this.flushPlayground() })
  },
  beforeUnmount () {
    clearInterval(this.autosave)
  },
  methods: {
    setView (v) {
      this.view = v
      // a window created while hidden has no size: measure it once shown
      this.$nextTick(() => {
        if (this.rsc) this.rsc.resizeWindows(v)
        if (v === 'playground' && this.pg) {
          this.pg.resize()
          this.pgView.resize()
        }
      })
    },

    // ---- the editor of the current system
    initRsc () {
      if (this.rsc != null) return
      // markRaw: the editor is plain objects talking to each other; making them
      // reactive slows every access and makes the same rule appear as two objects
      this.rsc = markRaw(new RuleSystemComponent(new RuleSystem()))
      this.rscObs = new this.RuleSysObserver(this.rsc, this)
      if (this.pendingJson) {
        try {
          this.rsc.loadJSON(JSON.parse(this.pendingJson))
        } catch (e) {
          console.error('Could not load the rewriting system', e)
        }
      }
      this.pendingJson = null
    },
    destroyRsc () {
      if (this.rsc) this.rsc.destroy()
      this.rsc = null
      this.rscObs = null
    },

    // ---- library
    persist () {
      library.save(this.library)
    },
    // copy the edit in progress into the library
    flushCurrent () {
      if (this.rsc == null || this.library.currentId == null) return
      const entry = this.library.systems.find(s => s.id === this.library.currentId)
      if (!entry) return
      try {
        const json = JSON.stringify(this.rsc.toJSON())
        if (json !== entry.json) {
          entry.json = json
          this.persist()
        }
      } catch (e) {
        console.error('Could not save the current system', e)
      }
    },
    // ---- playground
    flushPlayground () {
      if (this.pg == null) return
      const entry = this.library.systems.find(s => s.id === this.pgSystemId)
      if (!entry) return
      const json = this.pg.toJSON()
      if (json !== entry.playground) {
        entry.playground = json
        this.persist()
      }
    },
    destroyPlayground () {
      this.flushPlayground()
      if (this.pg) this.pg.destroy()
      if (this.pgView) this.pgView.destroy()
      this.pg = null
      this.pgView = null
      this.pgSystemId = null
      this.pgStepCount = 0
      this.pgError = ''
      this.pgDetails = []
    },
    // only a fully defined system can be played with
    openPlayground (id) {
      const entry = this.library.systems.find(s => s.id === id)
      if (!entry || !library.status(entry.json).full) return
      this.flushCurrent()
      this.destroyPlayground()
      this.pgSystemId = id
      this.pg = markRaw(new Playground('pgcomp', entry.playground || null))
      this.pgView = markRaw(new ResultView('pgresult'))
      this.setView('playground')
    },

    // apply the rewriting system to the drawn graph, on the server
    async runPlayground () {
      const entry = this.library.systems.find(s => s.id === this.pgSystemId)
      if (!entry || this.pgRunning) return
      if (entry.id === this.library.currentId) this.flushCurrent()
      this.pgRunning = true
      this.pgError = ''
      this.pgDetails = []
      try {
        const { payload, names } = buildPayload(entry.json, this.pg.toJSON(), this.pgSteps)
        const res = await runTransform(payload, names)
        // the steps can be big: keep them out of the reactive state
        this.pgSteps_ = Object.freeze(res.steps)
        this.pgStepCount = res.steps.length
        this.showPgStep(res.steps.length - 1)
      } catch (e) {
        this.pgStepCount = 0
        this.pgError = e.message || String(e)
        this.pgDetails = e.details || []
        if (!e.details) console.error(e)
      } finally {
        this.pgRunning = false
      }
    },
    showPgStep (i) {
      const step = this.pgSteps_[i]
      this.pgCur = i
      this.pgInfo = step.nodes.length + ' nodes, ' + step.edges.length + ' edges'
      this.pgView.show(step, this.pgLayout)
    },
    setPgLayout (name) {
      this.pgLayout = name
      if (this.pgStepCount) this.showPgStep(this.pgCur)
    },
    // the result becomes the drawing, to transform it again
    pgUseAsInput () {
      const json = this.pgView.toGraphJSON()
      this.pg.destroy()
      this.pg = markRaw(new Playground('pgcomp', json))
      this.pgStepCount = 0
      this.pgError = ''
      this.$nextTick(() => this.pg.resize())
    },

    openSystem (id) {
      const entry = this.library.systems.find(s => s.id === id)
      if (!entry) return
      this.flushCurrent()
      this.destroyRsc()
      this.library.currentId = id
      this.pendingJson = entry.json
      this.initRsc()
      this.persist()
      this.setView('global')
    },
    createSystem (name) {
      const id = library.newId()
      this.library.systems.push({ id, name: library.uniqueName(this.library, name), json: null })
      this.openSystem(id)
    },
    addSystem ({ name, json }) {
      this.library.systems.push({ id: library.newId(), name: library.uniqueName(this.library, name), json })
      this.persist()
    },
    renameSystem ({ id, name }) {
      const entry = this.library.systems.find(s => s.id === id)
      if (!entry) return
      entry.name = library.uniqueName(this.library, name, id)
      this.persist()
    },
    deleteSystem (id) {
      if (id === this.pgSystemId) this.destroyPlayground()
      const wasCurrent = id === this.library.currentId
      this.library.systems = this.library.systems.filter(s => s.id !== id)
      if (wasCurrent) {
        this.destroyRsc()
        this.library.currentId = null
        this.pendingJson = null
        this.initRsc()
      }
      this.persist()
    },
    // download a system as a .txt file
    saveFile (id) {
      const entry = this.library.systems.find(s => s.id === id)
      if (!entry) return
      if (id === this.library.currentId) this.flushCurrent()
      let content = { rs: null, edgesInCyList: [], edgesInGraphList: [] }
      try { if (entry.json) content = JSON.parse(entry.json) } catch (e) {}
      content.name = entry.name
      const blob = new Blob([JSON.stringify(content)], { type: 'text/plain;charset=utf-8' })
      FileSaver.saveAs(blob, entry.name.replace(/[^\w.-]+/g, '_') + '.txt')
    },

    // ---- tabs
    showSystems () {
      this.returnTo = null
      this.flushCurrent()
      this.flushPlayground()
      this.setView('systems')
    },
    home () {
      this.returnTo = null
      if (this.library.currentId == null) this.setView('systems')
      else this.setView('global')
    },
    showRulesSet () {
      if (this.library.currentId == null || this.rsc == null) {
        this.setView('systems')
        return
      }
      this.ruleList = this.rsc.ruleSummaries()
      this.setView('rulesSet')
    },
    renameRule ({ id, name }) {
      this.rsc.setRuleName(id, name)
      this.ruleList = this.rsc.ruleSummaries()
    },
    openRule (id) {
      this.rsc.globalView.notify('on_editRule', id)
      this.returnTo = 'rulesSet'
    },

    back () {
      const to = this.returnTo
      this.returnTo = null
      this.rsc.updateInclusion()
      if (to === 'rulesSet') this.showRulesSet()
      else this.setView('global')
    },
    backInc () {
      this.setView('global')
      this.rsc.stylized(this.rsc.ric.cur)
    },

    // ids of the source and target rules of an inclusion, for the captions
    setIncRules (id) {
      const rules = this.rsc.rs.rules
      const inc = this.rsc.rs.inclusions[id]
      this.incSub = Object.keys(rules).find(k => rules[k] === inc.sub)
      this.incOver = Object.keys(rules).find(k => rules[k] === inc.over)
    },
    validateInc () {
      const missing = this.rsc.validateInclusion()
      if (missing == null) {
        this.incValidated = true
        this.incMessage = ''
        this.backInc()
        return
      }
      const parts = []
      if (missing.lhsNodes) parts.push(missing.lhsNodes + ' lhs node(s)')
      if (missing.lhsEdges) parts.push(missing.lhsEdges + ' lhs edge(s)')
      if (missing.rhsNodes) parts.push(missing.rhsNodes + ' rhs node(s)')
      if (missing.rhsEdges) parts.push(missing.rhsEdges + ' rhs edge(s)')
      this.incMessage = 'Incomplete inclusion, still to bind: ' + parts.join(', ')
    },
    // choose the rhs automorphism the current generator is sent to
    selectAuto (i) {
      this.rsc.goToRight(i)
      this.autoCur = i
      this.incValidated = false
      this.$nextTick(() => this.rsc.aic.rgcI.fit())
    },
    validateAuto () {
      this.rsc.confirmAuto()
      this.backAuto()
    },
    backAuto () {
      this.rsc.stylized(this.rsc.aic.incId)
      this.home()
    }
  }
}

</script>
