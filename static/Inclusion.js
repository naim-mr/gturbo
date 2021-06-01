class InclusionList {
    constructor() {
        this.inclusions = [];
        this.counter = 0;
        this.current = 0;
    }
    push(inclusion) {
        let bool = true;
        this.inclusions.forEach(i => {
            if (i.src == inclusion.src && i.dest == inclusion.dest) {
                i.addMorphism(inclusion.morphisms);
                bool = false;

            }

        })
        if (bool) this.inclusions.push(inclusion);
        this.counter++;
    }
    setCurrent(n) {
        this.current = n;
    }
    getCurrent() {

        if (n < this.inclusions.length) return this.inclusions[this.current];
        else throw "Error: out of bound morphisms length is smaller than " + n;
    }
    length() {
        return this.inclusions.length;
    }

}
class Inclusion {
    constructor(src, dest, morphisms, id) {
        this.src = src;
        this.dest = dest;
        this.morphisms = morphisms;
        this.id = id;
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