from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class ReviewImage(db.Model):
    """
    ReviewImage model representing review images in the application.
    """
    __tablename__='review_images'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    caption=db.Column(db.String(100),nullable=False)
    url=db.Column(db.String,nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow()
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow
    )
    user_id=db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    review_id=db.Column(db.String,db.ForeignKey(add_prefix_for_prod("reviews.id")),nullable=False)

    # relationship
    user=db.relationship("User",back_populates="user_review_images")

    reviews=db.relationship("Review",back_populates="review_images")


    def to_dict(self):
        """
        Convert the ReviewImage object to a dictionary representation.
        """
        return {
            'id': self.id,
            'caption':self.caption,
            'url':self.url,
            'userId':self.user_id,
            'reviewId':self.review_id,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
