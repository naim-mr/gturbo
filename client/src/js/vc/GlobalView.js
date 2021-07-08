var Observer = require('../util/Observer.js')
var Observable = require('../util/Observable.js')
var { Graph, GraphObserver } = require('../model/Graph')
var { GraphComponent, GraphComponentObserver } = require('./GraphComponent')
var cytoscape = require('cytoscape')
var options = require('./defaultcxt.js')

class GlobalViewObserver extends Observer {
  constructor (gv) {
    super(gv)
  }

  on_editRule (id) {};
  on_editInclusion (id) {};
  on_update () {};
}

class GlobalView extends Observable {
    static GraphObs = class extends GraphObserver {
      constructor (gv, g) {
        super(g)
        this.gv = gv
      }

      on_addNode (idn) {
        const ele = this.gv.cy.add({
          group: 'nodes',
          position: {},
          data: { id: idn }
        })
      }

      on_updateNode (idn, data) {
        const node = this.gv.cy.getElementById(idn)
        node.position(data)
      }

      on_addEdge (ide, src, dest) {
        let isInCyto = true
        if (this.gv.edgesInCy[ide] == undefined) isInCyto = false
        if (!isInCyto) {
          console.log('on gv add')
          const idC = this.gv.cy.add({ group: 'edges', data: { source: src, target: dest } })
          console.log(idC)
          this.gv.edgesInCy[ide] = idC.id()
          this.gv.edgesInGraph[idC.id()] = ide
          console.log(this.gv.cy.elements())
        }
      }

      on_removeEdge (id) {
        console.log('on remove edge')
        this.gv.cy.remove(this.gv.cy.getElementById(this.gv.edgesInCy[id]))
      }

      on_removeNode (id) {
        this.gv.cy.remove(this.gv.cy.getElementById(id))
      }
    }

    // precond g is a Graph and idComp a string ( id of a html div)
    constructor (g, idComp) {
      super()

      this.counter = 0 //  counter ==1 => goto rules or inc edition
      this.mouseover = false // to control document.listener
      this.lastClick = {}
      this.edgesInGraph = {} // map to convert id from cytoscape to our model
      this.edgesInCy = {} // map to convert id from our model to id in cytoscape
      this.ctrlKey = false
      this.updateGraph(g)
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
            shape: 'rectangle'

          }
        },
        {
          selector: '.edited',
          style: {
            'border-width': 2,
            'border-color': 'black'

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
          selector: '.eh_edited',
          style: {
            'line-color': 'black',
            'target-arrow-color': 'black'

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
      this.eh.enable()
      this.eh.enableDrawMode()

      this.addListener(idComp)
    }

    deleteEdges () {
      this.edgesInCy = {}
      this.edgesInGraph = {}
    }

    destroyObserver () {
      if (this.graphObs != undefined) this.graph.unregister(this.graphObs)
    }

    // precond graph in Graph
    updateGraph (graph) {
      this.destroyObserver()
      this.graph = graph
      this.graphObs = new GlobalView.GraphObs(this, graph)
    }

    /* precond:
        edgeinCy map id from our model to cytoscape
        edgeInGraph map id from cytoscape to our model
    */
    updateEdgesMap (edgesInCy, edgesInGraph) {
      this.edgesInCy = edgesInCy
      this.edgesInGraph = edgesInGraph
    }

    reloadCy () {
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
      this.cy.on('click', 'node', (event) => {
        if (this.counter == 1 && event.target.id() == this.lastTarget.id()) {
          this.counter = 0
          this.notify('on_editRule', event.target.id())
          this.mouseover = false
          this.lastTarget = null
        } else if (this.counter == 1) {
          this.counter = 0
        } else this.counter++
        this.lastTarget = event.target
      })

      this.cy.on('click', 'edge', (event) => {
        if (this.counter == 1 && event.target.id() == this.lastTarget.id()) {
          this.counter = 0
          this.notify('on_editInclusion', this.edgesInGraph[event.target.id()])
          this.mouseover = false
          this.lastTarget = null
        } else if (this.counter == 1) {
          this.counter = 0
        } else this.counter++
        this.lastTarget = event.target
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
      this.cy.on('dragfree', (event) => {
        const id = event.target.id()
        this.graph.updateNode(id, (data) => {
          data.x = event.position.x
          data.y = event.position.y

          return data
        })
      })
      // this.rsc.loadInclusion(parseInt(id));

      this.cy.on('ehcomplete', (event, sourceNode, targetNode, addedEles) => {
        if (!this.inc) {
          this.edgesInCy[this.graph.edgeCpt] = addedEles.id()
          this.edgesInGraph[addedEles.id()] = this.graph.edgeCpt
          this.graph.addEdge(sourceNode.id(), targetNode.id())
        }
      })
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

    onClick (event) {
      this.lastClick = event.renderedPosition
      if (this.ctrlKey) {
        const id = this.graph.addNode()
        this.graph.updateNode(id, (data) => {
          data.x = (event.position.x)
          data.y = (event.position.y)

          return data
        })

        this.ctrlKey = false
      }
    }

    stylizedRule (id) {
      const r = this.cy.getElementById(id)
      r.addClass('edited')
      for (const ed of this.cy.elements()) {
        if (ed.isEdge() && ed.source().id() == id && ed.target().id() == id) ed.addClass('eh_edited')
      }
    }

    stylizedInc (id) {
      const i = this.cy.getElementById(this.edgesInCy[id])
      i.addClass('eh_edited')
    }
}

module.exports = { GlobalView, GlobalViewObserver }
