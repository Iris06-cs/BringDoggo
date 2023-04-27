from flask import Blueprint
from ..models import ReviewImage,db
from flask_login import current_user,login_required
from ..utils.error_handler import NotFoundError,ForbiddenError




review_images_routes=Blueprint("review-images",__name__)


@review_images_routes.route("/<review_image_id>",methods=['DELETE'])
@login_required
def delete_review_image(review_image_id):
    """
    Delete review image by id
    """
    review_image=ReviewImage.query.filter_by(id=review_image_id).first()
    if not review_image:
        raise NotFoundError(f"Review image with ID {review_image_id} not found")
    if review_image.user_id!=current_user.id:
        raise ForbiddenError("Only author can delete review image")
    db.session.delete(review_image)
    db.session.commit()
    return {"message": "Review image successfully deleted"}, 200
