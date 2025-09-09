import models
import jwt
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from fastapi import HTTPException, status
from dotenv import load_dotenv
import os
import hashlib

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
blacklist = set()


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_status(db: Session, status: str):
    if status == "verified":
        users = db.query(models.User).filter(models.User.is_verified == True).all()
    elif status == "unverified":
        users = db.query(models.User).filter(models.User.is_verified == False).all()
    elif status == "all":
        users = db.query(models.User).all()
    elif status == "active":
        users = db.query(models.User).filter(models.User.is_active == True).all()
    elif status == "inactive":
        users = db.query(models.User).filter(models.User.is_active == False).all()
    else:
        raise HTTPException(status_code=400, detail="Invalid status parameter")
    return users


def get_user_by_password_reset_token(db: Session, token: str):
    return db.query(models.User).filter(models.User.password_reset_token == token).first()

def get_user_by_verification_token(db: Session, token: str):
    return db.query(models.User).filter(models.User.verification_token == token).first()

def get_all_verified_users(db: Session):
    return db.query(models.User).filter(models.User.is_verified == True).all()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_verification_token(email: str):
    return create_access_token({"sub": email}, timedelta(minutes=15))

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")