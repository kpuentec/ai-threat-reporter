import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from config import SUPABASE_URL, SUPABASE_ANON_KEY

"""
auth_service.py : Verifies Supabase JWTs in FastAPI requests.
Frontend sends:  Authorization: Bearer <supabase_access_token>
We verify it and extract the user_id (sub claim).
"""

bearer_scheme = HTTPBearer()

""" 
Supabase signs JWTs with the anon key as the secret
Algorithm is HS256 
"""
_JWKS_SECRET = SUPABASE_ANON_KEY
_ALGORITHM   = "HS256"
_AUDIENCE    = "authenticated"

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    """
    FastAPI dependency : call as:  user_id: str = Depends(verify_token)
    Returns the authenticated user's UUID string.
    Raises 401 if token is missing, expired, or invalid.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            _JWKS_SECRET,
            algorithms=[_ALGORITHM],
            audience=_AUDIENCE,
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject claim.",
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
        )