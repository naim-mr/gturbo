class DrawState extends CytoState {
    constructor(myCy) {
        super(myCy);

        this.mycytoscape.cy.on('click', event => {
            console.log(this.mycytoscape);
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