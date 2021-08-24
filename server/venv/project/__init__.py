

from flask import (
    Flask,Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flask.helpers import make_response
from flask import Blueprint
from . import db
import sys
import json
from . import decoder
from . import encoder
from flask_cors import CORS 
import libgt.data.Graph as GraphModule
from libgt.data.Graph import Graph, GraphO, GraphM
from libgt.engine.GT import GT


def create_app():
    app=Flask(__name__)
    db.init_app(app)
    
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
    def register():
        if request.method == 'POST':
            req=json.loads(request.data)
            username = req['username']
            password = req['password']
            bd = db.get_db().cursor()
            error = None
            if not username:
                error = 'Username is required.'
            elif not password:
                error = 'Password is required.'
            elif bd.execute(
                'SELECT id FROM user WHERE username = ?', (username,)
            ).fetchone() is not None:
                error = 'User {} is already registered.'.format(username)

            if error is None:
                bd.execute(
                    'INSERT INTO user (username, password) VALUES (?, ?)',
                    (username, generate_password_hash(password))
                )
                bd.commit()
                return {'username':username}

            flash(error)
        return ''
    return app