from marshmallow import Schema, fields, ValidationError, EXCLUDE
from bson.objectid import ObjectId
from enum import Enum

class ObjectIdField(fields.Field):

    def _serialize(self, value, attr, obj, **kwargs):
        return str(value)
    
    def _deserialize(self, value, attr, obj, **kwargs):
        try:
            return ObjectId(value)
        except:
            return ValidationError("Invalid Object ID provided")

class ListingSchema(Schema):
    d_pid = fields.Int(required = True)
    url = fields.URL(required = True)
    price = fields.Float(required = True)

    class Meta:
        unknown = EXCLUDE

class QuerySchema(Schema):
    datetime = fields.DateTime(required = True)
    median_price = fields.Nested(ListingSchema, required = True)
    lowest_price = fields.Nested(ListingSchema, required = True)
    highest_price = fields.Nested(ListingSchema, required = True)
    quantity = fields.Int(required = True)
    listings = fields.List(fields.Nested(ListingSchema), required = True)

    class Meta:
        unknown = EXCLUDE

class AlertSchema(Schema):
    tracking = fields.String()
    critical_point = fields.Number(required=True)
    greater_than = fields.Boolean()
    email = fields.String(required=True)
    last_alert = fields.Nested(ListingSchema)

    class Meta:
        unknown = EXCLUDE

class ItemSchema(Schema):
    _id = ObjectIdField()
    name = fields.String(required = True)
    query = fields.String(required = True)
    category = fields.String(required = True)
    filters = fields.String()
    median_price = fields.Nested(ListingSchema)
    lowest_price = fields.Nested(ListingSchema)
    highest_price = fields.Nested(ListingSchema)
    history = fields.List(fields.Nested(QuerySchema))
    alerts = fields.List(fields.Nested(AlertSchema))

    class Meta:
        unknown = EXCLUDE

class ConfigSchema(Schema):
    _id = ObjectIdField()
    city = fields.String(load_default="seattle")
    max_searches = fields.Int(load_default=30)
    search_delay = fields.Int(load_default=1)
    query_delay_hours = fields.Int(load_default=24)

    class Meta:
        unknown = EXCLUDE