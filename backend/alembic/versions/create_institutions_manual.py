"""create_institutions_manual

Revision ID: create_institutions_manual
Revises: 16a5ed3bfad1
Create Date: 2025-09-21 15:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'create_institutions_manual'
down_revision: Union[str, Sequence[str], None] = '16a5ed3bfad1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create institutions table
    op.create_table('institutions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('district', sa.String(), nullable=True),
        sa.Column('panchayat', sa.String(), nullable=True),
        sa.Column('contact_person_name', sa.String(), nullable=False),
        sa.Column('contact_person_mobile', sa.String(), nullable=False),
        sa.Column('contact_person_email', sa.String(), nullable=False),
        sa.Column('total_students', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_institutions_id'), 'institutions', ['id'], unique=False)
    op.create_index(op.f('ix_institutions_code'), 'institutions', ['code'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_institutions_code'), table_name='institutions')
    op.drop_index(op.f('ix_institutions_id'), table_name='institutions')
    op.drop_table('institutions')
