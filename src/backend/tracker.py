from pymongo.database import Database
from pymongo.collection import Collection
import craigslistscraper as cs
import json
import asyncio

class Tracker:

    db : Database
    items : Collection
    config : Collection

    def __init__(self, database : Database) -> None:
        db = database
        items = database.items
        config = database.config