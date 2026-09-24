
var { GraphInclusion, GraphInclusionObserver } = require('../model/GraphInclusion')
var { GraphComponent, GraphComponentObserver } = require('./GraphComponent')
var { nodeRanks } = require('../util/numbering.js')

class GraphInclusionComponent {
     static DomComponentObs= class extends GraphComponentObserver {
       constructor (gc, gic) {
         super(gc)
         this.gic = gic
         this.gc = gc
       }

       on_addNode (id) {
         this.gc.cy.getElementById(id).on('click', (event) => {
           this.gic.selectedEle = event.target
           this.gic.selectedEle.addClass('highlight')
         })
       }

       on_addEdge (id) {
         this.gc.cy.getElementById(id).on('click', (event) => {
           this.gic.selectedEle = event.target
           this.gic.selectedEle.addClass('highlight')
         })
       }
     }

      static CodComponentObs= class extends GraphComponentObserver {
        constructor (gc, gic) {
          super(gc)
          this.gic = gic
          this.gc = gc
        }

        on_addNode (id) {
          this.gc.cy.getElementById(id).on('click', (event) => {
            this.gic.codSelectedEle = event.target
            this.gic.codSelectedEle.addClass('highlight')
          })
        }

        on_addEdge (id) {
          this.gc.cy.getElementById(id).on('click', (event) => {
            this.gic.codSelectedEle = event.target
            this.gic.codSelectedEle.addClass('highlight')
          })
        }
      }

      static GraphIObs = class extends GraphInclusionObserver {
        constructor (gic, graphI) {
          super(graphI)
          this.gic = gic
        }

        on_setNode (idx, idy) {
          const nodeDom = this.gic.domComp.cy.getElementById(idx)
          const nodeCod = this.gic.codComp.cy.getElementById(idy)
          nodeCod.style('background-color', nodeDom.style('background-color'))
          nodeCod.addClass('inclusion')
        }

        on_setEdge (idx, idy) {
          const edgeDom = this.gic.domComp.cy.getElementById(this.gic.domComp.edgesInCy[idx])
          const edgeCod = this.gic.codComp.cy.getElementById(this.gic.codComp.edgesInCy[idy])
          edgeCod.style('line-color', edgeDom.style('line-color'))
          edgeCod.style('target-arrow-color', edgeDom.style('target-arrow-color'))
          edgeCod.addClass('inclusion')
        }

        on_unsetNode (idx, idy) {
          const nodeCod = this.gic.codComp.cy.getElementById(idy)
          nodeCod.style({ 'background-color': '' })
          nodeCod.removeClass('inclusion')
        }

        on_unsetEdge (idx, idy) {
          const edgeCod = this.gic.codComp.cy.getElementById(this.gic.codComp.edgesInCy[idy])
          edgeCod.style({ 'line-color': '', 'target-arrow-color': '' })
          edgeCod.removeClass('inclusion')
        }
      }

      constructor (graphI, idComp,editable) {
        this.selectedEle = null
        this.graphI = graphI
        this.graphIobs = new GraphInclusionComponent.GraphIObs(this, graphI)
        this.domComp = new GraphComponent(graphI.dom, idComp[0],false)
        this.codComp = new GraphComponent(graphI.cod, idComp[1],false)
        new GraphInclusionComponent.DomComponentObs(this.domComp, this)
        new GraphInclusionComponent.CodComponentObs(this.codComp, this)

       if(editable){
          this.codComp.cy.on('click', 'node', (event) => {
            const id = parseInt(event.target.id())
            if (event.target.hasClass('inclusion')) {
              this.graphI.unsetNode(this.graphI.nodeInvMap[id])
              event.target.removeClass('inclusion')
              event.target.unselect()
            } else if (this.selectedEle != null && this.selectedEle.isNode()) {
              this.graphI.setNode(this.selectedEle.id(), id)
              this.lastInclusion = event.target
              this.clearSelection()
            }
            this.changed()
          })
          this.codComp.cy.on('click', 'edge', (event) => {
            const id = event.target.id()
            if (event.target.hasClass('inclusion')) {
              this.graphI.unsetEdge(this.graphI.edgeInvMap[this.codComp.edgesInGraph[id]])
              event.target.removeClass('inclusion')
              event.target.unselect()
            } else if (this.selectedEle != null && this.selectedEle.isEdge()) {
              this.graphI.setEdge(this.domComp.edgesInGraph[this.selectedEle.id()], this.codComp.edgesInGraph[id])
              this.clearSelection()
            }
            this.changed()
          })
        }
      }

      destructor () {
        this.graphI.unregister(this.graphIobs)
      }

      updateComponent (graphI) {
        this.destructor()
        this.graphI = graphI
        this.domComp.updateGraph(graphI.dom)
        this.codComp.updateGraph(graphI.cod)
        this.graphIobs = new GraphInclusionComponent.GraphIObs(this, graphI)
      }

      updateEdgesMap (edgesInCy, edgesInGraph, over) {
        if (over) this.codComp.updateEdgesMap(edgesInCy, edgesInGraph)
        else this.domComp.updateEdgesMap(edgesInCy, edgesInGraph)
      }

      removeEles () {
        this.domComp.cy.remove(this.domComp.cy.elements(''))
        this.codComp.cy.remove(this.codComp.cy.elements(''))
        this.selectedEle = null
      }

      // hook used by the owner to know that the user changed a binding
      changed () {
        if (this.onChange) this.onChange()
      }

      clearSelection () {
        if (this.selectedEle != null) this.selectedEle.removeClass('highlight')
        this.selectedEle = null
      }

      // center and scale both graphs in their (visible) window
      fit () {
        this.domComp.fit()
        this.codComp.fit()
      }

      printNewInclusion () {
        this.loadInclusion()
      }

      // Draws dom and cod. Every dom element gets its own color; the cod
      // element it is bound to gets the same one.
      loadInclusion () {
        const dom = this.graphI.dom
        const cod = this.graphI.cod
        this.domComp.inc = true
        this.codComp.inc = true
        this.selectedEle = null
        this.codSelectedEle = null
        initEdgeMaps(this.domComp, dom)
        initEdgeMaps(this.codComp, cod)

        const domRanks = nodeRanks(dom)
        const codRanks = nodeRanks(cod)
        const addNode = (comp, g, ranks, id, onClick) => {
          const ele = comp.cy.add({
            group: 'nodes',
            data: { id: String(id) },
            position: { x: g.nodes[id].data.x || 0, y: g.nodes[id].data.y || 0 }
          })
          ele.style('label', String(ranks[id]))
          ele.on('click', onClick)
          return ele
        }
        const addEdge = (comp, g, id, onClick) => {
          const ele = comp.cy.add({
            group: 'edges',
            data: {
              id: comp.edgesInCy[id],
              source: String(g.edges[id].src),
              target: String(g.edges[id].dst)
            }
          })
          ele.on('click', onClick)
          return ele
        }
        const selectDom = (event) => {
          this.selectedEle = event.target
          this.selectedEle.addClass('highlight')
        }
        const selectCod = (event) => {
          this.codSelectedEle = event.target
          this.codSelectedEle.addClass('highlight')
        }

        let k = 0
        for (const node of Object.keys(dom.nodes)) {
          addNode(this.domComp, dom, domRanks, node, selectDom).style('background-color', PALETTE[k++ % PALETTE.length])
        }
        for (const edge of Object.keys(dom.edges)) {
          const color = PALETTE[k++ % PALETTE.length]
          addEdge(this.domComp, dom, edge, selectDom).style({ 'line-color': color, 'target-arrow-color': color })
        }
        for (const node of Object.keys(cod.nodes)) addNode(this.codComp, cod, codRanks, node, selectCod)
        for (const edge of Object.keys(cod.edges)) addEdge(this.codComp, cod, edge, selectCod)

        for (const node of Object.keys(this.graphI.nodeMap)) {
          const target = this.codComp.cy.getElementById(String(this.graphI.nodeMap[node]))
          if (target.length === 0) continue
          target.style('background-color', this.domComp.cy.getElementById(String(node)).style('background-color'))
          target.addClass('inclusion')
        }
        for (const edge of Object.keys(this.graphI.edgeMap)) {
          const target = this.codComp.cy.getElementById(this.codComp.edgesInCy[this.graphI.edgeMap[edge]])
          if (target.length === 0) continue
          const source = this.domComp.cy.getElementById(this.domComp.edgesInCy[edge])
          target.style({
            'line-color': source.style('line-color'),
            'target-arrow-color': source.style('target-arrow-color')
          })
          target.addClass('inclusion')
        }
      }
}

// Paul Tol's muted qualitative scheme (colour-blind safe), then three more
// muted hues; sober enough for a paper, still easy to tell apart
const PALETTE = ['#CC6677', '#332288', '#DDCC77', '#117733', '#88CCEE', '#882255',
  '#44AA99', '#999933', '#AA4499', '#661100', '#6699CC', '#AA4466']

// Edge ids of the two windows are derived from the model ids ('e' + id), so
// they never depend on the maps kept by the rule editors.
function initEdgeMaps (comp, g) {
  comp.edgesInCy = {}
  comp.edgesInGraph = {}
  for (const e of Object.keys(g.edges)) {
    comp.edgesInCy[e] = 'e' + e
    comp.edgesInGraph['e' + e] = parseInt(e)
  }
}

module.exports = { GraphInclusionComponent }
