from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models
from utils import blacklist, decode_access_token, get_user_by_email

    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if token in blacklist:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    payload = decode_access_token(token)
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user = get_user_by_email(db, username)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user
