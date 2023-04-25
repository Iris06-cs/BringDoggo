from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class RestaurantImage(db.Model):
    """
    RestaurantImage model representing restaurant images in the application.
    """
    __tablename__='restaurant_images'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    caption=db.Column(db.String(100),nullable=False)
    url=db.Column(db.String,nullable=False)
    preview=db.Column(db.Boolean,nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow()
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow
    )
    user_id=db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    restaurant_id=db.Column(db.String,db.ForeignKey(add_prefix_for_prod("restaurants.id")),nullable=False)

    # relationship
    user=db.relationship("User",back_populates="user_restaurant_images")

    restaurant=db.relationship("Restaurant",back_populates="restaurant_images")


    def to_dict(self):
        """
        Convert the RestaurantImage object to a dictionary representation.
        """
        return {
            'id': self.id,
            'caption':self.caption,
            'url':self.url,
            'preview':self.preview,
            'userId':self.user_id,
            'restaurantId':self.restaurant_id,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
