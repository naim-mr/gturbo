class RuleInclusionComponent {
    static IncObs= class extends RuleInclusionObserver{
        constructor(ric,ri){
            super(r);
            this.ric=ri;
        }
    }
    constructor(i){
        this.ri=ri;
        new RuleInclusionComponent.IncObs(ri)
    }
}