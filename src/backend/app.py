from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from schema import ItemSchema
from marshmallow import ValidationError
from tracker import Tracker

app = Flask('Craigslist Tracker')
client = MongoClient('localhost', 5002)
db = client.craigslist_tracker_db
items = db.items
config = db.config
tracker = Tracker(db)

@app.route('/')
def access_index():
    return render_template('index.html')

@app.route('/items/', methods=['GET', 'POST', 'DELETE'])
def access_items():
    if request.method == 'GET':
        cursor = items.find({})
        item_list : list = []
        for item in cursor:
            item_list.append(ItemSchema().dump(item))
        return item_list, 200
    if request.method == 'DELETE':
        items.delete_many({})

        return 'Deleted all items', 200
    
    form = request.json
    validatedForm : dict
    try:
        validatedForm = ItemSchema().load(form)
    except ValidationError as error:
        return error.messages, 400
    
    item_id = items.insert_one(validatedForm).inserted_id

    return 'Created item with ID ' + str(item_id), 200

@app.route('/items/<id>', methods=['GET', 'POST', 'DELETE'])
def access_item(id):
    try:
        objectId = ObjectId(id)
    except:
        return "Invalid ID", 400

    if request.method == 'GET':
        item = items.find_one(ObjectId(id))
        if item == None:
            return 'Could not find item with specified ID.', 404
        
        return ItemSchema().dump(item), 200
    if request.method == 'POST':
        # post stuff
        return "you got me", 200
    
    deleteResult = items.delete_one(ObjectId(id))
    if deleteResult == None:
        return 'Could not find item with specified ID.', 404

    return "Item with ID " + id + " deleted.", 200

@app.route('/config', methods=['GET', 'POST'])
def access_config():
    if request.method == 'GET':
        con = config.find_one({})
        con['_id'] = str(con['_id'])
        return con, 200

    config.delete_many({})
    config.insert_one({'city' : 'seattle', 'max_searches' : 10, 'search_delay' : 3})
    tracker.updateConfig()
    return "Configured.", 200

@app.route('/query', methods=['POST', 'GET'])
def acess_query():
    started : bool
    try:
        started = tracker.queryItems()
    except Exception as error:
        return str(error), 400
    
    if started:
        return "Query started.", 200
    return "Query already in progress.", 200