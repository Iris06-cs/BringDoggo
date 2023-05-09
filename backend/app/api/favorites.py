from flask import Blueprint, jsonify,request
from flask_login import current_user,login_required
from ..models import Favorite,db,Restaurant
from flask_login import current_user,login_required
from datetime import datetime
from ..utils.error_handler import ValidationError,NotFoundError,ForbiddenError,validation_errors_to_error_messages
from ..forms import FavoriteForm

favorite_routes=Blueprint("favorites",__name__)

#get current user favorite collection
@favorite_routes.route("/current")
@login_required
def get_current_user_favorites():
    """
    Query for favorite collections of current user
    """
    user_favorites=Favorite.query.filter(Favorite.user_id==current_user.id).all()
    favorite_list=[user_favorite.to_dict() for user_favorite in user_favorites]
    return jsonify({'Favorites':favorite_list}),200


# create a new favorite collection
@favorite_routes.route("/current",methods=["POST"])
@login_required
def create_new_favorite():
    """
    Create a favorite collection
    """
    form=FavoriteForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        favorite=Favorite(
            title=form.data['title'],
            description=form.data['description'],
            is_public=form.data['is_public'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            user_id=current_user.id,
        )
        db.session.add(favorite)
        db.session.commit()
        return jsonify(favorite.to_dict()),201
    # Handle 400 ValidationError
    raise ValidationError(f"Validation Error: {validation_errors_to_error_messages(form.errors)}")


#add a restaurant to favorite collection by id
@favorite_routes.route("/<favoriteId>/restaurants/<restaurantId>",methods=['POST'])
@login_required
def add_restaurant_to_favorite(restaurantId,favoriteId):
    """
    Add a restaurant to a favorite collection by id
    """
    existing_favorite=Favorite.query.filter(Favorite.id==favoriteId).first()
    if not existing_favorite:
        raise NotFoundError(f"Favorite collection with ID {favoriteId} not found")
    restaurant=Restaurant.query.filter(Restaurant.id==restaurantId).first()
    if not restaurant:
        raise NotFoundError(f"Restaurant with ID {restaurantId} not found")
    existing_favorite.fav_restaurants.append(restaurant)
    db.session.commit()
    return jsonify(existing_favorite.to_dict()),200


# edit a favorite collection
@favorite_routes.route("/<favoriteId>",methods=["PUT"])
@login_required
def update_favorite_by_id(favoriteId):
    """
    Update a favorite collection by id
    """
    existing_favorite=Favorite.query.filter(Favorite.id==favoriteId).first()
    if not existing_favorite:
        raise NotFoundError(f"Favorite collection with ID {favoriteId} not found")
    if existing_favorite.user_id!=current_user.id:
        raise ForbiddenError("Only owner can update favortie")

    form=FavoriteForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        existing_favorite.title=form.data['title']
        existing_favorite.description=form.data['description']
        existing_favorite.is_public=form.data['is_public']
        existing_favorite.updated_at=datetime.utcnow()
        existing_favorite.user_id=current_user.id

        db.session.commit()
        return jsonify(existing_favorite.to_dict()),200
    # Handle 400 ValidationError
    raise ValidationError(f"Validation Error: {validation_errors_to_error_messages(form.errors)}")


# remove restaurant from favorite collection
@favorite_routes.route("/<favoriteId>/restaurants/<restaurantId>",methods=['DELETE'])
@login_required
def remove_restaurant_from_favorite(favoriteId,restaurantId):
    """
    Revmoe a restaurant from a favorite collection
    """
    existing_favorite=Favorite.query.filter(Favorite.id==favoriteId).first()
    if not existing_favorite:
        raise NotFoundError(f"Favorite collection with ID {favoriteId} not found")
    restaurant = Restaurant.query.get(restaurantId)
    if not restaurant:
        raise NotFoundError(f"Restaurant with ID {restaurantId} not found")
    if restaurant not in existing_favorite.fav_restaurants:
        raise NotFoundError(f"Restaurant with ID {restaurantId} not found in the collection")
    if existing_favorite.user_id!=current_user.id:
        raise ForbiddenError("Only owner can delete restaurants from favorties")

    existing_favorite.fav_restaurants.remove(restaurant)
    db.session.commit()
    return {"message": "Restaurant successfully removed from favorite collection"}, 200


# delete favorite collection
@favorite_routes.route("/<favoriteId>",methods=["DELETE"])
@login_required
def delete_favorite_collection(favoriteId):
    """
    Delete favorite collection by id
    """
    existing_favorite=Favorite.query.filter(Favorite.id==favoriteId).first()
    if not existing_favorite:
        raise NotFoundError(f"Favorite collection with ID {favoriteId} not found")
    if existing_favorite.user_id!=current_user.id:
        raise ForbiddenError("Only owner can delete restaurants from favorties")

    db.session.delete(existing_favorite)
    db.session.commit()
    return {"message": "Favorite collection successfully deleted"}, 200

@favorite_routes.route("/")
def get_all_reviews():
    """
    Get all favs
    """
    all_favs=Favorite.query.all()

    return {"Favorites":[favorite.to_dict() for favorite in all_favs]},200
