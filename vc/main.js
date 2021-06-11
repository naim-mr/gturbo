var create_rule;
let body = document.getElementById("myTabContent");
var vide = true;
var ruleset = document.getElementById("ruleset");

if (vide) {
   ruleset.innerHTML = '<li class="nav-item"><button type="button" onclick="onCreateRule()" id="create" class="btn btn-light">Create Rule</button></li>';
   create_rule = document.getElementById("create");
   vide = false;
}

var inclusion = document.getElementById("inclusionset");
inclusion.innerHTML = '<li class="nav-item"><button type="button" onclick="onCreateInclusion()" id="icreate" class="btn btn-light">Create Inclusion</button></li>';



let vue = new Vue();


let g1 = new Graph();
let g2= new Graph();
let rule=new Rule(g1,g2);
let rs= new RuleSystem(rule);
let lgc=new GraphComponent(g1,"lhs");
let rgc= new GraphComponent(g2,"rhs");
let rc= new RuleComponent(lgc,rgc,rule);
let rsc= new RuleSystemComponent(rs,rc);

vue.rsc=rsc;
vue.state.createRule();