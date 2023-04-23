import os
import requests
from ..config import Config
from flask import Blueprint, jsonify
from ..models import Restaurant,db
from datetime import datetime, timedelta


restaurant_routes=Blueprint('restaurants',__name__)

def get_dog_friendly_restaurants_sd(limit=20, offset=0):
    url = "https://api.yelp.com/v3/businesses/search"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {Config.YELP_API_KEY}"
    }
    params = {
        "term": "dog allowed",
        "location": "San Diego",
        "limit": limit,
        "offset": offset
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

def get_restaurant_by_id(id):
    url=f"https://api.yelp.com/v3/businesses/{id}"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {Config.YELP_API_KEY}"
    }
    response = requests.get(url, headers=headers)
    return response.json()

@restaurant_routes.route("/")
def all_restaurants():

    restaurants=Restaurant.query.all()
    # no cached data, request from api
    if not restaurants:
        fetched_restaurants=get_dog_friendly_restaurants_sd()['businesses']
        for restaurant in fetched_restaurants:
            restaurant_field={
                'id':restaurant['id'],
                'name':restaurant['name'],
                'is_closed':restaurant['is_closed'],
                'url':restaurant['url'],
                'display_phone':restaurant['display_phone'],
                'review_count':restaurant['review_count'],
                'categories':restaurant['categories'],
                'rating':restaurant['rating'],
                'price':restaurant.get('price',None),
                # 'hours':restaurant['hours'],
                'address':restaurant['location']['address1'],
                'city':restaurant['location']['city'],
                'state':restaurant['location']['state'],
                'zipcode':restaurant['location']['zip_code'],
                'lat':restaurant['coordinates']['latitude'],
                'lng':restaurant['coordinates']['longitude'],
                'distance':restaurant['distance']
            }
            # Check if the restaurant already exists in the database
            existing_restaurant = Restaurant.query.filter_by(id=restaurant_field['id']).first()
            if not existing_restaurant:
            # If it doesn't exist, create a new Restaurant object and add it to the database
                new_restaurant = Restaurant(**restaurant_field)
                db.session.add(new_restaurant)
            else:
            # cached data over 24hrs, request from api
                if datetime.utcnow()-existing_restaurant.fetched_at>timedelta(hours=24):
                    existing_restaurant.name=restaurant_field['name']
                    existing_restaurant.is_closed=restaurant_field['is_closed']
                    existing_restaurant.url=restaurant_field['url']
                    existing_restaurant.display_phone=restaurant_field['display_phone']
                    existing_restaurant.review_count=restaurant_field['review_count']
                    existing_restaurant.categories=restaurant_field['categories']
                    existing_restaurant.rating=restaurant_field['rating']
                    existing_restaurant.price=restaurant_field['price']
                    # existing_restaurant.hours=restaurant_field['hours']
                    existing_restaurant.address=restaurant_field['address']
                    existing_restaurant.city=restaurant_field['city']
                    existing_restaurant.state=restaurant_field['state']
                    existing_restaurant.zipcode=restaurant_field['zipcode']
                    existing_restaurant.lat=restaurant_field['lat']
                    existing_restaurant.lng=restaurant_field['lng']
                    existing_restaurant.distance=restaurant_field['distance']
                    existing_restaurant.fetched_at=datetime.utcnow()
    db.session.commit()

    updated_restaurants = Restaurant.query.all()
    return jsonify([restaurant.to_dict() for restaurant in updated_restaurants])


@restaurant_routes.route("/<restaurant_Id>")
def get_restaurant_detail(restaurant_Id):
    # restaurant_id record fetched over 24 hours,update record
    # missing detail info
    existing_restaurant = Restaurant.query.filter_by(id=restaurant_Id).first()
    if datetime.utcnow()-existing_restaurant.fetched_at>timedelta(hours=24) or not existing_restaurant.hours:
        fetched_restaurant=get_restaurant_by_id(existing_restaurant.id)
        existing_restaurant.name=fetched_restaurant['name']
        existing_restaurant.is_closed=fetched_restaurant['is_closed']
        existing_restaurant.url=fetched_restaurant['url']
        existing_restaurant.display_phone=fetched_restaurant['display_phone']
        existing_restaurant.review_count=fetched_restaurant['review_count']
        existing_restaurant.categories=fetched_restaurant['categories']
        existing_restaurant.rating=fetched_restaurant['rating']
        existing_restaurant.price=fetched_restaurant.get('price',None)
        existing_restaurant.hours=fetched_restaurant['hours']
        existing_restaurant.address=fetched_restaurant['location']['address1']
        existing_restaurant.city=fetched_restaurant['location']['city']
        existing_restaurant.state=fetched_restaurant['location']['state']
        existing_restaurant.zipcode=fetched_restaurant['location']['zip_code']
        existing_restaurant.lat=fetched_restaurant['coordinates']['latitude']
        existing_restaurant.lng=fetched_restaurant['coordinates']['longitude']
        # existing_restaurant.distance=fetched_restaurant['distance']
        existing_restaurant.fetched_at=datetime.utcnow()

        db.session.commit()
    updated_restaurant=Restaurant.query.filter_by(id=restaurant_Id).first()
    return jsonify(updated_restaurant.to_dict())
