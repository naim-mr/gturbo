class Store {
    constructor() {
        this.storage = [];
        this.ele;
        this.eles;
        this.cursor = 0;
    }
    pop() {
        return this.storage.pop();
    }
    length() {
        return this.storage.length
    }
    push(el) {

        this.storage.push(el);
    }
    isEmpty() {
        return (this.eles.length == 0);
    }

    free() {
        this.storage = [];
        this.cursor = 0;


    }
}