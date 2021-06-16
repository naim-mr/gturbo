class GraphInclusionComponent {
    static GraphIObs = class extends GraphInclusionObserver {
        constructor(gic, graphI) {
            super(graphI);
            this.gic = gic;

        }

        on_setNode(idx, idy) {
            let nodeDom = this.gic.domComp.cy.getElementById(idx);
            this.gic.codComp.cy.getElementById(idy).style(nodeDom.style());
        }

        on_setEdge(idx, idy) {
            let edgex = this.gic.domComp.edgesInCy[idx]
            let edgeDom = this.gic.domComp.cy.getElementById(edgex);
            let edgey = this.gic.codComp.edgesInCy[idy];
            this.gic.codComp.cy.getElementById(edgey).style(edgeDom.style())

        }

        on_unsetNode(idx, idy) {
            let nodeCod = this.gic.codComp.cy.getElementById(idy);
            nodeCod.style({ 'background-color': '' });


        }

        on_unsetEdge(idx, idy) {
            let id = this.gic.codComp.edgesInCy[idy];
            let edgeCod = this.gic.codComp.cy.getElementById(id);
            edgeCod.style({
                'line-color': '',
                'target-arrow-color': '',
            });
        }

    }

    constructor(graphI, idComp) {
        this.graphI = graphI;
        this.graphIobs = new GraphInclusionComponent.GraphIObs(this, graphI);

        this.domComp = new GraphComponent(graphI.dom, idComp[0]);
        this.codComp = new GraphComponent(graphI.cod, idComp[1])

        this.selectedEle = null;

        this.codComp.cy.on("click", 'node', (event) => {
            if (this.selectedEle != null && this.selectedEle.isNode()) {
                this.graphI.setNode(this.selectedEle.id(), event.target.id());
            }
        });
        this.codComp.cy.on("click", 'edge', (event) => {
            if (this.selectedEle != null && this.selectedEle.isEdge()) {
                this.graphI.setEdge(this.domComp.edgesInGraph[this.selectedEle.id()], this.codComp.edgesInGraph[event.target.id()]);
            }
        });
    }



    destructor() {
        this.graphI.unregister(this.graphIobs);
    }

    update(graphI) {
        this.destructor();
        this.graphI = graphI;
        this.domComp.graph = graphI.dom;
        this.codComp.graph = graphI.cod;
        this.graphIobs = new GraphInclusionComponent.GraphIObs(this, lgraphI);

    }
    udpateEdgesMap(edgesInCy, edgesInGraph, over) {
        if (over) this.codComp.updateEdgesMap(edgesInCy, edgesInGraph);
        else this.domComp.updateEdgesMap(edgesInCy, edgesInGraph);
    }
    removeEles() {
        this.domComp.cy.remove(this.domComp.cy.elements(''));
        this.codComp.cy.remove(this.codComp.cy.elements(''));
        this.selectedEle = null;
    }

    //add eles with random rgb
    coloredInclusion() {
        var rgb;
        for (const node in this.graphI.dom.nodes) {
            rgb = getRandomRgb();
            let ele = this.domComp.cy.add({
                group: 'nodes',
                data: {
                    id: node
                },
                position: { x: this.graphI.dom.nodes[node].data['x'], y: this.graphI.dom.nodes[node].data['y'] }
            }).on("click", (event) => {
                this.selectedEle = event.target;

            });
            ele.style({ 'background-color': rgb })
        }
        for (const edge in this.graphI.dom.edges) {
            rgb = getRandomRgb();
            let ele = this.domComp.cy.add({
                group: 'edges',
                data: {
                    id: this.domComp.edgesInCy[edge],
                    source: this.graphI.dom.edges[edge]['src'],
                    target: this.graphI.dom.edges[edge]['dst'],
                },
            }).on("click", (event) => {
                this.selectedEle = event.target;
            });
            ele.style({
                'line-color': rgb,
                'target-arrow-color': rgb
            });

        }
        for (const node in this.graphI.cod.nodes) {
            let id = this.codComp.cy.add({
                group: 'nodes',
                data: {

                    id: node
                },
                position: { x: this.graphI.cod.nodes[node].data['x'], y: this.graphI.cod.nodes[node].data['y'] }
            })


        }
        for (const edge in this.graphI.cod.edges) {
            let id = this.codComp.cy.add({
                group: 'edges',
                data: {
                    id: this.codComp.edgesInCy[edge],
                    source: this.graphI.cod.edges[edge]['src'],
                    target: this.graphI.cod.edges[edge]['dst'],
                },


            });
        }
    }

    loadInclusion() {
        var rgb;
        for (const node in this.graphI.dom.nodes) {
            rgb = getRandomRgb();
            let ele = this.domComp.cy.add({
                group: 'nodes',
                data: {
                    id: node

                },
                position: { x: this.graphI.dom.nodes[node].data['x'], y: this.graphI.dom.nodes[node].data['y'] }
            }).on("click", (event) => {
                this.selectedEle = event.target

            });
            ele.style({ 'background-color': rgb })
            if (this.graphI.nodeMap[node] != undefined) {
                ele = this.codComp.cy.add({
                    group: 'nodes',
                    data: {
                        id: this.graphI.nodeMap[node]

                    },
                    position: { x: this.graphI.cod.nodes[this.graphI.nodeMap[node]].data['x'], y: this.graphI.cod.nodes[this.graphI.nodeMap[node]].data['y'] }
                });
                ele.style({ 'background-color': rgb })


            }

        }
        for (const edge in this.graphI.dom.edges) {
            rgb = getRandomRgb();
            let ele = this.domComp.cy.add({
                group: 'edges',
                data: {
                    id: this.domComp.edgesInCy[edge],
                    source: this.graphI.dom.edges[edge]['src'],
                    target: this.graphI.dom.edges[edge]['dst'],
                },


            }).on("click", (event) => {
                this.selectedEle = event.target;

            });
            ele.style({
                'line-color': rgb,
                'target-arrow-color': rgb
            });

            if (this.graphI.edgeMap[edge] != undefined) {
                ele = this.codComp.cy.add({
                    group: 'edges',
                    data: {
                        id: this.codComp.edgesInCy[this.graphI.edgeMap[edge]],
                        source: this.graphI.cod.edges[this.graphI.edgeMap[edge]]['src'],
                        target: this.graphI.cod.edges[this.graphI.edgeMap[edge]]['dst'],
                    },


                });
                ele.style({
                    'line-color': rgb,
                    'target-arrow-color': rgb
                });


            }
        }
        for (const node in this.graphI.cod.nodes) {

            if (!this.codComp.cy.getElementById(node).length) {
                let id = this.codComp.cy.add({
                    group: 'nodes',
                    data: {

                        id: node
                    },
                    position: { x: this.graphI.cod.nodes[node].data['x'], y: this.graphI.cod.nodes[node].data['y'] }
                })
            }

        }
        for (const edge in this.graphI.cod.edges) {
            if (!this.codComp.cy.getElementById(this.codComp.edgesInCy[edge]).length) {
                let id = this.codComp.cy.add({
                    group: 'edges',
                    data: {
                        id: this.codComp.edgesInCy[edge],
                        source: this.graphI.cod.edges[edge]['src'],
                        target: this.graphI.cod.edges[edge]['dst'],
                    },


                });
            }
        }

    }
}

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}