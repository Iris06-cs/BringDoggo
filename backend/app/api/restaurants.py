import os
import requests
from ..config import Config
from flask import Blueprint, jsonify,request
from ..models import Restaurant,db,Review,RestaurantImage
from datetime import datetime, timedelta
from flask_login import login_required,current_user
from ..forms import ReviewForm,RestaurantImageForm
from ..utils.error_handler import ValidationError,NotFoundError,ForbiddenError,validation_errors_to_error_messages


restaurant_routes=Blueprint('restaurants',__name__)

def get_dog_friendly_restaurants_sd(page=1):
    url = "https://api.yelp.com/v3/businesses/search"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {Config.YELP_API_KEY}"
    }
    if page<1:
        return
    limit=40
    offset=limit * (page-1)
    params = {
        "term": "dog allowed",
        "location": "San Diego",
        "limit": limit,
        "offset": offset
    }

    response = requests.get(url, headers=headers, params=params)
    data=response.json()
    if response.status_code == 200:
        results = data.get('businesses', [])
        # print(data['total'])
    else:
        raise Exception(f"Error fetching Yelp results: {data.get('error', {}).get('description', 'Unknown error')}")

    return results,data['total']


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
    page = int(request.args.get("page", 1))
    # limit 40
    need_fetch_count=page*40
    restaurant_db_count=Restaurant.query.count()
    # cached data is not enough
    if restaurant_db_count<need_fetch_count:
        for i in range(restaurant_db_count//41,page+1):
            fetched_restaurants,total_results=get_dog_friendly_restaurants_sd(i)
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
        if total_results>1000:
            # yelp max response returned
            total_results=1000
        updated_restaurants = Restaurant.query.all()
        return jsonify({"restaurants":[restaurant.to_dict() for restaurant in updated_restaurants],"totalResults":total_results}),200
    else:
        # database cached enough data
        offset=40*(page-1)
        restaurants = Restaurant.query.offset(offset).limit(40).all()
        return jsonify({"restaurants": [restaurant.to_dict() for restaurant in restaurants]}), 200



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
    return jsonify(updated_restaurant.to_dict()),200


# get restaurant's reviews
@restaurant_routes.route("/<restaurantId>/reviews")
def get_restaurant_reviews(restaurantId):
    """
    Query for all reviews of restaurant by id
    """
    # Check if the restaurant exists
    restaurant = Restaurant.query.get(restaurantId)
    if not restaurant:
        raise NotFoundError(f"Restaurant with ID {restaurantId} not found")
    reviews=Review.query.filter(Review.restaurant_id==restaurantId).all()
    review_list=[review.to_dict() for review in reviews]
    return jsonify({"Reviews":review_list}),200

# create review
@restaurant_routes.route("/<restaurantId>/reviews",methods=["POST"])
@login_required
def write_review(restaurantId):
    """
    Write a review to a restaurant by id
    """
    # Check if the restaurant exists
    restaurant = Restaurant.query.get(restaurantId)
    if not restaurant:
        raise NotFoundError(f"Restaurant with ID {restaurantId} not found")
    # Check if the user has already reviewed this restaurant
    existing_review=Review.query.filter_by(author_id=current_user.id,restaurant_id=restaurantId).first()
    if existing_review:
        raise ForbiddenError("User has already reviewed this restaurant")

    form=ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        review=Review(
            review_detail=form.data['review_detail'],
            stars=form.data['stars'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            author_id=current_user.id,
            restaurant_id=restaurantId
        )
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict()),201
    # Handle 400 ValidationError

    raise ValidationError(f"Validation Error: {validation_errors_to_error_messages(form.errors)}")


# add image to a restaurant
@restaurant_routes.route("/<restaurantId>/images",methods=["POST"])
@login_required
def add_image_to_restaurant(restaurantId):
    """
    Add image to restaurant by id
    """
    restaurant = Restaurant.query.get(restaurantId)
    if not restaurant:
        raise NotFoundError(f"Restaurant with ID {restaurantId} not found")
    form=RestaurantImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit:
        restaurant_image=RestaurantImage(
            caption=form.data['caption'],
            url=form.data['url'],
            preview=form.data['preview'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            user_id=current_user.id,
            restaurant_id=restaurantId
        )
        db.session.add(restaurant_image)
        db.session.commit()
        return jsonify(restaurant_image.to_dict()),201
    # Handle 400 ValidationError
    raise ValidationError(f"Validation Error: {validation_errors_to_error_messages(form.errors)}")
