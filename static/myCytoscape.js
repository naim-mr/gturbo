//Objet de gestion d'un cytoscape



class myCytoscape {
    constructor(id) {
        this.drawmode = false;
        this.selectedEles = {};
        this.store = new Store();
        this.boxing = false;
        this.cy = cytoscape({
            container: document.getElementById(id),
            layout: {
                name: 'grid',
                zoomEnabled: false,
                rows: 2,
                cols: 2
            },

            style: [{
                    selector: 'node[name]',
                    style: {
                        'content': 'data(name)'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle'
                    }
                },

                // some style for the extension

                {
                    selector: '.eh-handle',
                    style: {
                        'background-color': 'red',
                        'width': 12,
                        'height': 12,
                        'shape': 'ellipse',
                        'overlay-opacity': 0,
                        'border-width': 12, // makes the handle easier to hit
                        'border-opacity': 0
                    }
                },

                {
                    selector: '.eh-hover',
                    style: {
                        'background-color': 'red'
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
                    selector: '.eh-preview, .eh-ghost-edge',
                    style: {
                        'background-color': 'red',
                        'line-color': 'red',
                        'target-arrow-color': 'red',
                        'source-arrow-color': 'red'
                    }
                },

                {
                    selector: '.eh-ghost-edge.eh-preview-active',
                    style: {
                        'opacity': 0
                    }
                }
            ],


            elements: {
                nodes: [],
                edges: []
            }
        });




        this.cy.on('click', event => {
            console.log(this.drawmode);
            if (this.drawmode) {

                this.cy.add({ group: 'nodes', position: event.position });
            }
        });

        this.cy.on('box', event => {
            this.boxing = true;

        });

        this.cb = this.cy.clipboard();

        document.addEventListener("keydown", event => {
            if (this.boxing) {
                if (event.ctrlKey) {
                    if (event.key === 'c') {
                        this.selectedEles = this.cy.$(':selected');
                    } else if (event.key == '   v' && this.selectedEles != {}) {
                        this.cy.paste(this.cb.copy(this.selectedEles));
                        this.selectedEles = {};
                        this.boxing = false;
                    }
                }
            }
            if (event.ctrlKey && event.key == 'z') {

                this.store.eles = this.cy.elements('');

                if (!this.store.isEmpty()) {

                    this.store.ele = this.store.eles[this.store.eles.length - 1];
                    this.store.push(this.store.ele);
                    this.cy.remove(this.store.ele);
                    this.store.cursor--;
                }

            }
            if (event.ctrlKey && event.key == 'y') {
                if (this.store.storage.length > 0 && this.store.cursor < this.store.storage.length) {
                    this.store.ele = this.store.pop();
                    this.store.ele.restore();
                    this.store.cursor++;
                }
            }

        })
        this.eh = this.cy.edgehandles();

    }
    drawModeUpdate() {
        this.drawmode = !(this.drawmode);
    }
    nodes(str) {
        return this.cy.nodes('');

    }
    edges(str) {
        return this.cy.edges('');

    }
    add(option) {
        this.cy.add(option);
    }
    remove(option) {
        this.cy.remove(option);
    }


}
//Objet permettant d'afficher les différents graphes de règles dans leurs conteneurs respectifs
class CytoList {
    cyleft;
    cyright;
    graphlist;
    counter;
    current;
    constructor() {

        this.graphlist = [];
        this.graphlist[0] = { lhs: { nodes: null, edges: null }, rhs: { nodes: null, edges: null } };
        this.cyleft = new myCytoscape("lhs");
        this.cyright = new myCytoscape("rhs");
        console.log(this.cyleft);
        this.graphlist[0].lhs.nodes = this.cyleft.nodes('');
        this.graphlist[0].lhs.edges = this.cyleft.edges('');
        this.graphlist[0].rhs.nodes = this.cyright.nodes('');
        this.graphlist[0].rhs.edges = this.cyright.edges('');
        this.counter = 0;
        this.current = 0;


    }
    drawmode() {
        this.cyleft.drawModeUpdate();
        this.cyright.drawModeUpdate();
    }
    push(ele) {
        this.graphlist.push(ele);
    }
    clear() {
        this.cyleft.remove(this.cyleft.nodes(''));
        this.cyright.remove(this.cyright.nodes(''));
        this.cyleft.remove(this.cyleft.edges(''));
        this.cyright.remove(this.cyright.edges(''));
    }
    leftNodes() {
        return this.cyleft.nodes('');

    }
    rightNodes() {
        return this.cyright.nodes('');

    }
    leftEdges() {
        return this.cyleft.edges('');

    }
    rightEdges() {
        return this.cyright.edges('');

    }

    saveRule() {
        let neweleLeft = { nodes: this.leftNodes(''), edges: this.leftEdges('') };
        let neweleright = { nodes: this.rightNodes(''), edges: this.rightEdges('') };
        let newRule = { lhs: neweleLeft, rhs: neweleright };
        this.push(newRule);
        this.counter++;
    }
    getCounter() {
        return this.counter;
    }
    setCurrent(n) {
        this.current = n;

    }
    update() {
        this.cyleft.add(this.graphlist[this.current].lhs.nodes);
        this.cyright.add(this.graphlist[this.current].rhs.nodes);
        this.cyleft.add(this.graphlist[this.current].lhs.edges);
        this.cyright.add(this.graphlist[this.current].rhs.edges)
    }
}




/*
        cy.on('box',function(event){
            console.log('ok');
            event.target.style({'background-color':'orange'});
            
        });
        */


// console.log(event);
/*if(nparent==undefined){
    console.log('ici');
    nparent = {
        group: 'nodes',
        position: event.position,
        data: {id:'nparent'+counter+id}
    }
    console.log(nparent);
    cy.add(nparent);    
    
}else{
    let element = {
        group: 'nodes',
        position: event.position,
        data:{parent:'nparent'+counter+id}
    }
    cy.add(element);
}*/