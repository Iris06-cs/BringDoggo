from flask_wtf import FlaskForm
from wtforms import StringField,BooleanField
from wtforms.validators import DataRequired


class FavoriteForm(FlaskForm):
    is_public=BooleanField('isPublic',validators=[DataRequired()])
    title=StringField('title',validators=[DataRequired()])
    description=StringField('description',validators=[DataRequired()])
