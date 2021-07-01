from flask import Flask, jsonify,request
from flask.helpers import make_response
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

@app.route('/autoInclusion', methods=['POST'])
def autoInc():
    lhs=request.json
    l= hs_to_graphO(lhs)
    auto=[]
    for i in Graph.pattern_match(l,l):
         auto.append(i.l)
    print('auto',file=sys.stderr)
    print(l,file=sys.stderr)
    print(auto,file=sys.stderr)
    response=jsonify(str(auto))
    return response

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