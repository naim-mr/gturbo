
var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('../model/Graph')
var cytoscape = require('cytoscape')
var edgehandles = require('cytoscape-edgehandles')
var options = require('./defaultcxt.js')
cytoscape.use(edgehandles)

class GraphComponentObserver extends Observer {
  constructor (g) {
    super(g)
  }

  on_update () {};
  on_addNode (id) {};
  on_addEdge (id) {};
}

class GraphComponent extends Observable {
    static GraphObs = class extends GraphObserver {
      constructor (gc, g) {
        super(g)
        this.gc = gc
      }

      on_addNode (idn) {
        this.gc.cy.add({
          group: 'nodes',
          position: {},
          data: { id: idn }
        })
      }

      on_updateNode (idn, data) {
        const node = this.gc.cy.getElementById(idn)
        node.position(data)
      }

      on_addEdge (ide, src, dest) {
        let isInCyto = true

        if (this.gc.edgesInCy[ide] == undefined) isInCyto = false
        if (!isInCyto) {
          const idC = this.gc.cy.add({ group: 'edges', data: { source: src, target: dest } })
          this.gc.edgesInCy[ide] = idC.id()
          this.gc.edgesInGraph[idC.id()] = ide
        }
      }

      on_removeEdge (id) {
        this.gc.cy.remove(this.gc.cy.getElementById(this.gc.edgesInCy[id]))
      }

      on_removeNode (id) {
        this.gc.cy.remove(this.gc.cy.getElementById(id))
        this.gc.notify('on_update')
      }
    }

    // g in Graph
    constructor (g, idComp, fixed) {
      super()
      this.updateGraph(g)

      this.edgesInCy = {}
      this.edgesInGraph = {}
      this.lastClick = {}
      this.mouseover = false
      this.ctrlKey = false
      this.cy = cytoscape({
        zoomEnabled: false,
        container: document.getElementById(idComp),
        layout: {
          name: 'grid',
          rows: 2,
          cols: 2
        },
        style: [{
          selector: 'node',
          style: {

          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        },
        {
          selector: '.eh-handle',
          style: {
            'background-color': 'red',
            width: 12,
            height: 12,
            shape: 'ellipse',
            'overlay-opacity': 0,
            'border-opacity': 0
          }
        },
        {
          selector: '.eh-hover',
          style: {
            'border-color': 'red'
          }
        },
        {
          selector: '.eh-source',
          style: {
            'border-width': 2,
            'border-color': 'red'
          }
        },
        {
          selector: '.eh-target',
          style: {
            'border-width': 2,
            'border-color': 'red'
          }
        },
        {
          selector: '.highlight',
          style: {
            'overlay-color': 'rgb(131, 131, 131)',
            'overlay-opacity': '0.4'
          }
        },
        {
          selector: '.highlight2',
          style: {
            'overlay-color': 'rgb(131, 131, 131)',
            'overlay-opacity': '0.4'
          }
        },
        {
          selector: '.eh-preview, .eh-ghost-edge',
          style: {
          }
        },
        {
          selector: '.eh-ghost-edge.eh-preview-active',
          style: {
            opacity: 0
          }
        }

        ],
        elements: {
          nodes: [],
          edges: []
        }
      })

      this.cy.zoomingEnabled(false)
      this.eh = this.cy.edgehandles(options)
      this.eh.enableDrawMode()
      if (fixed == undefined || !fixed) this.addListener(idComp)
    }

    deleteEdges () {
      this.edgesInCy = {}
      this.edgesInGraph = {}
    }

    destroyObserver () {}
    updateGraph (graph) {
      this.graph = graph
      this.graphObs = new GraphComponent.GraphObs(this, graph)
    }

    updateEdgesMap (edgesInCy, edgesInGraph) {
      this.edgesInCy = edgesInCy
      this.edgesInGraph = edgesInGraph
    }

    onDelete () {
      for (let i = 0; i < this.cy.edges('').length; i++) {
        if (this.cy.edges('')[i].selected()) {
          this.graph.removeEdge(this.edgesInGraph[this.cy.edges('')[i].id()])
        }
      }
      for (let i = 0; i < this.cy.nodes('').length; i++) {
        if (this.cy.nodes('')[i].selected()) {
          this.graph.removeNode(this.cy.nodes('')[i].id())
        }
      }
    }

    onDelete () {
      for (let i = 0; i < this.cy.edges('').length; i++) {
        if (this.cy.edges('')[i].selected()) {
          this.graph.removeEdge(this.edgesInGraph[this.cy.edges('')[i].id()])
        }
      }
      for (let i = 0; i < this.cy.nodes('').length; i++) {
        if (this.cy.nodes('')[i].selected()) {
          this.graph.removeNode(this.cy.nodes('')[i].id())
        }
      }
    }

    addListener (idComp) {
      this.cy.on('mouseover', 'node', (event) => {
        const ele = event.target
        ele.addClass('highlight2')
      })
      this.cy.on('mouseout', 'node', (event) => {
        const ele = event.target
        ele.removeClass('highlight2')
      })
      this.cy.on('mouseover', 'edge', (event) => {
        const ele = event.target
        ele.addClass('highlight2')
      })
      this.cy.on('mouseout', 'edge', (event) => {
        const ele = event.target
        ele.removeClass('highlight2')
      })
      document.addEventListener('keydown', (event) => {
        if (this.mouseover) {
          if (event.ctrlKey) {
            this.ctrlKey = true
          } else if (event.key == 'Alt') {
            // this.eh.disableDrawMode();
          } else if (event.key == 'Delete') {
            this.onDelete()
          }
          /* if (event.key === 'c' &&  event.ctrlKey) {
                                this.selectedEles = this.cy.$(':selected');
                        } else if (event.key == 'v' && this.selectedEles != {} && this.lastClick!={}) {
                                this.onPaste()
                        } */
        }
      })
      document.getElementById(idComp).addEventListener('mouseover', (event) => {
        this.mouseover = true
      })
      document.getElementById(idComp).addEventListener('mouseout', (event) => {
        this.mouseover = false
        this.ctrlKey = false
      })

      document.addEventListener('keyup', (event) => {
        if (this.mouseover) {
          if (event.ctrlKey) {
            this.ctrlKey = false
          } else if (event.key == 'Alt') {
            //     this.eh.enableDrawMode();
          }
        }
      })
      this.cy.on('click', (event) => {
        for (let i = 0; i < this.cy.elements('').length; i++) {
          const e = this.cy.elements('')[i]
          if (event.target != e && e.hasClass('highlight'))e.removeClass('highlight')
        }

        this.onClick(event)
      })

      this.cy.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
        if (!this.inc) {
          this.edgesInCy[this.graph.edgeCpt] = addedEles.id()
          this.edgesInGraph[addedEles.id()] = this.graph.edgeCpt
          this.graph.addEdge(sourceNode.id(), targetNode.id())
        }
        this.notify('on_addEdge', addedEles.id())
      })
      this.cy.on('dragfree', (event) => {
        const id = event.target.id()
        this.graph.updateNode(id, (data) => {
          data.x = event.position.x
          data.y = event.position.y

          return data
        })
      })
    }

    onClick (event) {
      this.lastClick = event.renderedPosition
      if (this.ctrlKey) {
        const id = this.graph.addNode()
        this.graph.updateNode(id, (data) => {
          data.x = (event.position.x)
          data.y = (event.position.y)

          return data
        })
        this.notify('on_addNode', id)
        this.ctrlKey = false
      }
    }

    reloadCy () {
      this.removeEles()
      for (const node in this.graph.nodes) {
        const id = this.cy.add({

          group: 'nodes',
          data: {
            id: node

          },
          position: { x: this.graph.nodes[node].data.x, y: this.graph.nodes[node].data.y }
        })
      }

      for (const edge in this.graph.edges) {
        const id = this.cy.add({

          group: 'edges',
          data: {
            id: this.edgesInCy[edge],
            source: this.graph.edges[edge].src,
            target: this.graph.edges[edge].dst
          }

        })
      }
    }

    removeEles () {
      this.cy.remove(this.cy.elements(''))
    }
}

module.exports = { GraphComponent, GraphComponentObserver }
