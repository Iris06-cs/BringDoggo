from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .favorite_restaurant import FavoriteRestaurant
from sqlalchemy import or_,and_


class Restaurant(db.Model):
    __tablename__='restaurants'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id=db.Column(db.String,primary_key=True)
    name=db.Column(db.String)
    is_closed=db.Column(db.Boolean)
    url=db.Column(db.String)
    display_phone=db.Column(db.String)
    review_count=db.Column(db.Integer)
    categories=db.Column(db.JSON)
    rating=db.Column(db.Float)
    price=db.Column(db.String)
    hours=db.Column(db.JSON)
    address=db.Column(db.String)
    city=db.Column(db.String)
    state=db.Column(db.String)
    zipcode=db.Column(db.Integer)
    lat=db.Column(db.Float)
    lng=db.Column(db.Float)
    distance=db.Column(db.Float)
    fetched_at=db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow()
    )
    total_api_results=db.Column(db.Integer)


    # relationship
    restaurant_images=db.relationship("RestaurantImage",back_populates="restaurant")
    restaurant_reviews=db.relationship("Review",back_populates="reviewed_restaurants")

    favs=db.relationship('Favorite',secondary=FavoriteRestaurant.__table__,back_populates='fav_restaurants')

    def to_dict(self):
        """
        Convert the Restaurant object to a dictionary representation.
        """
        reviews=self.restaurant_reviews
        avg_rating=0
        if reviews:
            avg_rating=round(sum(review.stars for review in reviews)/len(reviews),1)

        return {
            'id': self.id,
            'name':self.name,
            'is_closed':self.is_closed,
            'url':self.url,
            'displayPhone':self.display_phone,
            'reviewCount':self.review_count,
            'rating':self.rating,
            'address':self.address,
            'city':self.city,
            'state':self.state,
            'zipcode':self.zipcode,
            'lat':self.lat,
            'lng':self.lng,
            'price':self.price,
            'distance':self.distance,
            'categories':self.categories,
            'hours':self.hours,
            'fetchedAt': self.fetched_at,
            'dogReviewCount':len(self.restaurant_reviews),
            'avgRating':avg_rating,
            # 'totalApiResults':self.total_api_results,
            'reviews':[review.to_dict() for review in reviews]

        }

# future for large dataset
    # @classmethod
    # def filtered_restaurants(cls,price=None,rating=None):
    #     query=cls.query
    #     if price and rating:
    #         query=query.filter(and_(cls.price==price,cls.rating>=rating))
    #     elif price:
    #         query=query.filter(cls.price==price)
    #     elif rating:
    #         query=query.filter(cls.rating>=rating)

    #     return query.all()


    # @classmethod
    # def search_restaurant_by_keyword(cls,keyword=None):
    #     # keyword in category or in restaurant name
    #     search_results=cls.query.filter(or_(cls.name.ilike(f'%{keyword}%'), cls.categories.op('@>')(db.cast([keyword], db.ARRAY(db.String())))).all())
    #     return search_results


    # @classmethod
    # def search_restaurant_by_location(cls,location=None):
    #     # location can be address neighborhood zipcode...
    #     pass
