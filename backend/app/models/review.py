from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.schema import CheckConstraint
from datetime import datetime

class Review(db.Model):
    """
    Review model representing reviews in the application.
    """
    __tablename__="reviews"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id=db.Column(db.Integer,primary_key=True)
    stars=db.Column(db.Integer,nullable=False)
    review_detail=db.Column(db.String(1000),nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow()
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow
    )
    author_id=db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    restaurant_id=db.Column(db.String,db.ForeignKey(add_prefix_for_prod("restaurants.id")),nullable=False)

    __table_args__ = (
        CheckConstraint("stars >= 1 AND stars <= 5", name="check_stars_range"),
    )
    # relationship
    user=db.relationship("User",back_populates="user_reviews")
    reviewed_restaurants=db.relationship("Restaurant",back_populates="restaurant_reviews")
    images=db.relationship("ReviewImage",back_populates="image_review")
    # images=db.relationship("ReviewImage",backref="image_review")


    def to_dict(self):
        """
        Convert the Review object to a dictionary representation.
        """
        return{
            'id':self.id,
            'stars':self.stars,
            'reviewDetail':self.review_detail,
            'restaurantId':self.restaurant_id,
            'authorId':self.author_id,
            'user':self.user.to_dict(),
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
