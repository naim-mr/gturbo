from flask import Flask, jsonify,request
from flask.helpers import make_response
import json 
from flask_cors import CORS 
import libgt.data.Graph as GraphModule
from libgt.data.Sheaf import Parametrisation
from libgt.data.Graph import Graph, GraphO, GraphM
from libgt.engine.PFunctor import FlatPFunctor
from libgt.engine.GT import GT
import sys
# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

class JSON_encoder:
    
    def __init__(self,js):
        self.json= js
        self.g=GraphO()
        self.nodeMap={}
        self.edgeMap={}
        self.nodeInvMap={}
        self.edgeInvMap={}
        for n in self.json['nodes']:
            n=int(n)
            v=self.g.add_node()
            self.nodeMap[n]=v
            self.nodeInvMap[v]=n
        for e in self.json['edges']:
            
            i=int(self.json['edges'][e]['src'])
            j=int(self.json['edges'][e]['dst'])
            a=self.g.add_edge(i,j)
            self.edgeMap[int(e)]=a
            self.edgeInvMap[a]=e

class JSON_decoder:
    def __init__(self,j1,j2 ):
        self.incGenerator= Graph.pattern_match(j1.g,j2.g)
        self.inclusions=[]
        for inc in self.incGenerator:
            self.inclusions.append('{')
            cursor= len(self.inclusions)-1
            inNode=True
            self.inclusions[cursor]+='"nodeMap":{'
            for key in inc.l.items():                
                if(isinstance(key[0],tuple)):
                    print(key,file=sys.stderr)
                    if(inNode):
                        if(self.inclusions[cursor][len(self.inclusions[cursor])-1]==','):
                            self.inclusions[cursor]= self.inclusions[cursor][0:-1]        
                        self.inclusions[cursor]+='},'
                        self.inclusions[cursor] += '"edgeMap":{'
                        inNode=False
                    self.inclusions[cursor]+='"'+ str(j1.edgeInvMap[key[0]])+'":'+str(j2.edgeInvMap[key[1]])+','
                else : 
                    self.inclusions[cursor]+='"'+str(key[0])+ '":'+str(key[1])+','
                    inNode=True
            if(self.inclusions[cursor][len(self.inclusions[cursor])-1]==','):
                            self.inclusions[cursor]= self.inclusions[cursor][0:-1]          
            self.inclusions[cursor] += '}}'

    def decoder(self):
        print(self.inclusions,file=sys.stderr)
        return json.dumps(self.inclusions)





def hs_to_graphO(hs):
    g=GraphO()
    nodelist= []
    edgelist=[]
    for j in range(hs['nodeCpt']+1):
        if(str(j) in hs['nodes']):
            nodelist.append(g.add_node())
    for k in range(hs['edgeCpt']+1):
        if(str(k) in hs['edges']):
            src=int(hs['edges'][str(k)]['src'])
            dst=int(hs['edges'][str(k)]['dst'])
            edgelist.append(g.add_edge(src,dst))
    return g
          




# sanity check route
@app.route('/json', methods=['POST','GET'])
def jsoni():
    content= request.data.__len__
    print(content,file=sys.stderr)
    return "ok"

@app.route('/Inclusion', methods=['POST'])
def autoInc():
    js=json.loads(request.data)
    j1= JSON_encoder(js[0])
    j2= JSON_encoder(js[1])
    jdecoder= JSON_decoder(j1,j2)
    print(jdecoder.decoder(),file=sys.stderr)
    return jdecoder.decoder()
    

@app.route('/globalT', methods=['POST'])
def pattern():
    rulesystem= request.json
    ruleMax= rulesystem['nodeCpt']
    incMax= rulesystem['edgeCpt']
    rules= rulesystem['nodes']
    inclusions= rulesystem['edges']
    nodes=[]
    py_graph=[]
    pfTm = FlatPFunctor.Maker(Graph, Graph)
    for i in range(ruleMax+1):
        if(str(i) in rules):
            rule=rules[str(i)]
            lhs= rule['data']['lhs']
            rhs= rule['data']['rhs']
            l=GraphO()
            for j in range(lhs['nodeCpt']+1):
                if(str(j) in lhs['nodes']):
                    nodes.append(l.add_node())

            for k in range(lhs['edgeCpt']+1):
                if(str(k) in lhs['edges']):
                    src=int(lhs['edges'][k]['src'])
                    dst=int(lhs['edges'][k]['dst'])
                    l.add_edge(src,dst)
    
            for j in range(rhs['nodeCpt']+1):
                if(str(j) in rhs['nodes']):
                    nodes.append(r.add_node())

            for k in range(rhs['edgeCpt']+1):
                if(str(k) in rhs['edges']):
                    src=int(rhs['edges'][k]['src'])
                    dst=int(rhs['edges'][k]['dst'])
                    r.add_edge(src,dst)
            py_graph.append(pfTm.add_rule(l,r))
    
    for i in range(incMax+1):
        if(str(i) in inclusions):
            inc= inclusions[str(i)]

    return "ok"         
# sanity check routeru
@app.route('/save', methods=['GET'])
def pong():
    return ""

if __name__ == '__main__':
    app.run()