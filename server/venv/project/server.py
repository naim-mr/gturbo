
from flask import Flask, jsonify,request
from flask.helpers import make_response
from flask import Blueprint

import decoder
import encoder


from flask_cors import CORS 
import libgt.data.Graph as GraphModule
from libgt.data.Graph import Graph, GraphO, GraphM
from libgt.engine.GT import GT


import json
import sys

from . import db
# configuration
DEBUG = True

# enable CORS

CORS(app, resources={r'/*': {'origins': '*'}})
@app.route('/')
def index():
    return 'Index'

@app.route('/profile/')
def profile():
    return 'Profile'



@app.route('/Inclusion', methods=['POST'])
def autoInc():
    js=json.loads(request.data)
    j1= encoder.JSON_encoder(js[0])
    j2= encoder.JSON_encoder(js[1])
    jdecoder= decoder.JSON_decoder(j1,j2)
    print(jdecoder.decoder(),file=sys.stderr)
    return jdecoder.decoder()
    


@app.route('/save', methods=['GET'])
def pong():
    return ""
@app.route('/signup',methods=['POST'])
def signup():

    print("oui",file=sys.stderr)
    return 'sign'
if __name__ == '__main__':
    app.run()