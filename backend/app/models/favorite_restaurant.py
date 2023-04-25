from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class FavoriteRestaurants(db.Model):
    __tablename__='favorite_restaurants'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    favorite_id=db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("favorites.id")),primary_key=True)
    restaurant_id=db.Column(db.String,db.ForeignKey(add_prefix_for_prod("restaurants.id")),primary_key=True)
