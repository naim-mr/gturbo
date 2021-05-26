class DrawState extends CytoState {
    constructor(myCy) {
        super(myCy);
        this.mode = Mode.DRAW;

        this.mycytoscape.cy.on('click', event => {
            console.log("draw");
            let element = {
                group: 'nodes',
                position: event.position,

            }
            this.mycytoscape.add(element);


        });

    }
    removeListener() {
        console.log("ok");
        this.mycytoscape.cy.off("click");

    }
}