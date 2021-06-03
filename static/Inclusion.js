class InclusionList {
    constructor() {
        this.inclusions = [];
        this.counter = 0;
        this.current = 0;
        this.counterbis = 0;
    }
    push(inclusion) {
        let bool = true;
        this.inclusions.push(inclusion);
        this.counter++;
    }
    setCurrent(n) {
        this.current = n;
    }
    getCurrent() {

        console.log("cur: " + this.current);
        console.log(this);
        if (this.current < this.inclusions.length) return this.inclusions[this.current];
        else throw "Error: out of bound morphisms length is smaller than " + this.current;
    }
    length() {
        return this.inclusions.length;
    }

}
class Inclusion {
    constructor(src, dest, morphism) {
        this.src = src;
        this.dest = dest;
        this.morphism = morphism;

    }
    addMorphism(eleSrc, eleDest) {
        this.morphisms.push(new Morphism(eleSrc, eleDest));
    }
    getMorphism(n) {
        if (n < this.morphisms.length) return this.list[n];
        else throw "Error: out of bound morphisms length is smaller than " + n;
    }
    morphismsLength() {
        return this.morphisms.length;
    }

}

class Morphism {
    constructor(eleSrc, eleDest) {
        this.eleSrc = eleSrc;
        this.eleDest = eleDest;
    }
}