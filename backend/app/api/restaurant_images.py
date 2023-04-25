from flask import Blueprint
from ..models import RestaurantImage,db
from flask_login import current_user,login_required
from ..utils.error_handler import NotFoundError,ForbiddenError




restaurant_images_routes=Blueprint("restaurant-images",__name__)


@restaurant_images_routes.route("/<restaurant_image_id>",methods=['DELETE'])
@login_required
def delete_restaurant_image(restaurant_image_id):
    """
    Delete restaurant image by id
    """
    restaurant_image=RestaurantImage.query.filter_by(id=restaurant_image_id)
    if not restaurant_image:
        raise NotFoundError(f"Restaurant image with ID {restaurant_image_id} not found")
    if restaurant_image.user_id!=current_user.id:
        raise ForbiddenError("Only author can delete restaurant image")
    db.session.delete(restaurant_image)
    db.session.commit()
    return {"message": "Restaurant image successfully deleted"}, 200
