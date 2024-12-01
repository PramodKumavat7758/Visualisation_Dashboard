from django.db import models

# Create your models here.
from mongoengine import Document, StringField, IntField

class DataPoint(Document):
    end_year = IntField(required=False, null=True)  # Use IntField for integer fields
    intensity = IntField(required=False, null=True)
    sector = StringField(required=False, allow_blank=True)
    topic = StringField(required=True, allow_blank=False)
    insight = StringField(required=False, allow_blank=True)
    url = StringField(required=False, allow_blank=True)
    region = StringField(required=False, allow_blank=True)
    start_year = IntField(required=False, null=True)
    impact = IntField(required=False, null=True)
    added = StringField(required=False)
    published = StringField(required=False)
    country = StringField(required=False, allow_blank=True)
    relevance = IntField(required=False, null=True)
    pestle = StringField(required=False, allow_blank=True)
    source = StringField(required=False, allow_blank=True)
    title = StringField(required=False, allow_blank=True)
    likelihood = IntField(required=False, null=True)

    meta = {
        'collection': 'data_points'  # This should match the collection name in MongoDB
    }
