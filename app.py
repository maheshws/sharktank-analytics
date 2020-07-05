from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
#import scrape_mars
import sqlite3
from flask import g , request,jsonify
from flask_sqlalchemy import SQLAlchemy
import os.path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "db\\sharktank.sqlite")

#file_path = os.path.abspath(os.getcwd())+"\data\database.db"
#DATABASE = 'sqlite:///static\data\podcast.sqlite'
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
app.config['JSON_SORT_KEYS'] = False
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
@app.route('/api/v1/deals/dealsbyshark/all', methods=['GET'])
def api_all():
     conn = sqlite3.connect(db_path)
     conn.row_factory = dict_factory
     cur = conn.cursor()
     category_ncount = cur.execute('select * from DealsbySharks;').fetchall()
     cur.close()
     conn.close()
     return jsonify(category_ncount)

@app.route('/api/v1/deals/dealsbycategory/all', methods=['GET'])
def api_alldealsbycategory():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    alldealsbycategory = cur.execute('SELECT * FROM DealsbyCategory;').fetchall()
    cur.close()
    conn.close()
    return jsonify(alldealsbycategory)

@app.route('/api/v1/deals/dealsbyseason/all', methods=['GET'])
def api_alldealsbyseason():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    alldealsbyseason = cur.execute('SELECT * FROM DealsbySeason;').fetchall()
    cur.close()
    conn.close()
    return jsonify(alldealsbyseason)

@app.route('/api/v1/deals/dealsbygender/all', methods=['GET'])
def api_alldealsbygender():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    alldealsbygender = cur.execute('SELECT *  FROM DealsGenderDistribution;').fetchall()
    cur.close()
    conn.close()
    return jsonify(alldealsbygender)

@app.route('/api/v1/deals/dealsbycategoryandgender/all', methods=['GET'])
def api_alldealsbycategoryandgender():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    alldealsbycategoryandgender = cur.execute('SELECT * FROM DealsbyCategoryandGender;').fetchall()
    cur.close()
    conn.close()
    return jsonify(alldealsbycategoryandgender)

@app.route('/api/v1/deals/dealsbyshark/<sharkname>', methods=['GET'])
def api_sharkportfolio(sharkname):
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    query = "SELECT * FROM DealsbySharks where Sharks=?"
    sharkportfolio = cur.execute(query,(sharkname,)).fetchall()
    cur.close()
    conn.close()
    return jsonify(sharkportfolio)

@app.route('/api/v1/deals/sharkscategory/all', methods=['GET'])
def api_allcategoryforsharks():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    allcategoryforsharks = cur.execute("SELECT * FROM Temp").fetchall()
    cur.close()
    conn.close()
    return jsonify(allcategoryforsharks)

@app.route('/api/v1/deals/sharkscategory/summary', methods=['GET'])
def api_alldealssummary():
    conn = sqlite3.connect(db_path)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    alldealssummary = cur.execute("SELECT * FROM Summary").fetchall()
    cur.close()
    conn.close()
    return jsonify(alldealssummary)

if __name__ == "__main__":
    app.run(debug=False)
