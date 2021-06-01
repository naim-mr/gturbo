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
        let currentRule = this.cytolist.getCurrent();
        this.cyleft.add(currentRule.lhs.getNodes());
        this.cyleft.add(currentRule.lhs.getEdges());
        this.cyright.add(currentRule.rhs.getNodes());
        this.cyright.add(currentRule.rhs.getEdges());

    }

}


function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
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
    changeState() {
        this.cyright.forEach((element) => {
            element.changeState()

        });
        this.cyleft.forEach((element) => {
            element.changeState();
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

    saveLeft() {
        let morphism = new Morphism(this.cyleft[0].cy.$(':selected'), this.cyleft[0].cy.elements(''));
        let src = this.bottomrule.lhs;
        let dest = this.toprule.lhs;
        let morphisms = [morphism];
        let inclusion = new Inclusion(src, dest, morphisms);
        this.cytolist.inclusionlist.push(inclusion);

    }
    saveRight() {
        let morphism = new Morphism(this.cyright[0].cy.$(':selected'), this.cyright[1].cy.elements(''));
        let src = this.bottomrule.rhs;
        let dest = this.toprule.rhs;
        let morphisms = [morphism];
        let inclusion = new Inclusion(src, dest, morphisms);
        this.cytolist.inclusionlist.push(inclusion);
    }

    save() {
        this.saveLeft();
        this.saveRight();

    }
    update() {


        let currentRule = this.cytolist.getCurrentRule();
        if (this.index == 1) {
            this.toprule = currentRule;
            let rgb = getRandomRgb();
            coloredRule(currentRule.lhs, rgb, this.cyleft[1]);
            coloredRule(currentRule.rhs, rgb, this.cyright[1]);
        } else {
            this.bottomrule = currentRule;
            this.cyleft[this.index].add(currentRule.lhs.getNodes());
            this.cyleft[this.index].add(currentRule.lhs.getEdges());
            this.cyright[this.index].add(currentRule.rhs.getNodes());
            this.cyright[this.index].add(currentRule.rhs.getEdges());
        }
        if (this.index == 0) this.index++;
        else this.index = 0;
    }
    showCurrentInclusion() {
        let currentInclusion = this.cytolist.getCurrentInclusion();
        this.cyleft[0].add(currentInclusion.src.getNodes());
        this.cyleft[0].add(currentInclusion.src.getEdges());
        this.cyright[0].add(currentInclusion.rhs.getNodes());
        this.cyright[0].add(current.rhs.getEdges())


    }

}


function coloredRule(ruleHs, rgb, cyto) {

    let nodes = ruleHs.getNodes();
    let edges = ruleHs.getEdges();
    let nodescopy = {};
    let edgescopy = {};



    for (let i = 0; i < nodes.length; i++) {
        nodescopy = {
            group: 'nodes',
            position: nodes[i].position(),
            data: nodes[i].data(),
            style: { 'background-color': rgb }

        };
        cyto.add(nodescopy);
    }
    for (let j = 0; j < edges.length; j++) {
        edgescopy = {
            group: 'edges',
            data: edges[j].data(),
            style: { 'line-color': rgb, 'target-arrow-color': rgb }
        }
        console.log(edgescopy);
        cyto.add(edgescopy);

    }


}