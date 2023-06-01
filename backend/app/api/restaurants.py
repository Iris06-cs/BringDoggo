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

def get_dog_friendly_restaurants_sd():
    url = "https://api.yelp.com/v3/businesses/search"
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {Config.YELP_API_KEY}"
    }
    page=1
    limit=50
    results=[]
    # total=0

    while page<=10:
        offset=limit * (page-1)
        params = {
            "term": "restaurants dog allowed dog friendly",
            "location": "San Diego",
            "limit": limit,
            "offset": offset,
            "sort_by":"rating"
    }
        response = requests.get(url, headers=headers, params=params)
        data=response.json()
        if response.status_code == 200:
            results.extend(data.get('businesses', []))
            # total=data.get('total',0)
        else:
            raise Exception(f"Error fetching Yelp results: {data.get('error', {}).get('description', 'Yelp API error')}")
        page+=1

    return results


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
    restaurant_db_count = Restaurant.query.count()
    if restaurant_db_count:
        oldestData = Restaurant.query.order_by(Restaurant.fetched_at.asc()).first()
        if not oldestData or datetime.utcnow() - oldestData.fetched_at > timedelta(hours=24):
            fetched_restaurants = get_dog_friendly_restaurants_sd()
            for restaurant in fetched_restaurants:
                update_or_create_restaurant(restaurant)
            updated_restaurants = Restaurant.query.order_by(Restaurant.review_count.desc()).all()
            return jsonify({"restaurants": [restaurant.to_dict() for restaurant in updated_restaurants]}), 200
        else:
            restaurants = Restaurant.query.order_by(Restaurant.review_count.desc()).all()
            # total_api_results = restaurants[0].total_api_results if restaurants else 0
            return jsonify({"restaurants": [restaurant.to_dict() for restaurant in restaurants]}), 200
    else:
        fetched_restaurants = get_dog_friendly_restaurants_sd()
        for restaurant in fetched_restaurants:
            update_or_create_restaurant(restaurant)
        restaurants = Restaurant.query.order_by(Restaurant.review_count.desc()).all()
        return jsonify({"restaurants": [restaurant.to_dict() for restaurant in restaurants]}), 200


def update_or_create_restaurant(restaurant):
    restaurant_field = {
        'id': restaurant['id'],
        'name': restaurant['name'],
        'is_closed': restaurant['is_closed'],
        'url': restaurant['url'],
        'display_phone': restaurant['display_phone'],
        'review_count': restaurant['review_count'],
        'categories': restaurant['categories'],
        'rating': restaurant['rating'],
        'price': restaurant.get('price', None),
        'address': restaurant['location']['address1'],
        'city': restaurant['location']['city'],
        'state': restaurant['location']['state'],
        'zipcode': restaurant['location']['zip_code'],
        'lat': restaurant['coordinates']['latitude'],
        'lng': restaurant['coordinates']['longitude'],
        'distance': restaurant['distance']
    }

    existing_restaurant = Restaurant.query.filter_by(id=restaurant_field['id']).first()
    if not existing_restaurant:
        new_restaurant = Restaurant(**restaurant_field, fetched_at=datetime.utcnow())
        db.session.add(new_restaurant)
    else:
        for key, value in restaurant_field.items():
            setattr(existing_restaurant, key, value)
        existing_restaurant.fetched_at = datetime.utcnow()
        # existing_restaurant.total_api_results = total_results

    db.session.commit()
    db.session.close()






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
        existing_restaurant.hours=fetched_restaurant.get('hours')
        existing_restaurant.address=fetched_restaurant['location']['address1']
        existing_restaurant.city=fetched_restaurant['location']['city']
        existing_restaurant.state=fetched_restaurant['location']['state']
        existing_restaurant.zipcode=fetched_restaurant['location']['zip_code']
        existing_restaurant.lat=fetched_restaurant['coordinates']['latitude']
        existing_restaurant.lng=fetched_restaurant['coordinates']['longitude']
        # existing_restaurant.distance=fetched_restaurant['distance']
        existing_restaurant.fetched_at=datetime.utcnow()

        db.session.commit()
        db.session.close()
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
        db.session.close()
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
        db.session.close()
        return jsonify(restaurant_image.to_dict()),201
    # Handle 400 ValidationError
    raise ValidationError(f"Validation Error: {validation_errors_to_error_messages(form.errors)}")


@restaurant_routes.route("/clear_cache", methods=["DELETE"])
def clear_cache():
    # Delete all records in the Restaurant table
    db.session.query(Restaurant).delete()
    db.session.commit()
    db.session.close()
    return jsonify({"message": "Cache cleared successfully"}), 200
