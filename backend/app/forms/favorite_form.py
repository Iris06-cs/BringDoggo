from flask_wtf import FlaskForm
from wtforms import StringField,BooleanField
from wtforms.validators import DataRequired


class FavoriteForm(FlaskForm):
    is_public=BooleanField('is_public')
    title=StringField('title',validators=[DataRequired()])
    description=StringField('description',validators=[DataRequired()])
