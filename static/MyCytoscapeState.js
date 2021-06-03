class MyCyState {
    constructor(mycy) {
        this.mycytoscape = mycy;
    }
    removeListener() {

    }

}

class DrawState extends MyCyState {
    mode;
    constructor(myCy) {
        super(myCy);
        this.mode = Mode.DRAW;
        this.mycytoscape.cy.boxSelectionEnabled(false);
        this.mycytoscape.eh.enable();
        this.mycytoscape.cy.on('click', event => {
            let element = {
                group: 'nodes',
                position: event.position,

            }
            this.mycytoscape.add(element);
        });

    }
    removeListener() {
        this.mycytoscape.cy.off("click");
    }
}



class EditState extends MyCyState {
    constructor(myCy) {
        super(myCy);
        this.edit = true;
        this.mode = Mode.EDIT;
        this.mycytoscape.cy.boxSelectionEnabled(true);
        this.mycytoscape.eh.disable();
        this.mycytoscape.cy.on("box", event => {
            this.mycytoscape.boxing = true;
        });

        document.addEventListener("keydown", event => {
            console.log("edit : ", this.edit);
            if (this.mycytoscape.boxing && this.edit == true) {
                if (event.ctrlKey) {

                    if (event.key === 'c') {
                        this.mycytoscape.selectedEles = this.mycytoscape.cy.$(':selected');

                    } else if (event.key == 'v' && this.mycytoscape.selectedEles != {}) {
                        this.mycytoscape.cb.paste(this.mycytoscape.cb.copy(this.mycytoscape.selectedEles));
                        this.mycytoscape.selectedEles = {};
                        this.mycytoscape.boxing = false;
                    }
                }
            }
            if (event.ctrlKey && event.key == 'z' && this.edit == true) {
                this.mycytoscape.store.eles = this.mycytoscape.cy.elements('');
                if (!this.mycytoscape.store.isEmpty()) {
                    this.mycytoscape.store.ele = this.mycytoscape.store.eles[this.mycytoscape.store.eles.length - 1];
                    this.mycytoscape.store.push(this.mycytoscape.store.ele);
                    this.mycytoscape.cy.remove(this.mycytoscape.store.ele);
                    this.mycytoscape.store.cursor++;
                }
            }
            if (event.ctrlKey && event.key == 'y' && this.edit == true) {
                if (this.mycytoscape.store.storage.length > 0 && this.mycytoscape.store.cursor > 0) {
                    this.mycytoscape.store.ele = this.mycytoscape.store.pop();
                    this.mycytoscape.store.ele.restore();
                    this.mycytoscape.store.cursor--;
                    console.log(this.mycytoscape.store.cursor);
                }
            }
            if (event.key == "Delete" && this.edit == true) {

                this.mycytoscape.cy.remove(this.mycytoscape.cy.elements(':selected'));
            }
        });


    }
    removeListener() {
        this.edit = false;

    }
}