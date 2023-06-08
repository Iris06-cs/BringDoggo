from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField,BooleanField
from wtforms import SubmitField
from wtforms.validators import DataRequired
from ..utils.aws_helper import ALLOWED_EXTENSIONS

class RestaurantImageForm(FlaskForm):
    caption=StringField('caption',validators=[DataRequired()])
    image=FileField('Image File',validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    preview=BooleanField('is_preview',validators=[DataRequired()])
    submit = SubmitField("Upload Photo")
