import json

from flask import Flask, jsonify, request
from flask_cors import CORS

from . import decoder
from . import encoder
from .transform import run_transform, TransformError


def create_app():
    app = Flask(__name__)
    # max_age: the browser remembers the CORS preflight instead of asking before every POST
    CORS(app, resources={r'/*': {'origins': '*'}}, max_age=7200)

    @app.route('/')
    def index():
        return 'Index'

    @app.route('/Inclusion', methods=['POST'])
    def autoInc():
        """All the morphisms of the first graph into the second one."""
        js = json.loads(request.data)
        j1 = encoder.JSON_encoder(js[0])
        j2 = encoder.JSON_encoder(js[1])
        return jsonify(decoder.JSON_decoder(j1, j2).decoder())

    @app.route('/transform', methods=['POST'])
    def transform():
        try:
            return jsonify(run_transform(request.get_json()))
        except TransformError as e:
            return jsonify(error=e.message, details=e.details), 422
        except Exception as e:  # libgt failed on a system it cannot handle
            app.logger.exception('transform failed')
            return jsonify(error='The transformation failed: %s' % e, details=[]), 500

    return app
