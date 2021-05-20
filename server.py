        
from flask import *

app = Flask(__name__)

@app.route('/print_inclusion/')
def inclusion():
    return render_template("print_inclusion.html")

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/create_rule/')
def create_rule():
    return render_template("create_rule.html")

@app.route('/welcome/', methods=['POST','GET'])
def welcome():
        if request.method =='POST':
            firstname=request.form['firstname']
            return render_template("welcome.html",firstname=firstname)
        else :
            return 'coucou '
@app.route('/login')
def login():
    return 'login'

@app.route('/user/<username>')
def profile(username):
    return '{}\'s profile'.format(escape(username))
