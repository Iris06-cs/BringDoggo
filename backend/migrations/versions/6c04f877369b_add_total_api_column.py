"""add total api column

Revision ID: 6c04f877369b
Revises: 9edc7c53b649
Create Date: 2023-04-29 09:42:16.588105

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6c04f877369b'
down_revision = '9edc7c53b649'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_api_results', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('restaurants', schema=None) as batch_op:
        batch_op.drop_column('total_api_results')

    # ### end Alembic commands ###
