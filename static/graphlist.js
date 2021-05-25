class GraphList {
    constructor() {
        this.list = [new Rule()];
        this.counter = 0;
        this.current = 0;
    }
    push(rule) {
        this.list.push(rule);
        this.counter++;
    }
    getRule(n) {
        return this.list[n];
    }
    length() {
        return this.list.length;
    }
    getCurrent() {
        return this.list[this.current];
    }
    setCurrent(n) {
        this.current = n;
    }
}