"""anonymous session users

Revision ID: 9183a7e597d5
Revises: a7e31b324559
Create Date: 2026-07-15 15:16:41.843138

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector.sqlalchemy


# revision identifiers, used by Alembic.
revision: str = '9183a7e597d5'
down_revision: Union[str, Sequence[str], None] = 'a7e31b324559'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('session_token', sa.String(length=64), nullable=True))
    op.alter_column('users', 'email', existing_type=sa.String(length=255), nullable=True)
    op.alter_column('users', 'hashed_password', existing_type=sa.String(length=255), nullable=True)

    # Drop the old seeded dev user (and cascade its test documents/conversations) — it predates
    # sessions and has no token to backfill.
    op.execute("DELETE FROM users WHERE session_token IS NULL")

    op.alter_column('users', 'session_token', existing_type=sa.String(length=64), nullable=False)
    op.create_index(op.f('ix_users_session_token'), 'users', ['session_token'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_users_session_token'), table_name='users')
    op.alter_column('users', 'hashed_password', existing_type=sa.String(length=255), nullable=False)
    op.alter_column('users', 'email', existing_type=sa.String(length=255), nullable=False)
    op.drop_column('users', 'session_token')
