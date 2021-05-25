class EditState extends CytoState {
    constructor(myCy) {
        super(myCy)

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
                    this.store.cursor++;
                }

            }
            if (event.ctrlKey && event.key == 'y') {
                if (this.store.storage.length > 0 && this.store.cursor > 0) {
                    this.store.ele = this.store.pop();
                    this.store.ele.restore();
                    this.store.cursor--;
                }

            }
            if (event.key == "Delete") {

                this.cy.remove(this.cy.elements(':selected'));


            }
        });


    }
    removeListener() {

        document.removeEventListener("keydown");
    }
}