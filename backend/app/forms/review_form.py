from flask_wtf import FlaskForm
from wtforms import StringField,IntegerField
from wtforms.validators import DataRequired


class ReviewForm(FlaskForm):
    stars=IntegerField('stars',validators=[DataRequired()])
    review_detail=StringField('review_detail',validators=[DataRequired()])
