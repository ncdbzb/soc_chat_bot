"""add user_id to request_statistic

Revision ID: ec5541b43455
Revises: 0ff9c2703fe8
Create Date: 2024-07-08 21:02:06.249448

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ec5541b43455'
down_revision: Union[str, None] = '0ff9c2703fe8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('request_statistic', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'request_statistic', 'user', ['user_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'request_statistic', type_='foreignkey')
    op.drop_column('request_statistic', 'user_id')
    # ### end Alembic commands ###