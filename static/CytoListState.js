class CytoListState {
    constructor(cytolist) {
        this.cytolist = cytolist;
    }

    freeStorage() {

    }

    changeMode(mode) {

    }
    changeState() {;
    }

    clear() {

    }

    save() {

    }
    update() {

    }
    fit() {

    }

}
class RuleState extends CytoListState {

    constructor(cytolist) {
        super(cytolist);
        this.cyright = new MyCytoscape("rhs");
        this.cyleft = new MyCytoscape("lhs");
        this.cytolist.rulelist.getRule(0).updateNodes(this.cyleft.nodes(''), this.cyright.nodes(''));
        this.cytolist.rulelist.getRule(0).updateEdges(this.cyleft.edges(''), this.cyright.edges(''));
    }
    freeStorage() {
        this.cyright.freeStorage();
        this.cyleft.freeStorage();
    }

    changeMode(mode) {
        this.cyleft.changeStateTo(mode)
        this.cyright.changeStateTo(mode);
    }
    changeState() {
        this.cyleft.changeState();
        this.cyright.changeState();
    }
    fit() {
        this.cyright.cy.zoom(0.5);
        this.cyleft.cy.zoom(0.5);
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
    save() {
        this.cyleft.saveRule(this.cytolist.getCounterRule(), 'lhs');
        this.cyright.saveRule(this.cytolist.getCounterRule(), 'rhs');
        let newRule = new Rule();
        newRule.updateNodes(this.leftNodes(''), this.rightNodes(''));
        newRule.updateEdges(this.leftEdges(''), this.rightEdges(''));
        this.cytolist.push(newRule);
    }
    update() {
        let currentRule = this.cytolist.getCurrentRule();
        this.cyleft.add(currentRule.lhs.getNodes());
        this.cyleft.add(currentRule.lhs.getEdges());
        this.cyright.add(currentRule.rhs.getNodes());
        this.cyright.add(currentRule.rhs.getEdges());

    }

}



class InclusionState extends CytoListState {

    constructor(cytolist) {
        super(cytolist);
        this.index = 0;
        this.cyright = [];
        this.cyleft = [];
        this.cyright[0] = new MyCytoscape("rhs1");

        this.cyleft[0] = new MyCytoscape("lhs1");
        this.cyright[1] = new MyCytoscape("rhs2");
        this.cyleft[1] = new MyCytoscape("lhs2");

    }


    freeStorage() {
        this.cyright.forEach((element) => {
            element.freeStorage();

        });
        this.cyleft.forEach((element) => {
            element.freeStorage();
        });

    }

    changeMode(mode) {
        this.cyright.forEach((element) => {
            element.changeStateTo(mode)

        });
        this.cyleft.forEach((element) => {
            element.changeStateTo(mode);
        });
    }
    changeState(mode) {
        this.cyright.forEach((element) => {
            element.changeState(mode)

        });
        this.cyleft.forEach((element) => {
            element.changeState(mode);
        });
    }
    clear() {
        this.cyright.forEach((element) => {
            element.remove(element.nodes(''));
            element.remove(element.edges(''))

        });
        this.cyleft.forEach((element) => {
            element.remove(element.nodes(''));
            element.remove(element.edges(''))
        });
    }
    fit() {
        this.cyright.forEach((element) => {
            element.cy.zoom(0.5);
        });
        this.cyleft.forEach((element) => {
            element.cy.zoom(0.5);

        });
    }

    saveLeft() {
        let selected = this.cyleft[0].cy.$(':selected');
        for (let i = 0; i < selected.length; i++) {
            selected[i].style({ 'background-color': 'blue' });
        }
        let morphism = new Morphism(this.cyleft[1].cy.elements(''), selected);
        let src = this.bottomrule.lhs;
        let dest = this.toprule.lhs;
        let inclusion = new Inclusion(src, dest, morphism);
        this.cytolist.inclusionlist.push(inclusion);
    }
    saveRight() {
        let selected = this.cyright[0].cy.$(':selected');
        for (let i = 0; i < selected.length; i++) {
            selected[i].style({ 'background-color': 'blue' });
        }
        let morphism = new Morphism(this.cyright[1].cy.elements(''), selected);

        let src = this.bottomrule.rhs;
        let dest = this.toprule.rhs;
        let inclusion = new Inclusion(src, dest, morphism);
        this.cytolist.inclusionlist.push(inclusion);
    }

    save() {
        this.saveLeft();
        this.saveRight();

    }
    update() {
        let currentRule = this.cytolist.getCurrentRule();
        if (this.index == 1) {
            this.bottomrule = currentRule;
            let rgb = getRandomRgb();
            coloredRule(currentRule.lhs, "blue", this.cyleft[1]);
            coloredRule(currentRule.rhs, "blue", this.cyright[1]);
        } else {
            this.toprule = currentRule;
            this.cyleft[this.index].add(currentRule.lhs.getNodes());
            this.cyleft[this.index].add(currentRule.lhs.getEdges());
            this.cyright[this.index].add(currentRule.rhs.getNodes());
            this.cyright[this.index].add(currentRule.rhs.getEdges());
        }
        this.cyleft[this.index].nodes().ungrabify();
        this.cyleft[this.index].edges().ungrabify();
        this.cyright[this.index].nodes().ungrabify();
        this.cyright[this.index].edges().ungrabify();
        if (this.index == 0) this.index++;
        else this.index = 0;

    }
    showInclusion(m) {
        let currentInclusion = this.cytolist.getCurrentInclusion();
        //coloredMorphism("blue", currentInclusion.morphism);
        this.cyleft[1].add(currentInclusion.morphism.eleSrc);
        this.addOnlyNodes(currentInclusion, this.cyleft[0]);
        this.cyleft[0].add(currentInclusion.morphism.eleDest);
        this.addOnlyEdge(currentInclusion, this.cyleft[0]);
        this.cytolist.setCurrentInclusion(m + 1);
        currentInclusion = this.cytolist.getCurrentInclusion();
        this.cyright[1].add(currentInclusion.morphism.eleSrc);
        this.addOnlyNodes(currentInclusion, this.cyright[0]);
        //        coloredMorphism("blue", currentInclusion.morphism);
        this.cyright[0].add(currentInclusion.morphism.eleDest);
        this.addOnlyEdge(currentInclusion, this.cyright[0]);
    }

    addOnlyNodes(currentInclusion, cy) {
        let idIn = true;
        for (let j = 0; j < currentInclusion.dest.nodes.length; j++) {
            for (let i = 0; i < currentInclusion.morphism.eleDest.length; i++) {
                if (currentInclusion.morphism.eleDest[i].id() == currentInclusion.dest.nodes[j].id()) idIn = false;
            }
            currentInclusion.dest.edges[j]
            if (idIn) cy.add(currentInclusion.dest.nodes[j]);
            idIn = true;

        }

    }




    addOnlyEdge(currentInclusion, cy) {
        let idIn = true;
        for (let j = 0; j < currentInclusion.dest.edges.length; j++) {
            for (let i = 0; i < currentInclusion.morphism.eleDest.length; i++) {
                if (currentInclusion.morphism.eleDest[i].id() == currentInclusion.dest.edges[j].id()) idIn = false;
            }
            currentInclusion.dest.edges[j]
            if (idIn) cy.add(currentInclusion.dest.edges[j]);
            idIn = true;

        }

    }


}




function coloredRule(ruleHs, rgb, cyto) {

    let nodes = ruleHs.getNodes();
    let edges = ruleHs.getEdges();
    let nodescopy = {};
    let edgescopy = {};



    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i].hasClass("eh-handle")) {
            nodescopy = {
                group: 'nodes',
                position: nodes[i].position(),
                data: nodes[i].data(),
                style: { 'background-color': rgb }

            };
            cyto.add(nodescopy);
        }
    }
    for (let j = 0; j < edges.length; j++) {
        edgescopy = {
            group: 'edges',
            data: edges[j].data(),
            style: { 'line-color': rgb, 'target-arrow-color': rgb }
        }
        cyto.add(edgescopy);

    }


}
//this.cyleft[0].add(currentInclusion.morphism.eleDest);

function coloredMorphism(rgb, morphism) {
    let dest = { length: morphism.eleDest.length };
    for (let i = 0; i < morphism.eleDest.length; i++) {

        dest[i] = {
            group: morphism.eleDest[i].group(),
            position: morphism.eleDest[i].position(),
            data: morphism.eleDest[i].data(),
            style: { 'background-color': rgb }

        };

    }
    morphism.eleDest = dest;
}




class GlobalCytolistState extends CytoListState {

    constructor(cytolist) {
        super(cytolist);
        this.index = 0;
        this.cyright = new MyCytoscape("rhs");
        this.cyleft = new MyCytoscape("lhs");
        this.cyright.changeState(Mode.GLOBAL);
        this.cyleft.changeState(Mode.GLOBAL);
    }


    freeStorage() {
        this.cyright.freeStorage();
        this.cyleft.freeStorage();


    }

    changeMode(mode) {
        this.cyright.changeStateTo(mode)


        this.cyleft.changeStateTo(mode);

    }
    changeState(mode) {
        this.cyright.changeState(mode)
        this.cyleft.changeState(mode);

    }
    clear() {
        this.cyright.remove(this.cyright.nodes(''));
        this.cyright.remove(this.cyright.edges(''))
        this.cyleft.remove(this.cyleft.nodes(''));
        this.cyleft.remove(this.cyleft.edges(''));

    }
    fit() {
        this.cyright.cy.zoom(0.5);
        this.cyleft.cy.zoom(0.5);


    }

    update() {


        let currentRule = this.cytolist.getCurrentRule();
        let nodescopy = [];
        nodescopy.push({ group: 'nodes', data: { id: 'n0' + this.index }, position: { x: 0, y: 0 } });


        //if (this.index == 1) {
        /*this.bottomrule = currentRule;
        let rgb = getRandomRgb();
        coloredRule(currentRule.lhs, "", this.cyleft[1]);
        coloredRule(currentRule.rhs, "", this.cyright[1]);*/
        for (let i = 0; i < currentRule.lhs.nodes.length; i++) {
            nodescopy.push({
                group: "nodes",
                data: { id: currentRule.lhs.nodes[i].id(), parent: 'n0' + this.index },
                position: currentRule.lhs.nodes[i].position(),
                classes: currentRule.lhs.nodes[i].classes(),
            })
        }
        this.cyleft.cy.add(nodescopy);
        this.cyleft.cy.add(currentRule.lhs.edges);
        //} else {
        this.toprule = currentRule;
        //this.cyleft[this.index].add(currentRule.lhs.getNodes());
        //this.cyleft[this.index].add(currentRule.lhs.getEdges());
        //  this.cyright[this.index].add(currentRule.rhs.getNodes());
        //this.cyright[this.index].add(currentRule.rhs.getEdges());
        //}
        if (this.index == 0) this.index++;
        else this.index = 0;
    }
    showInclusion(m) {
        let currentInclusion = this.cytolist.getCurrentInclusion();
        this.cyleft[1].add(currentInclusion.morphism.eleSrc);
        this.addOnlyNodes(currentInclusion, this.cyleft[0]);
        this.cyleft[0].add(currentInclusion.morphism.eleDest);
        this.addOnlyEdge(currentInclusion, this.cyleft[0]);
        this.cytolist.setCurrentInclusion(m + 1);
        currentInclusion = this.cytolist.getCurrentInclusion();
        this.cyright[1].add(currentInclusion.morphism.eleSrc);
        this.addOnlyNodes(currentInclusion, this.cyright[0]);
        this.cyright[0].add(currentInclusion.morphism.eleDest);
        this.addOnlyEdge(currentInclusion, this.cyright[0]);
    }

    addOnlyNodes(currentInclusion, cy) {
        let idIn = true;
        for (let j = 0; j < currentInclusion.dest.nodes.length; j++) {
            for (let i = 0; i < currentInclusion.morphism.eleDest.length; i++) {
                if (currentInclusion.morphism.eleDest[i].id() == currentInclusion.dest.nodes[j].id()) idIn = false;
            }
            currentInclusion.dest.edges[j]
            if (idIn) cy.add(currentInclusion.dest.nodes[j]);
            idIn = true;

        }

    }
    addOnlyEdge(currentInclusion, cy) {
        let idIn = true;
        for (let j = 0; j < currentInclusion.dest.edges.length; j++) {
            for (let i = 0; i < currentInclusion.morphism.eleDest.length; i++) {
                if (currentInclusion.morphism.eleDest[i].id() == currentInclusion.dest.edges[j].id()) idIn = false;
            }
            currentInclusion.dest.edges[j]
            if (idIn) cy.add(currentInclusion.dest.edges[j]);
            idIn = true;

        }

    }


}