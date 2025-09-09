"""add created at to User

Revision ID: 4c8823c82e1e
Revises: d999196955dd
Create Date: 2025-09-09 14:41:54.785018

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4c8823c82e1e'
down_revision: Union[str, Sequence[str], None] = 'd999196955dd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
