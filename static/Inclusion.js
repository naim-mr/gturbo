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
        if (this.current < this.inclusions.length) return this.inclusions[this.current];
        else throw "Error: out of bound morphisms length is smaller than " + this.current;
    }
    length() {
        return this.inclusions.length;
    }
    printInclusions() {
        let len = this.inclusions.length;

        if (len == 0) {
            return str;
        }

        let obj = [];
        let k = -1;
        this.inclusions.forEach(element => { element.visited = false });

        for (let i = 0; i < len; i++) {
            let src = this.inclusions[i].src;
            let dest = this.inclusions[i].dest;
            let morph = this.inclusions[i].morphism;

            if (this.inclusions[i].visited == false) {
                obj.push({

                    source: src,
                    destiation: dest,
                    morphismes: [morph]

                })
                k++;
                this.inclusions[i].visited = true;
            }
            for (let j = i + 1; j < len; j++) {
                if (this.inclusions[j].src == src && this.inclusions[j].dest == dest) {
                    obj[k].morphismes.push(this.inclusions[j].morphism);
                    this.inclusions[j].visited = true;
                }
            }
        }
        console.log(obj);

    }

}
class Inclusion {
    constructor(src, dest, morphism) {
        this.src = src;
        this.dest = dest;
        this.morphism = morphism;
        this.visited = false;

    }

}

class Morphism {
    constructor(eleSrc, eleDest) {
        this.eleSrc = eleSrc;
        this.eleDest = eleDest;
    }
}