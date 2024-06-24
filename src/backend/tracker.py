from pymongo.database import Database
from pymongo.collection import Collection
from schema import ListingSchema, QuerySchema
from marshmallow import ValidationError
from math import floor
import pandas as pd
import craigslistscraper as cs
import datetime
import threading
import time

class Tracker:

    db : Database
    items : Collection
    configCollection : Collection

    config : dict

    queryThread : threading.Thread = None

    def __init__(self, database : Database) -> None:
        self.db = database
        self.items = database.items
        self.configCollection = database.config
        self.config = self.configCollection.find_one({})

    def updateConfig(self):
        self.config = self.configCollection.find_one({})
    
    # returns true if query started, false if query already in progress
    def queryItems(self) -> bool:
        if self.queryThread == None or not self.queryThread.is_alive():
            self.queryThread = threading.Thread(target=self.queryItemsThreaded)
            self.queryThread.start()
            return True
        return False
    
    def queryItemsThreaded(self):
        cursor = self.items.find({})

        city = self.config['city']
        for item in cursor:
            query = item['query']
            category = item['category']

            search = cs.Search(query, city, category)
            print("Performed search for " + str(query))

            status = search.fetch()
            if status != 200:
                raise Exception("Craigslist search for " + str(query) + " failed with status " + str(status) + ".")

            query_dict = {}
            query_dict['datetime'] = str(datetime.datetime.now())
            query_dict['listings'] = []
            query_dict['quantity'] = len(search.ads)

            truncated_ads = search.ads

            for i in range(0, len(truncated_ads) - self.config['max_searches']):
                truncated_ads.pop()

            for ad in truncated_ads:
                listing_dict = {}

                status = ad.fetch()
                if status != 200:
                    raise Exception("Craiglist ad fetch for " + str(query) + " failed with status " + str(status) + ". ")
                
                print("Performed ad fetch for " + str(query))

                try:
                    listing_dict = ListingSchema().load(ad.to_dict())
                except ValidationError as error:
                    raise Exception("Ad validation failed with query " + str(query) + ", raised error " + str(error.messages) + ".")
                
                query_dict['listings'].append(listing_dict)

                # sleep to avoid ip block
                time.sleep(self.config['search_delay'])
            
            query_dict['listings'] = sorted(query_dict['listings'], key=lambda listing : listing['price'])
            
            prices = pd.Series([listing['price'] for listing in query_dict['listings']])
            query_dict['lowest_price'] = query_dict['listings'][prices.idxmin()]
            query_dict['highest_price'] = query_dict['listings'][prices.idxmax()]
            median_idx = len(prices) / 2
            query_dict['median_price'] = query_dict['listings'][floor(median_idx)]

            validated_query : dict
            try:
                validated_query = QuerySchema().load(query_dict)
            except ValidationError as error:
                raise Exception("Query validation failed with query " + str(query) + ", raised error " + str(error.messages) + ".")
            
            self.items.update_one({'_id': item['_id']}, {'$push': {'history': validated_query}})