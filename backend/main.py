from fastapi import FastAPI, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import hmac
from database import get_db, engine
from models import Base
from schemas import (UserCreate, Token, ForgotPasswordIn, 
                    PasswordResetIn, VerificationTokenIn)
import secrets
from crud import create_user
from utils import (create_access_token, get_user_by_email, get_user_by_password_reset_token, 
                   get_user_by_verification_token,
                   verify_password, get_password_hash, hash_token,
                        get_user_by_status,
                        decode_access_token,
                        get_user_by_access_token,
                   blacklist)
from auth import oauth2_scheme
from mailer import send_verification_email, send_password_reset_email
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")

api = APIRouter(prefix="/api", tags=["auth"])
admin_api = APIRouter(prefix="/api/admin", tags=["admin"])


app = FastAPI(
    title="Bitva Application",
    docs_url="/api/docs",
    description="API for user registration, login, and password management",
    version="1.0.0"
)
RESET_TTL_MINUTES = 30

Base.metadata.create_all(bind=engine)

@api.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    if '@' not in user.email:
        raise HTTPException(status_code=400, detail="Invalid email format")

    verification_token = secrets.token_urlsafe()
    verification_hash = hash_token(verification_token)

    db_user = create_user(db, user)

    # Update user with verification token and expiry
    db_user.verification_token = verification_hash
    db_user.verification_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=30)

    db.commit()
    db.refresh(db_user)

    send_verification_email(
        db_user.email, 
        f"{FRONTEND_URL}/verify?token={verification_token}")

    return {
        "User Email": db_user.email,
        "User Name": db_user.name,
        "msg": "User registered successfully"
    }

@api.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Use username field as email
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    access_token = create_access_token(data={"sub": user.email})
    return {
        "name": user.name,
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }

@admin_api.post("/login", response_model=Token)
def admin_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Use username field as email
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    access_token = create_access_token(data={"sub": user.email})
    print(user.email)
    return {
        "name": user.name,
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }

@api.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    """
    Logs out the user by blacklisting the provided access token.
    The token is automatically extracted from the Authorization header (Bearer token).
    """
    blacklist.add(token)
    return {"msg": "User logged out successfully"}


@api.post("/reset_password")
def reset_password(
    data: PasswordResetIn, db: Session = Depends(get_db)
):
    token_hash = hash_token(data.token)
    user = get_user_by_password_reset_token(db, token_hash)

    if not user:
        raise HTTPException(status_code=404, detail="Invalid token")

    expiry = user.password_reset_token_expiry
    if expiry is not None and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if not expiry or expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if not hmac.compare_digest(user.password_reset_token, token_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired token")


    user.password_reset_token = None
    user.password_reset_token_expiry = None

    new_password = get_password_hash(data.new_password)
    user.password = new_password
    db.commit()

    return {"msg": "Password reset successfully"}


@api.post("/forgot_password")
def forgot_password(
    payload: ForgotPasswordIn,
    db: Session = Depends(get_db)
    ):
    generic_msg = {"msg": "If the account exists, a password reset email will be sent."}

    user = get_user_by_email(db, payload.email)

    if not user:
        return generic_msg

    raw_token = secrets.token_urlsafe()
    token_hash = hash_token(raw_token)

    user.password_reset_token = token_hash
    user.password_reset_token_expiry = datetime.now(timezone.utc) + timedelta(minutes=RESET_TTL_MINUTES)
    
    db.commit()
    db.refresh(user)

    send_password_reset_email(user.email, f"{FRONTEND_URL}/reset-password?token={raw_token}")

    return generic_msg


@api.get("/verify_email")
def verify_email(
    token: str,
    db: Session = Depends(get_db)):

    token_hash = hash_token(token)
    user = get_user_by_verification_token(db, token_hash)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_verified:
        raise HTTPException(status_code=200, detail="Email already verified")

    expiry = user.verification_token_expiry
    if expiry is not None and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if not expiry or expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    if not hmac.compare_digest(user.verification_token, token_hash):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user.is_verified = True
    user.verification_token = None
    user.verification_token_expiry = None
    db.commit()

    return {"msg": "Email verified successfully"}

@api.get("/admin/users/{status}")
def get_users_by_status(status: str, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """
    Retrieve users based on their verification status.
    Status can be 'verified', 'unverified', or 'all'.
    """
    payload = decode_access_token(token)
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user_by_email(db, email)
    if user is None or not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized as admin")

    users = get_user_by_status(db, status)
    # Return empty list if no users found, instead of 404
    return {
        "users": [{"email": u.email, "name": u.name, "is_verified": u.is_verified} for u in users]
    }


app.include_router(api)
app.include_router(admin_api)
