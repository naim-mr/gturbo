class EditState extends CytoState {
    constructor(myCy) {
        super(myCy);
        console.log("oucouc");
        console.log(this);
        this.mode = Mode.EDIT;
        document.addEventListener("keydown", event => {
            if (this.mycytoscape.boxing) {
                if (event.ctrlKey) {
                    if (event.key === 'c') {
                        this.mycytoscape.selectedEles = this.mycytoscape.cy.$(':selected');
                    } else if (event.key == 'v' && this.mycytoscape.selectedEles != {}) {
                        this.mycytoscape.cy.paste(this.mycytoscape.cb.copy(this.mycytoscape.selectedEles));
                        this.mycytoscape.selectedEles = {};
                        this.mycytoscape.boxing = false;
                    }
                }
            }
            if (event.ctrlKey && event.key == 'z') {

                this.mycytoscape.store.eles = this.mycytoscape.cy.elements('');

                if (!this.mycytoscape.store.isEmpty()) {

                    this.mycytoscape.store.ele = this.mycytoscape.store.eles[this.mycytoscape.store.eles.length - 1];
                    this.mycytoscape.store.push(this.mycytoscape.store.ele);
                    this.mycytoscape.cy.remove(this.mycytoscape.store.ele);
                    this.mycytoscape.store.cursor++;
                }

            }
            if (event.ctrlKey && event.key == 'y') {
                if (this.mycytoscape.store.storage.length > 0 && this.mycytoscape.store.cursor > 0) {
                    this.mycytoscape.store.ele = this.mycytoscape.store.pop();
                    this.mycytoscape.store.ele.restore();
                    this.mycytoscape.store.cursor--;
                    console.log(this.mycytoscape.store.cursor);
                }

            }
            if (event.key == "Delete") {

                this.mycytoscape.cy.remove(this.mycytoscape.cy.elements(':selected'));


            }
        });


    }
    removeListener() {

        //document.removeEventListener("keydown");
    }
}