class InclusionList {
    constructor() {
        this.inclusions = [];
        this.counter = 0;
        this.current = 0;
    }
    push(inclusion) {
        this.inclusions.push(inclusion);
    }
    addInclusion(src, dest, morphisms) {
        this.inclusions.push(new Inclusion(src, dest, morphisms));
    }
    getInclusion(n) {
        if (n < this.inclusions.length) return this.inclusions[n];
        else throw "Error: out of bound morphisms length is smaller than " + n;
    }
    length() {
        return this.inclusions.length;
    }

}
class Inclusion {
    constructor(src, dest, morphisms) {
        this.src = src;
        this.dest = dest;
        this.morphisms = [];

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