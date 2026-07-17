from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request

from core.deps import SESSION_COOKIE_NAME


def _rate_limit_key(request: Request) -> str:
    """Keys by session cookie so each visitor gets their own bucket, falling back to
    IP for the rare request that arrives with no cookie yet."""
    return request.cookies.get(SESSION_COOKIE_NAME) or get_remote_address(request)


limiter = Limiter(key_func=_rate_limit_key)
