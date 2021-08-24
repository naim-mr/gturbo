import sqlite3
from flask import current_app, g
from flask.cli import with_appcontext
import click
import os.path
import sys
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "db.sql")
print(DATABASE,file=sys.stderr)

def get_db():
    g.db = sqlite3.connect(DATABASE)
    g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()
    db.executescript("""
            DROP TABLE IF EXISTS user;
            CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
            );


        """)



@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Initialized the database.')



def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

