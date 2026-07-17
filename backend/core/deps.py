import secrets

from fastapi import Depends, Request, Response
from sqlalchemy.orm import Session

from db.database import get_db
from models.user import User

SESSION_COOKIE_NAME = "cortex_session"
SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30  # 30 days


def get_current_user(request: Request, response: Response, db: Session = Depends(get_db)) -> User:
    """Identifies the caller via an anonymous session cookie, minting a new session on first visit."""
    token = request.cookies.get(SESSION_COOKIE_NAME)
    user = db.query(User).filter(User.session_token == token).first() if token else None

    if user is None:
        token = secrets.token_urlsafe(32)
        user = User(session_token=token)
        db.add(user)
        db.commit()
        db.refresh(user)
        response.set_cookie(
            SESSION_COOKIE_NAME,
            token,
            max_age=SESSION_COOKIE_MAX_AGE,
            httponly=True,
            samesite="none",
            secure=True,
        )

    return user
