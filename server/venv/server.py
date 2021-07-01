from flask import Flask, jsonify,request
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


# sanity check route
@app.route('/json', methods=['POST','GET'])
def jsoni():
    if(request.method == 'POST'):
        content= request.json
        print( content['nodes'])
    return content


@app.route('/patternmatching', methods=['POST'])
def pattern():
    content= request.json
    
    return content
# sanity check route
@app.route('/save', methods=['GET'])
def pong():
    return ""

if __name__ == '__main__':
    app.run()