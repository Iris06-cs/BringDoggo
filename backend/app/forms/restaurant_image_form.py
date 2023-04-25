from flask_wtf import FlaskForm
from wtforms import StringField,BooleanField
from wtforms.validators import DataRequired


class RestaurantImageForm(FlaskForm):
    caption=StringField('caption',validators=[DataRequired()])
    url=StringField('url',validators=[DataRequired()])
    preview=BooleanField('preview',validators=[DataRequired()])
