from marshmallow import Schema, fields, ValidationError
from bson.objectid import ObjectId

class ObjectIdField(fields.Field):

    def _serialize(self, value, attr, obj, **kwargs):
        return str(value)
    
    def _deserialize(self, value, attr, obj, **kwargs):
        try:
            return ObjectId(value)
        except:
            return ValidationError("Invalid Object ID provided")

class ListingSchema(Schema):
    p_id = fields.Int(required = True)
    url = fields.URL(required = True)
    price = fields.Float(required = True)

class QuerySchema(Schema):
    median_price = fields.Nested(ListingSchema, required = True)
    lowest_price = fields.Nested(ListingSchema, required = True)
    highest_price = fields.Nested(ListingSchema, required = True)
    quantity = fields.Int(required = True)
    listings = fields.List(fields.Nested(ListingSchema), required = True)

class ItemSchema(Schema):
    _id = ObjectIdField()
    name = fields.String(required = True)
    query = fields.String(required = True)
    category = fields.String(required = True)
    filters = fields.String()
    median_price = fields.Nested(ListingSchema)
    lowest_price = fields.Nested(ListingSchema)
    highest_price = fields.Nested(ListingSchema)
    history = fields.Dict(keys = fields.DateTime, values = fields.Nested(QuerySchema))