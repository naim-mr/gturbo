



     
class GraphComponent {

    static GraphObs= class extends GraphObserver{
        constructor(gc,g){
            super(g);
            this.gc=gc;
        }
        on_addNode(idn,px,py){
            this.gc.cy.add({
                group:'nodes',
                position:{ x:px, y:py},
                data: {id:idn}
            });
        }
        on_addEdge(ide,src,dest){
            let isInCyto= true;
            
            if(this.gc.idInCy[ide]==undefined)isInCyto=false;
            if(!isInCyto){ 
                let idC=this.gc.cy.add({group:'edges',data:{source:src,target:dest}});
                console.log('add '+ide+':'+idC.id())    ;
                this.gc.idInCy[ide]=idC.id();
                this.gc.idInGraph[idC.id()]=ide;
            }
            console.log(this.gc.idInGraph);
        }
        on_removeEdge(id){           
            this.gc.cy.remove(this.gc.cy.getElementById(this.gc.idInCy[id]));
        }
        on_removeNode(id){
            this.gc.cy.remove(this.gc.cy.getElementById(id));
        }

    }
    // typeof(g): Graph
    constructor(g, idComp) {
        this.graph = g;
        this.graphObs = new GraphComponent.GraphObs(this,g);
        this.idInCy={};
        this.idInGraph={}
        this.lastClick={};
        this.cy = this.cy = cytoscape({
            zoomEnabled: false,
            container: document.getElementById(idComp),
            layout: {
                name: 'grid',
                rows: 2,
                cols: 2
            },
            style: [{
                    selector: 'node',
                    style: {
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle'
                    }
                },
                {
                    selector: '.eh-handle',
                    style: {
                        'background-color': 'red',
                        'width': 12,
                        'height': 12,
                        'shape': 'ellipse',
                        'overlay-opacity': 0,
                        'border-opacity': 0
                    }
                },
                {
                    selector: '.eh-hover',
                    style: {
                        'background-color': 'red'
                    }
                },
                {
                    selector: '.eh-source',
                    style: {
                        'border-width': 2,
                        'border-color': 'red'
                    }
                },
                {
                    selector: '.eh-target',
                    style: {
                        'border-width': 2,
                        'border-color': 'red'
                    }
                },
                {
                   selector: '.eh-preview, .eh-ghost-edge',
                   style: {
                       'background-color': 'red',
                       'line-color': 'red',
                       'target-arrow-color': 'red',
                       'source-arrow-color': 'red'
                    }
                },
                {
                    selector: '.eh-ghost-edge.eh-preview-active',
                    style: {
                        'opacity': 0
                    }
                }
            ],
            elements: {
                nodes: [],
                edges: []
            }
        });
        this.eh = this.cy.edgehandles({ });          
        this.eh.enableDrawMode({});
        this.ctrlKey=false;
        document.addEventListener('keydown',(event)=> {
            if(event.ctrlKey){
                this.ctrlKey=true;
            }else if(event.key=="Delete"){
               this.onDelete()
                
            }if (event.key === 'c' &&  event.ctrlKey) {
                    this.selectedEles = this.cy.$(':selected');
            } else if (event.key == 'v' && this.selectedEles != {} && this.lastClick!={}) {                  
                    this.onPaste()
            }
        });
        document.addEventListener('keyup',(event)=> {
            if(event.ctrlKey){
                this.ctrlKey=false;
            }
            
        });
        this.cy.on('click',(event)=>{
            this.onClick(event);
            
        });
        this.cy.on("ehcomplete", (event, sourceNode, targetNode, addedEles)=>{
            this.idInCy[this.graph.edgeCpt]=addedEles.id();
            this.idInGraph[addedEles.id()]=this.graph.edgeCpt;
            this.graph.addEdge(sourceNode.id(),targetNode.id());
           
        })
        

    }
    onDelete(){
        console.log("ondelete") ;
        
        for(let i=0 ; i<this.cy.edges('').length;i++){                
            if(this.cy.edges('')[i].selected()){
                console.log("ideCY: "+this.cy.edges('')[i].id());
                this.graph.removeEdge(this.idInGraph[this.cy.edges('')[i].id()]);
            }
        }
        for(let i=0 ; i< this.cy.nodes('').length;i++){                 
            if(this.cy.nodes('')[i].selected()){
                this.graph.removeNode(this.cy.nodes('')[i].id());
            }
            
        }
        
    }
    onPaste(){
        if(this.selectedEles.length>1){
            let center=this.selectedEles[0].position();
            let translation= {x:this.lastClick['x']-center['x'],y:this.lastClick['y']-center['y']}                                   
            for(let i=0;i<this.selectedEles.length;i++){
              let element= this.selectedEles[i];
              if(element.isNode()) this.graph.pasteNode(element.id(),element.position()['x'],element.position()['y'],translation);
            }
            this.graph.resetVisited();
            this.selectedEles={};

       }
    }
     onClick(event){
        this.lastClick=event.renderedPosition;
        if(this.ctrlKey){
           this.graph.addNode(event.renderedPosition['x'],event.renderedPosition['y']);
           this.graph.nodes;
           this.ctrlKey=false;
        }
     }
    save(n, handside) {

        this.savefactor('', n, handside);
        this.savefactor('i', n, handside);
        this.savefactor('g', n, handside);

    }
    savefactor(str, n, handside) {

        let jpeg = this.cy.jpeg({ bg: 'rgb(255, 224, 183)' });
        console.log("img /"+n);
        let img = document.getElementById(str + 'rule' + handside + n)
        img.setAttribute('src', jpeg);
        img.setAttribute('style', 'width:50%;padding:1%');
    }
    refresh(){
        
        for(const node in this.graph.nodes){
            let id=this.cy.add({
                
                group:'nodes',
                data:{
                      id: node
                      
                },
                position:{x:this.graph.nodes[node]['x'],y:this.graph.nodes[node]['y']}
            });
        }
        
        for(const edge in this.graph.edges){
            let id=this.cy.add({
                
                group:'edges',
                data:{
                    id:this.idInCy[edge],
                    source: this.graph.edges[edge]['src'],
                    target: this.graph.edges[edge]['dst'],
                },
            
            });
            
        }
        
    }

    

}
