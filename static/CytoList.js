    //Objet de gestion d'un cytoscape
    //TODO: suppresion des élement en accord avec le ctrl z/y
    //TODO: gestion des images plus fine 
    //TODO: Créer un patern state pour myctoscape
    //TODO: gérer la duplication des images INCLUSION / JEU DE REGLE 

    const Mode = {
        DRAW: 'draw',
        EDIT: 'edit'
    }

    class MyCytoscape {
        constructor(id) {
            this.id = id;
            this.index = 0;
            this.selectedEles = {};
            this.store = new Store();
            this.boxing = true;
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
            this.state = new EditState(this);
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
            this.savefactor('', n, handside);
            this.savefactor('i', n, handside);

        }
        savefactor(str, n, handside) {
            let jpeg = this.cy.jpeg({ bg: 'rgb(255, 224, 183)' });
            let img = document.getElementById(str + 'rule' + handside + n)
            console.log(img);
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


        constructor(str) {
            this.rulelist = new RuleList();
            this.inclusionlist = new InclusionList()
            this.statut = str;
            console.log("satut : " + str);
            if (str === "rule") {
                this.cylist_state = new RuleState(this);


            } else if (str === "inclusion") {

                this.cylist_state = new InclusionState(this);
            }
        }
        changeCytoState(str) {

            if (str == "rule") {
                this.cylist_state = new RuleState(this);
                this.statut = "rule";
            } else if (str == "inclusion") {
                this.statut = "inclusion";
                this.cylist_state = new InclusionState(this);
            }
        }
        freeStorage() {

            this.cylist_state.freeStorage();
        }
        length() {
            return this.rulelist.length();
        }
        changeMode(mode) {
            this.cylist_state.changeMode(mode);
        }
        changeState() {
            this.cylist_state.changeState();
        }
        push(ele) {
            this.rulelist.push(ele);
        }
        clear() {
            this.cylist_state.clear();
        }

        save() {
            this.cylist_state.save();
        }
        getCounterRule() {
            return this.rulelist.counter;
        }
        setCurrentRule(n) {
            this.rulelist.setCurrent(n);

        }
        getCounterInclusion() {
            return this.inclusion.counter;
        }
        setCurrentInclusion(n) {
            this.inclusionlist.setCurrent(n);

        }
        getCurrentRule() {
            return this.rulelist.getCurrent();
        }
        getCurrentInclusion() {
            return this.inclusionlist.getCurrent();
        }
        update() {
            this.cylist_state.update();
        }

    }