from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

class User(db.Model, UserMixin):
    """
    User model representing users in the application.
    """
    __tablename__ = 'users'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    firstname=db.Column(db.String(100),nullable=False)
    lastname=db.Column(db.String(100),nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    profileImage=db.Column(db.String(255))
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow()
    )
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow(), onupdate=datetime.utcnow
    )
    # relationship
    user_reviews=db.relationship("Review",back_populates="users")
    user_favorites=db.relationship("Favorite",back_populates="users")
    user_restaurant_images=db.relationship("RestaurantImages",back_populates="users")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        """
        Check if the provided password matches the stored hashed password
        """
        return check_password_hash(self.password, password)

    def to_dict(self):
        """
        Convert the User object to a dictionary representation.
        """
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'firstname':self.firstname,
            'lastname':self.lastname,
            'profileImage': self.profileImage,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
