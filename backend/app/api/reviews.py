from flask import Blueprint, jsonify,request
from ..models import Review,db
from flask_login import current_user,login_required
from ..utils.error_handler import ValidationError,NotFoundError,ForbiddenError,validation_errors_to_error_messages
from ..forms import ReviewForm
from datetime import datetime


review_routes=Blueprint("reviews",__name__)

# get current user reviews
@review_routes.route("/current")
@login_required
def get_current_user_reviews():
    """
    Query for all reviews of current user
    """
    user_reviews=Review.query.filter(Review.author_id==current_user.id).all()
    reviews_list=[user_review.to_dict() for user_review in user_reviews]
    return jsonify({'Reviews':reviews_list}),200


# edit review
@review_routes.route("/<reviewId>",methods=["PUT"])
@login_required
def edit_review_by_id(reviewId):
    """
    Edit review by id
    """
    existing_review=Review.query.filter_by(id=reviewId).first()
    if not existing_review:
        raise NotFoundError(f"Review with ID {reviewId} not found")
    elif existing_review.author_id !=current_user.id:
        raise ForbiddenError("Only author can update the review.")
    else:
        form=ReviewForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            existing_review.review=form.data['review']
            existing_review.stars=form.data['stars']
            existing_review.updated_at=datetime.utcnow()

            db.session.commit()
            return jsonify(existing_review.to_dict()),200

        # Handle 400 ValidationError
        raise ValidationError(f"Validation Error: {validation_errors_to_error_messages(form.errors)}")

# delete review
@review_routes.route("/<reviewId>",methods=['DELETE'])
@login_required
def delete_review_by_id(reviewId):
    """
    Delete review by id
    """
    existing_review=Review.query.filter_by(id=reviewId).first()
    if not existing_review:
        raise NotFoundError(f"Review with ID {reviewId} not found")
    elif existing_review.author_id !=current_user.id:
        raise ForbiddenError("Only author can delete the review.")
    existing_review.delete()
    db.session.commit()
    return {"message": "Review successfully deleted"}, 200
