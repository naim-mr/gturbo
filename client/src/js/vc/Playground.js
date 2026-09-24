var { Graph } = require('../model/Graph')
var { GraphComponent } = require('./GraphComponent')
var cytoscape = require('cytoscape')
var { nodeRanks } = require('../util/numbering.js')

// A free window where the user draws the graph a rewriting system will be applied to.
class Playground {
  // idComp: id of the html div holding the window; json: a previously saved drawing
  constructor (idComp, json) {
    this.graph = json ? Graph.ofJSON(json, (d) => d, (d) => d) : new Graph()
    this.gc = new GraphComponent(this.graph, idComp, true)
    if (json) {
      for (const e of Object.keys(this.graph.edges)) {
        this.gc.edgesInCy[e] = 'e' + e
        this.gc.edgesInGraph['e' + e] = parseInt(e)
      }
      this.gc.reloadCy()
    }
  }

  toJSON () {
    return this.graph.toJSON((d) => d, (d) => d)
  }

  resize () {
    this.gc.cy.resize()
  }

  destroy () {
    this.gc.mouseover = false
    this.gc.ctrlKey = false
    // the document keeps the listeners of the window: make them harmless
    this.gc.onDelete = () => {}
    this.gc.onClick = () => {}
    try { this.gc.cy.destroy() } catch (e) {}
  }
}

// Read-only window showing a graph computed by the server, laid out automatically.
class ResultView {
  constructor (idComp) {
    this.cy = cytoscape({
      container: document.getElementById(idComp),
      maxZoom: 1.5,
      style: [
        { selector: 'node', style: { 'background-color': '#6699CC', width: 14, height: 14, 'font-size': 10, label: 'data(label)' } },
        { selector: 'edge', style: { 'curve-style': 'bezier', 'target-arrow-shape': 'none', 'line-color': '#888', width: 1.5 } }
      ],
      elements: { nodes: [], edges: [] }
    })
    this.step = null
  }

  // step: { nodes: [ids], edges: [{src, dst}] }
  show (step, layout) {
    this.step = step
    const cy = this.cy
    cy.resize()
    cy.remove(cy.elements())
    const graph = { nodes: {}, edges: {} }
    step.nodes.forEach((n) => { graph.nodes[n] = {} })
    step.edges.forEach((e, i) => { graph.edges[i] = e })
    const ranks = nodeRanks(graph)
    const labelled = step.nodes.length <= 60
    step.nodes.forEach((n) => {
      cy.add({ group: 'nodes', data: { id: 'n' + n, label: labelled ? String(ranks[n]) : '' } })
    })
    step.edges.forEach((e, i) => {
      cy.add({ group: 'edges', data: { id: 'e' + i, source: 'n' + e.src, target: 'n' + e.dst } })
    })
    this.layout(layout)
  }

  // big graphs are too slow for the force-directed layout
  layout (name) {
    const cy = this.cy
    if (cy.nodes().length === 0) return
    let chosen = name || 'cose'
    if (chosen === 'cose' && cy.nodes().length > 400) chosen = 'circle'
    cy.layout({ name: chosen, animate: false, directed: true, fit: true, padding: 30 }).run()
  }

  resize () {
    this.cy.resize()
    this.cy.fit(undefined, 30)
  }

  // the shown graph as a drawing that can be edited (positions included)
  toGraphJSON () {
    const nodes = {}
    const edges = {}
    this.step.nodes.forEach((n) => {
      const p = this.cy.getElementById('n' + n).position()
      nodes[n] = { incoming: [], outgoing: [], data: { x: p.x, y: p.y } }
    })
    this.step.edges.forEach((e, i) => {
      edges[i] = { src: e.src, dst: e.dst, data: {} }
      nodes[e.src].outgoing.push(i)
      nodes[e.dst].incoming.push(i)
    })
    return JSON.stringify({ nodeCpt: this.step.nodes.length, edgeCpt: this.step.edges.length, nodes, edges })
  }

  destroy () {
    try { this.cy.destroy() } catch (e) {}
  }
}

module.exports = { Playground, ResultView }
