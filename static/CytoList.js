//Objet de gestion d'un cytoscape
//TODO : suppresion des élement en accord avec le ctrl z/y
//TODO : gestion des images plus fine 
//TODO : Créer un patern state pour myctoscape
//TODO: gérer la duplication des images INCLUSION / JEU DE REGLE 







const Mode = {
    DRAW: 'draw',
    EDIT: 'edit'
}

class MyCytoscape {

    constructor(id, mode) {
        this.mode = mode;
        this.state = new EditState(this);
        this.selectedEles = {};
        this.store = new Store();
        this.boxing = false;

        this.cy = cytoscape({
            zoomEnabled: false,
            container: document.getElementById(id),
            layout: {
                name: 'grid',
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
        this.cb = this.cy.clipboard();
        this.eh = this.cy.edgehandles();


    }
    changeStateTo(mode) {
        this.state.removeListener();
        switch (mode) {
            case Mode.DRAW:

                return new DrawState(this);
            case Mode.EDIT:
                return new EditState(this);
        }
    }

    saveRule(n, handside) {
        let jpeg = this.cy.jpeg({ bg: 'rgb(255, 224, 183)' });
        let img = document.getElementById('rule' + handside + n)
        img.setAttribute('src', jpeg);
        img.setAttribute('style', 'width:50%;padding:1%');
    }

    freeStorage() {
        this.store.free();
    }
    changeState() {
        console.log("coucu")
        this.state.removeListener();
        if (this.state.mode == Mode.DRAW) this.state = this.changeStateTo(Mode.EDIT);
        else this.state = this.changeStateTo(Mode.DRAW)
    }
    nodes(str) {
        return this.cy.nodes('');

    }
    edges(str) {
        return this.cy.edges('');

    }
    add(ele) {
        this.cy.add(ele);

    }
    remove(option) {
        this.cy.remove(option);
    }


}
//Objet permettant d'afficher les différents graphes de règles dans leurs conteneurs respectifs
class CytoList {
    cyleft;
    cyright;
    rulelist;

    constructor() {

        this.rulelist = new RuleList();
        this.cyleft = new MyCytoscape("lhs");
        this.cyright = new MyCytoscape("rhs");
        this.rulelist.getRule(0).updateNodes(this.cyleft.nodes(''), this.cyright.nodes(''));
        this.rulelist.getRule(0).updateEdges(this.cyleft.edges(''), this.cyright.edges(''));


    }
    freeStorage() {
        this.cyright.freeStorage();
        this.cyleft.freeStorage();
    }
    length() {
        return this.rulelist.length;
    }
    changeMode(mode) {
        this.cyleft.changeStateTo(mode)
        this.cyright.changeStateTo(mode);
    }
    changeState() {
        this.cyleft.changeState();
        this.cyright.changeState();
    }
    push(ele) {
        this.rulelist.push(ele);
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
        this.cyleft.saveRule(this.getCounter(), 'lhs');
        this.cyright.saveRule(this.getCounter(), 'rhs');
        let newRule = new Rule();
        newRule.updateNodes(this.leftNodes(''), this.rightNodes(''));
        newRule.updateEdges(this.leftEdges(''), this.rightEdges(''));
        this.push(newRule);
    }
    getCounter() {
        return this.rulelist.counter;
    }
    setCurrent(n) {
        this.rulelist.setCurrent(n);

    }
    getCurrent() {
        return this.rulelist.getCurrent();
    }
    update() {
        let currentRule = this.getCurrent();
        this.cyleft.add(currentRule.lhs.getNodes());
        this.cyleft.add(currentRule.lhs.getEdges());
        this.cyright.add(currentRule.rhs.getNodes());
        this.cyright.add(currentRule.rhs.getEdges());

    }

}