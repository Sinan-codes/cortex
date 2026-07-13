from fastapi import Depends
from sqlalchemy.orm import Session

from db.database import get_db
from models.user import User

DEV_USER_EMAIL = "dev@cortex.local"


def get_current_user(db: Session = Depends(get_db)) -> User:
    """Stand-in for real auth. Returns a single seeded dev user, creating it on first use."""
    user = db.query(User).filter(User.email == DEV_USER_EMAIL).first()
    if user is None:
        user = User(email=DEV_USER_EMAIL, hashed_password="", full_name="Dev User")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
