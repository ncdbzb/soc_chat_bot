"""empty message

Revision ID: a4e3cbde5f92
Revises: 7274eeb44a12
Create Date: 2024-09-11 08:01:45.015501

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a4e3cbde5f92'
down_revision: Union[str, None] = '7274eeb44a12'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('test_system', sa.Column('generation_attempts', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('test_system', 'generation_attempts')
    # ### end Alembic commands ###