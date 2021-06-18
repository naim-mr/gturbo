class GraphInclusionComponent {
    static GraphIObs = class extends GraphInclusionObserver {
        constructor(gic, graphI) {
            super(graphI);
            this.gic = gic;

        }

        on_setNode(idx, idy) {
            let nodeDom = this.gic.domComp.cy.getElementById(idx);
            this.gic.codComp.cy.getElementById(idy).style('background-color',nodeDom.style('background-color'));
        }   

        on_setEdge(idx, idy) {
            let edgex = this.gic.domComp.edgesInCy[idx]
            let edgeDom = this.gic.domComp.cy.getElementById(edgex);
            let edgey = this.gic.codComp.edgesInCy[idy];
            this.gic.codComp.cy.getElementById(edgey).style('line-color',edgeDom.style('line-color'));
            this.gic.codComp.cy.getElementById(edgey).style('target-arrow-color',edgeDom.style('target-arrow-color'));

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
                console.log("on click edge");
                console.log(this.selectedEle.id());
                console.log(this.domComp.edgesInGraph[this.selectedEle.id()]);
                console.log(this.codComp.edgesInGraph);
                this.graphI.setEdge(this.domComp.edgesInGraph[this.selectedEle.id()], this.codComp.edgesInGraph[event.target.id()]);
            }
        });
    }



    destructor() {
        this.graphI.unregister(this.graphIobs);
    }

    updateComponent(graphI) {
        this.destructor();
        this.graphI = graphI;
        this.domComp.updateGraph(graphI.dom) ;
        this.codComp.updateGraph(graphI.cod);
        this.graphIobs = new GraphInclusionComponent.GraphIObs(this, graphI);

    }
    updateEdgesMap(edgesInCy, edgesInGraph, over) {
        if (over) this.codComp.updateEdgesMap(edgesInCy, edgesInGraph);
        else this.domComp.updateEdgesMap(edgesInCy, edgesInGraph);
    }
    removeEles() {
        this.domComp.cy.remove(this.domComp.cy.elements(''));
        this.codComp.cy.remove(this.codComp.cy.elements(''));
        this.selectedEle = null;
    }

    //Diminuer ? 

    coloredInclusion() {
        this.codComp.inc=true;
        this.domComp.inc=true;
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
                this.selectedEle.addClass('highlight');
            })
            this.domComp.cy.getElementById(ele).removeListener('mouseout');;
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
                this.selectedEle.addClass('highlight');
            })
            this.domComp.cy.getElementById(ele).removeListener('mouseout');;
            console.log(ele);
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
            }).on("click", (event) => {
                this.codSelectedEle = event.target;
                this.codSelectedEle.addClass('highlight');

            });


        }
        for (const edge in this.graphI.cod.edges) {
            let id = this.codComp.cy.add({
                group: 'edges',
                data: {
                    id: this.codComp.edgesInCy[edge],
                    source: this.graphI.cod.edges[edge]['src'],
                    target: this.graphI.cod.edges[edge]['dst'],
                },


            }).on("click", (event) => {
                this.codSelectedEle = event.target;
                this.codSelectedEle.addClass('highlight');

            });;
        }
    }

    loadInclusion() {
        this.codComp.inc=true;
        this.domComp.inc=true;
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
                this.selectedEle.addClass('highlight');

            });
            this.domComp.cy.getElementById(ele).removeListener('mouseout');;
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
                this.selectedEle.addClass('highlight');

            });
            this.domComp.cy.getElementById(ele).removeListener('mouseout');;

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
                }).on("click", (event) => {
                    this.codSelectedEle = event.target;
                    this.codSelectedEle.addClass('highlight');
    
                });
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


                }).on("click", (event) => {
                    this.codSelectedEle = event.target;
                    this.codSelectedEle.addClass('highlight');
    
                });;
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