from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
#import scrape_mars
import sqlite3
from flask import g , request,jsonify
from flask_sqlalchemy import SQLAlchemy
import os.path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "static\\data\\podcast.sqlite")

#file_path = os.path.abspath(os.getcwd())+"\data\database.db"
DATABASE = 'sqlite:///static\data\podcast.sqlite'
#
# def get_db():
#     db = getattr(g, '_database', None)
#     if db is None:
#         db = g._database = sqlite3.connect(DATABASE)
#     return db
#
# @app.teardown_appcontext
# def close_connection(exception):
#     db = getattr(g, '_database', None)
#     if db is not None:
#         db.close()

# Create an instance of Flask
app = Flask(__name__)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///static\data\podcast.sqlite'
# db = SQLAlchemy(app)
#
# db.Model.metadata.reflect(db.engine)
#
# class Categories(db.Model):
#     __tablename__ = 'categories'
#     __table_args__ = { 'extend_existing': True }
#     LOC_CODE = db.Column(db.Text, primary_key=False)


# Use PyMongo to establish Mongo connection
#mongo = PyMongo(app, uri="mongodb://localhost:27017/marsinfo_db")
# select count(podcast_id) , category from categories
# group by category
# order by category
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# Route to render index.html template using data from Mongo
@app.route("/")
def home():
    return render_template("index.html")


# Route that will trigger the scrape function
@app.route('/api/v1/podcasts/categories/all', methods=['GET'])
def api_all():
     conn = sqlite3.connect(db_path)
     conn.row_factory = dict_factory
     cur = conn.cursor()
     category_ncount = cur.execute('select count(podcast_id) as reviews , category from categories group by category order by category;').fetchall()
     return jsonify(category_ncount)


if __name__ == "__main__":
    app.run(debug=True)
