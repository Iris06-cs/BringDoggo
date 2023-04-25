from flask import Blueprint, jsonify
from flask_login import login_required
from ..models import User,Review

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
# @login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route("/<int:id>/reviews")
def get_current_user_reviews(id):
    """
    Query for all reviews of a user by id
    """
    user_reviews=Review.query.filter(Review.author_id==id).all()
    reviews_list=[user_review.to_dict() for user_review in user_reviews]
    return jsonify({'Reviews':reviews_list})
