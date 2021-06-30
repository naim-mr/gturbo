from flask import Flask, jsonify
from flask_cors import CORS
from libgt import engine,data
# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


# sanity check route
@app.route('/', methods=['GET'])
def ping_pong():
    return ""

# sanity check route
@app.route('/save', methods=['GET'])
def pong():
    return ""

if __name__ == '__main__':
    app.run()