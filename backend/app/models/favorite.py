from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Favorite(db.Model):
    __tablename__='favorites'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id=db.Column(db.Integer,primary_key=True)
    title=db.Column(db.String(100),nullable=False)
    description=db.Column(db.String(255),nullable=False)
    is_public=db.Column(db.Boolean,nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow
    )
    user_id=db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    # relationship
    users=db.relationship("User",back_populates="user_favorites")

    restaurants=db.relationship('Restaurant',secondary='favorite_restaurants',back_populates='favorite_restaurants')

    def to_dict(self):
        """
        Convert the Favorite object to a dictionary representation.
        """
        return {
            'id': self.id,
            'title':self.title,
            'description':self.description,
            'isPublic':self.is_public,
            'userId':self.user_id,
            'restaurants':[restaurant.to_dict() for restaurant in self.restaurants],
            'createdAt': self.created_at,
            'updatedAt': self.updated_at,
        }
