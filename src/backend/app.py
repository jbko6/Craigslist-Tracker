from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson.objectid import ObjectId
from schema import ItemSchema, ConfigSchema
from marshmallow import ValidationError
from tracker import Tracker
from alerts import initAlerts
import time

app = Flask('Craigslist Tracker')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
client = MongoClient('localhost', 5002)
db = client.craigslist_tracker_db
items = db.items
config = db.config
tracker = Tracker(db)
tracker.queryItems()
initAlerts()

# status logging stuff
startTime = time.time()

@app.route('/')
@cross_origin()
def access_index():
    return render_template('index.html')

@app.route('/items/', methods=['GET', 'POST', 'DELETE'])
@cross_origin()
def access_items():
    if request.method == 'GET':
        cursor = items.find({})
        item_list : list = []
        for item in cursor:
            item_json = ItemSchema().dump(item)
            
            if request.args.get('detailed', type=str) != None:
                if request.args.get('detailed', type=str).lower() != "true":
                    item_json['history'] = {}
            else:
                item_json['history'] = {}

            item_list.append(item_json)
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
@cross_origin()
def access_item(id):
    try:
        ObjectId(id)
    except:
        return "Invalid ID", 404
    
    item = items.find_one(ObjectId(id))
    if item == None:
        return 'Could not find item with specified ID.', 404

    if request.method == 'GET':
        return ItemSchema().dump(item), 200
    if request.method == 'POST':
        form = request.json
        result = items.update_one({'_id': ObjectId(id)}, {'$set': form})
        return "Updated " + str(result.modified_count) + " value(s).", 200
    
    deleteResult = items.delete_one({'_id': ObjectId(id)})
    if deleteResult == None:
        return 'Something went wrong and nothing was deleted.', 404

    return "Item with ID " + id + " deleted.", 200

@app.route('/config', methods=['GET', 'POST'])
@cross_origin()
def access_config():
    if request.method == 'GET':
        con = config.find_one({})
        con['_id'] = str(con['_id'])
        return con, 200
    
    form = request.json
    validatedConfig : dict
    try:
        validatedConfig = ConfigSchema().load(form)
    except ValidationError as error:
        return error.messages, 400

    config.delete_many({})
    config.insert_one(validatedConfig)
    tracker.updateConfig()
    return "Configured.", 200

@app.route('/query', methods=['POST', 'GET'])
@cross_origin()
def acess_query():
    started : bool
    try:
        started = tracker.queryItems()
    except Exception as error:
        return str(error), 400
    
    if started:
        return "Query started.", 200
    return "Query already in progress.", 200

@app.route('/status', methods=['GET'])
@cross_origin()
def access_status():
    con = config.find_one({})
    con['_id'] = str(con['_id'])
    return {'uptime': time.time() - startTime, 'config': con}